import joi from 'joi';

export const featuredValidator = req => {
  const schema = joi.object({
    featured: joi.boolean().optional(),
  });
  return schema.validate(req.query);
};


