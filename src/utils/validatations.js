const Joi = require("joi");

const userSchema = Joi.object({
  firstName: Joi.string().min(3).max(50).required(),
  lastName: Joi.string().min(3).max(50).required(),
  emailId: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  age: Joi.number().min(18),
  gender: Joi.string().valid("male", "female", "other").messages({
    "any.only": "Gender must be either male, female, or other",
  }),
  skills: Joi.array().items(Joi.string()).optional(),
});

const loginSchema = Joi.object({
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }).required(),
  password: Joi.string().min(6).required(),
});

const connectionSchema = Joi.object({
    fromUserId:Joi.any().required(),
    toUserId:Joi.string().required(),
    status:Joi.string().valid("ignored", "interested").required()
})

module.exports = {
  userSchema,
  loginSchema,
  connectionSchema
};
