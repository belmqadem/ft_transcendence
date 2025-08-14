
export const blockSchema = {
    type: 'object',
    required: ['blockedId'],
    properties: {
        blockedId: { type: 'number' }
    },
    additionalProperties: false
};
