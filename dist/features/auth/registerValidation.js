"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerValidation = void 0;
const celebrate_1 = require("celebrate");
const role_1 = require("./role");
exports.registerValidation = (0, celebrate_1.celebrate)({
    [celebrate_1.Segments.BODY]: celebrate_1.Joi.object().keys({
        firstName: celebrate_1.Joi.string().required(),
        lastName: celebrate_1.Joi.string().required(),
        email: celebrate_1.Joi.string().email().required(),
        password: celebrate_1.Joi.string().min(6).required(),
        role: celebrate_1.Joi.string()
            .valid(role_1.Role.customer, role_1.Role.vendor, role_1.Role.manager)
            .required(),
        businessName: celebrate_1.Joi.when("role", {
            is: role_1.Role.vendor,
            then: celebrate_1.Joi.string().required(),
            otherwise: celebrate_1.Joi.forbidden(),
        }),
    }),
});
