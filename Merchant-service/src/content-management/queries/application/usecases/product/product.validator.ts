import joi from 'joi';

export const validateNewProductRequest = newProduct => {
  const schema = joi.object({
    category: joi
      .string()
      .required()
      .trim(),
    productDetails: joi
      .string()
      .required()
      .trim(),
  });
  return schema.validate(newProduct);
};


