import { 
    avatarUrlValidation, 
    booleanValidation, 
    emailValidation,
    integerValidation, 
    usernameValidation 
} from "./validationSchemas.js"

export const createProfileSchema = {
    oneOf: [
        {
            type: 'object',
            required: ['username', 'email', 'gender'],
            properties: {
                username: usernameValidation,
                email: emailValidation,
                gender: { enum: ['F', 'M'] }
            },
            additionalProperties: false
        },
        {
            type: 'object',
            required: ['username', 'email', 'avatar_url'],
            properties: {
                username: usernameValidation,
                email: emailValidation,
                avatar_url: avatarUrlValidation
            },
            additionalProperties: false
        }
    ]
}

export const updateProfileSchema = {
    type: 'object',
    properties: {
        username: usernameValidation,
        rank: integerValidation,
		matches_won: integerValidation,
		matches_lost: integerValidation,
        hasWon: booleanValidation
    },
    minProperties: 1,
    maxProperties: 5,
    additionalProperties: false
}

export const profileIdSchema = {
    type: 'object',
    required: ['id'],
    properties: {
        id: { type: 'number' }
    },
    additionalProperties: false
};

export const fileNameSchema = {
    type: 'object',
    required: [':fileName'],
    properties: {
        fileName: {
            type: 'string',
            pattern: '^[a-zA-Z0-9-_]\.+$'
        }
    }
}