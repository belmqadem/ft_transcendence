export const friendRequestSchema = {
    type: 'object',
    required: ['addresseeId'],
    properties: {
        addresseeId: { type: 'integer', minimum: 1 }
    },
    additionalProperties: false
};

export const friendDecisionSchema = {
    type: 'object',
    required: ['requesterId'],
    properties: {
        requesterId: { type: 'integer', minimum: 1 }
    },
    additionalProperties: false
};


export const deleteFriendSchema = {
    type: 'object',
    required: ['friendId'],
    properties: {
        friendId: { type: 'number' }
    },
    additionalProperties: false
};
