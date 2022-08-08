import joi from 'joi';

export const validateOrderCostCalculationRequest = orderCastCalculationRequest => {
  const schema = joi
    .object({
      products: joi
        .array()
        .items(joi.string())
        .required(),
      province: joi
        .string()
        .required()
        .trim(),
      productQuantities: joi
        .array()
        .items(joi.number())
        .required(),
      productIds: joi
        .array()
        .items(joi.string())
        .required(),
      productPrices: joi
        .array()
        .items(joi.number())
        .required(),
    })
    .options({ allowUnknown: true });
  return schema.validate(orderCastCalculationRequest);
};


