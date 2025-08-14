import { emailValidation, passwordValidation, usernameValidation } from "./validationSchemas.js"

export const registerSchema = {
    type: 'object',
    required: ['username', 'email', 'password', 'confirmPassword', 'gender'],
    properties: {
        username:usernameValidation,
        email: emailValidation,
        password: passwordValidation,
        confirmPassword: passwordValidation,
        gender: { enum: ['F', 'M'] }
    },
    additionalProperties: false
}

export const loginSchema = {
    oneOf: [
        {
            type: 'object',
            required: ['username', 'password'],
            properties: {
                username:usernameValidation,
                password: passwordValidation
            },
            additionalProperties: false
        },
        {
            type: 'object',
            required: ['email', 'password'],
            properties: {
                email: emailValidation,
                password: passwordValidation
            },
            additionalProperties: false
        }
    ]
}

export const tokenSchema = {
    type: 'object',
    required: ['token'],
    properties: {
        token: {
            type: 'string',
            pattern: '^[a-zA-Z0-9]\.+$'
        }
    },
    additionalProperties: false
}

export const otpCodeSchema = {
    type: 'object',
    required: ['otpCode'],
    properties: {
        otpCode: {
            type: 'string',
            pattern: '^[0-9]+$',    
            minLength: 6,
            maxLength: 6
        },
        additionalProperties: false
    }
}

export const methodTypeSchema = {
    type: 'object',
    required: ['method'],
    properties: {
        method: { enum: ['app', 'email'] }
    },
    additionalProperties: false
}

export const emailSchema = {
    type: 'object',
    required: ['email'],
    properties: {
        email: emailValidation
    },
    additionalProperties: false
}

export const passwordSchema = {
    type: 'object',
    required: ['password', 'confirmPassword'],
    properties: {
        password: passwordValidation,
        confirmPassword: passwordValidation
    },
    additionalProperties: false
}

export const updateCredentialsSchema = {
  type: 'object',
  properties: {
    email: emailValidation,
    oldPassword: passwordValidation,
    newPassword: passwordValidation,
    confirmNewPassword: passwordValidation
  },
  additionalProperties: false,
  anyOf: [
    { required: ['email'] },
    { required: ['oldPassword', 'newPassword', 'confirmNewPassword'] }
  ]
};
