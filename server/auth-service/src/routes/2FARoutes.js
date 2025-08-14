import { setup2FAApp, verify2FAAppLogin, verify2FAAppSetup } from "../controllers/app2FAController.js";
import { setup2FAEmail, verify2FAEmailSetup, verify2FALogin } from "../controllers/email2FAController.js";
import { disableTwoFa, enableTwoFa, getTwoFaHandler, makePrimaryHandler } from "../controllers/twoFaController.js";
import { methodTypeSchema, otpCodeSchema } from "../schemas/authSchema.js";
import { strictRateLimit } from "../schemas/rateLimitSchema.js";

async function twoFARoutes(fastify) {
    fastify.post('/app/setup', {
        config: strictRateLimit,
        preHandler: fastify.authenticate,
        handler: setup2FAApp
    });

    fastify.post('/app/verify-setup', {
        config: strictRateLimit,
        schema: {
            body: otpCodeSchema
        },
        preHandler: fastify.authenticate,
        handler: verify2FAAppSetup
    });

    fastify.post('/app/verify-login', {
        config: strictRateLimit,
        schema: {
            body: otpCodeSchema
        },
        preHandler: fastify.authenticate,
        handler: verify2FAAppLogin
    });
    
    fastify.post('/email/setup', {
        config: strictRateLimit,
        preHandler: fastify.authenticate,
        handler: setup2FAEmail
    });
    
    fastify.post('/email/verify-setup', {
        config: strictRateLimit,
        schema: {
            body: otpCodeSchema
        },
        preHandler: fastify.authenticate,
        handler: verify2FAEmailSetup
    });
    
    fastify.post('/email/verify-login', {
        config: strictRateLimit,
        schema: {
            body: otpCodeSchema
        },
        preHandler: fastify.authenticate,
        handler: verify2FALogin
    });

    fastify.get('/', {
        preHandler: fastify.authenticate,
        handler: getTwoFaHandler
    })

    fastify.post('/disable', {
        schema: {
            body: methodTypeSchema
        },
        preHandler: fastify.authenticate,
        handler: disableTwoFa
    })

    fastify.post('/enable', {
        schema: {
            body: methodTypeSchema
        },
        preHandler: fastify.authenticate,
        handler: enableTwoFa
    })

    fastify.post('/primary', {
        schema: {
            body: methodTypeSchema
        },
        preHandler: fastify.authenticate,
        handler: makePrimaryHandler
    })
}

export default twoFARoutes;