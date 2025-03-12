import { celebrate, Joi, Segments } from "celebrate";

export const createProductValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    stockLevel: Joi.number().required(),
    imageUrls: Joi.array().required(),
    categoryIds: Joi.array().optional()
  }),
});
