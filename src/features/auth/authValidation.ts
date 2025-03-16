import { celebrate, Joi, Segments } from "celebrate";
import { Role } from "./role";

export const registerValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string()
      .valid(Role.customer, Role.vendor)
      .required(),
    businessName: Joi.when("role", {
      is: Role.vendor,
      then: Joi.string().required(),
      otherwise: Joi.forbidden(),
    }),
  }),
});

export const loginValidation = celebrate({
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});
