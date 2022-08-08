import joi from 'joi';

const customJoi = joi.defaults(schema =>
  schema.options({
    allowUnknown: true,
  }),
);

import { AuthProvider } from '../../../domain/models/socialAuth.model';

export const validateLoginCredentials = req => {
  const schema = customJoi
    .object({
      username: joi
        .string()
        .trim()
        .lowercase()
        .required(),
      password: joi
        .string()
        .trim()
        .required(),
      rememberMe: joi.boolean(),
    })
    .options({
      stripUnknown: true,
    });

  const { error, value: body } = schema.validate(req.body);

  return { error, body };
};

export const validatesocialAuthSignInCredentials = req => {
  const schema = customJoi
    .object({
      name: joi
        .string()
        .trim()
        .required(),
      token: joi.string().trim(),
      idToken: joi.string().trim(),
      authToken: joi.string().trim(),
      email: joi
        .string()
        .trim()
        .required(),
      id: joi
        .string()
        .trim()
        .required(),
      provider: joi
        .string()
        .trim()
        .valid(AuthProvider.FACEBOOK, AuthProvider.GOOGLE)
        .required(),
    })
    .options({
      stripUnknown: true,
    });
  const { error, value: body } = schema.validate(req.body);

  return { error, body };
};

export const validateUserRegisterCredentials = req => {
  const schema = customJoi
    .object({
      fullName: joi
        .string()
        .trim()
        .required(),
      password: joi
        .string()
        .trim()
        .min(9)
        .required(),
      email: joi
        .string()
        .trim()
        .empty('')
        .default(null),
      phoneNum: joi.string().required(),
    })
    .options({
      stripUnknown: true,
    });
  const { error, value: body } = schema.validate(req.body);

  return { error, body };
};

export const validateWalletLoginCredentials = req => {
  const schema = customJoi
    .object({
      username: joi
        .string()
        .trim()
        .lowercase()
        .required(),

      password: joi
        .string()
        .trim()
        .required(),
    })
    .options({
      stripUnknown: true,
    });
  const { error, value: body } = schema.validate(req.body);

  return { error, body };
};

export const validateChangeWalletPasswordRequest = req => {
  const schema = customJoi
    .object({
      currentWalletPassword: joi
        .string()
        .trim()
        .required(),
      newWalletPassword: joi
        .string()
        .trim()
        .required()
        .min(9),
      confirmWalletPassword: joi
        .string()
        .trim()
        .required()
        .equal(joi.ref('newWalletPassword')),
    })
    .options({
      stripUnknown: true,
    });
  const { error, value: body } = schema.validate(req.body);

  return { error, body };
};

export const validateResendVerificationEmailRequest = req => {
  const schema = customJoi
    .object({
      email: joi
        .string()
        .trim()
        .lowercase()
        .email()
        .required(),
    })
    .options({
      stripUnknown: true,
    });
  const { error, value: body } = schema.validate(req.body);

  return { error, body };
};

export const validateForgotPasswordRequest = req => {
  const schema = customJoi
    .object({
      email: joi
        .string()
        .trim()
        .lowercase()
        .email()
        .required(),
    })
    .options({
      stripUnknown: true,
    });
  const { error, value: body } = schema.validate(req.body);

  return { error, body };
};

export const validateResetPasswordRequest = req => {
  const schema = customJoi
    .object({
      password: joi
        .string()
        .trim()
        .required()
        .min(9),
      confirmPassword: joi
        .string()
        .trim()
        .required()
        .equal(joi.ref('password')),
    })
    .options({
      stripUnknown: true,
    });
  const { error, value: body } = schema.validate(req.body);

  return { error, body };
};

export const validateChangePasswordRequest = req => {
  const schema = customJoi
    .object({
      currentPassword: joi
        .string()
        .trim()
        .required(),
      newPassword: joi
        .string()
        .trim()
        .required()
        .min(9),
      confirmPassword: joi
        .string()
        .trim()
        .required()
        .equal(joi.ref('newPassword')),
    })
    .options({
      stripUnknown: true,
    });
  const { error, value: body } = schema.validate(req.body);

  return { error, body };
};

export const validateVerifyAccount = req => {
  const schema = customJoi.object({
    verificationToken: joi.string().required(),
  });
  const { error, value: params } = schema.validate(req.params);

  return { error, params };
};

export const validateGetUserByReferralCode = req => {
  const schema = customJoi.object({ id: joi.string().required() });
  const { error, value: params } = schema.validate(req.params);

  return { error, params };
};

export const validateCheckResetPasswordToken = req => {
  const schema = customJoi.object({
    resetPasswordToken: joi.string().required(),
  });
  const { error, value: params } = schema.validate(req.params);

  return { error, params };
};

export const validateForgotWalletPassword = req => {
  const schema = customJoi.object({
    email: joi.string().required(),
  });
  const { error, value: body } = schema.validate(req.body);

  return { error, body };
};


