import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import { publishEvent } from '../config/rabbitmq.js';
import { sendEmail } from '../utils/email.js';
import { 
  registerSchema, 
  loginSchema, 
  forgotPasswordSchema, 
  resetPasswordSchema 
} from '../validators/auth.js';

// Generate JWT tokens
const generateTokens = (userId, email, role) => {
  const accessToken = jwt.sign(
    { userId, email, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
  
  const refreshToken = jwt.sign(
    { userId, email, role },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
  );
  
  return { accessToken, refreshToken };
};

export const register = async (req, res) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email, password, role = 'user', profile } = value;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists with this email' });
    }

    // Create verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Create user
    const user = new User({
      email,
      password,
      role,
      profile,
      verification: {
        token: verificationToken,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      }
    });

    await user.save();

    // Send verification email
    await sendEmail({
      to: email,
      subject: 'Verify Your Account',
      template: 'verification',
      data: {
        name: profile?.firstName || 'User',
        verificationUrl: `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`
      }
    });

    // Publish user registration event
    await publishEvent('user.events', 'user.registered', {
      userId: user._id,
      email: user.email,
      role: user.role,
      profile: user.profile
    });

    res.status(201).json({
      message: 'User registered successfully. Please check your email for verification.',
      userId: user._id
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

export const login = async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email, password } = value;

    // Find user
    const user = await User.findOne({ email, isActive: true });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if account is locked
    if (user.isLocked) {
      return res.status(423).json({ error: 'Account temporarily locked due to too many failed login attempts' });
    }

    // Verify password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      await user.incLoginAttempts();
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Reset login attempts on successful login
    if (user.loginAttempts > 0) {
      await user.resetLoginAttempts();
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id, user.email, user.role);

    // Save refresh token
    user.refreshTokens.push({ token: refreshToken });
    user.lastLogin = new Date();
    await user.save();

    // Publish login event
    await publishEvent('user.events', 'user.login', {
      userId: user._id,
      email: user.email,
      role: user.role,
      loginTime: new Date()
    });

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        profile: user.profile
      },
      tokens: {
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token required' });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    // Find user and check if refresh token exists
    const user = await User.findById(decoded.userId);
    if (!user || !user.refreshTokens.some(rt => rt.token === refreshToken)) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(
      user._id, 
      user.email, 
      user.role
    );

    // Replace old refresh token with new one
    user.refreshTokens = user.refreshTokens.filter(rt => rt.token !== refreshToken);
    user.refreshTokens.push({ token: newRefreshToken });
    await user.save();

    res.json({
      accessToken,
      refreshToken: newRefreshToken
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(401).json({ error: 'Token refresh failed' });
  }
};

export const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const userId = req.user?.userId;

    if (userId && refreshToken) {
      // Remove refresh token from user
      await User.findByIdAndUpdate(userId, {
        $pull: { refreshTokens: { token: refreshToken } }
      });
    }

    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { error, value } = forgotPasswordSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email } = value;
    const user = await User.findOne({ email, isActive: true });
    
    if (!user) {
      // Don't reveal if email exists
      return res.json({ message: 'If the email exists, a reset link has been sent' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordReset = {
      token: resetToken,
      expires: new Date(Date.now() + 60 * 60 * 1000) // 1 hour
    };
    await user.save();

    // Send reset email
    await sendEmail({
      to: email,
      subject: 'Password Reset Request',
      template: 'password-reset',
      data: {
        name: user.profile?.firstName || 'User',
        resetUrl: `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`
      }
    });

    res.json({ message: 'If the email exists, a reset link has been sent' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Password reset request failed' });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { error, value } = resetPasswordSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { token, password } = value;

    // Find user with valid reset token
    const user = await User.findOne({
      'passwordReset.token': token,
      'passwordReset.expires': { $gt: new Date() },
      isActive: true
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    // Update password and clear reset token
    user.password = password;
    user.passwordReset = undefined;
    user.refreshTokens = []; // Invalidate all refresh tokens
    await user.save();

    // Publish password reset event
    await publishEvent('user.events', 'user.password.reset', {
      userId: user._id,
      email: user.email
    });

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Password reset failed' });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      'verification.token': token,
      'verification.expires': { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired verification token' });
    }

    user.isVerified = true;
    user.verification = undefined;
    await user.save();

    // Publish email verification event
    await publishEvent('user.events', 'user.email.verified', {
      userId: user._id,
      email: user.email,
      role: user.role
    });

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ error: 'Email verification failed' });
  }
};