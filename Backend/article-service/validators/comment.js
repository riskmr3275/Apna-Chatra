import Joi from 'joi';

export const createCommentSchema = Joi.object({
  content: Joi.string().min(1).max(1000).required(),
  parentComment: Joi.string().optional()
});

export const updateCommentSchema = Joi.object({
  content: Joi.string().min(1).max(1000).required()
});