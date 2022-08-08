import joi, { Schema } from 'joi';

export const ObjectIdSchema: Schema = joi.object({
  id: joi.string().required(),
});


