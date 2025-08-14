import { fortyTwoLoginHandler, fortyTwoSetupHandler } from '../controllers/42OAuthController.js';
import { 
    loginHandler, 
    registerHandler, 
    logoutHandler, 
    meHandler, 
    refreshHandler, 
    verifyCodeHandler, 
    lostPasswordHandler, 
    updatePasswordHandler, 
    updateCredentialsHandler,
    verifyUpdateCredentialsHandler,
    deleteUserDataHandler
} from '../controllers/authController.js';
import { 
    googleLoginHandler, 
    googleSetupHandler 
} from '../controllers/googleOAuthController.js';
import { 
    registerSchema, 
    loginSchema,
    otpCodeSchema, 
    emailSchema,
    passwordSchema, 
    updateCredentialsSchema
} from '../schemas/authSchema.js';
import { strictRateLimit } from '../schemas/rateLimitSchema.js';


async function authRoutes(fastify) {
    fastify.post('/login',  {
        config: strictRateLimit,
        schema: {
            body: loginSchema
        },
        handler: loginHandler
    });

    fastify.post('/register', {
        config: strictRateLimit,
        schema: {
            body: registerSchema
        },
        handler: registerHandler
    });

    fastify.post('/logout', {
        preHandler: fastify.authenticate,
        handler: logoutHandler
    });
    
    fastify.get('/me',{ 
        preHandler: fastify.authenticate,
        handler: meHandler
    } );

    fastify.post('/refresh',{
        handler: refreshHandler
    } );

    fastify.get('/google',{
        config: strictRateLimit,
        handler: googleSetupHandler
    } );

    fastify.get('/google/callback',{
        handler: googleLoginHandler
    } );

    fastify.get('/42',{
        config: strictRateLimit,
        handler: fortyTwoSetupHandler
    } );

    fastify.get('/42/callback',{
        handler: fortyTwoLoginHandler
    } );

    fastify.post('/lost-password', {
        config: strictRateLimit,
        schema: {
            body: emailSchema
        }, 
        handler: lostPasswordHandler
    });

    fastify.post('/verify-code', {
        config: strictRateLimit,
        schema: {
            body: otpCodeSchema
        }, 
        preHandler: fastify.authenticate,
        handler: verifyCodeHandler
    });

    fastify.post('/update-password', {
        config: strictRateLimit,
        schema: {
            body: passwordSchema
        }, 
        preHandler: fastify.authenticate,
        handler: updatePasswordHandler
    });

    fastify.post('/update-credentials', {
        config: strictRateLimit,
        schema: {
            body: updateCredentialsSchema
        }, 
        preHandler: fastify.authenticate,
        handler: updateCredentialsHandler
    });
    
    fastify.post('/verify-update-credentials', {
        config: strictRateLimit,
        schema: {
            body: otpCodeSchema
        }, 
        preHandler: fastify.authenticate,
        handler: verifyUpdateCredentialsHandler
    });

    fastify.delete('/delete', {
        config: strictRateLimit,
        preHandler: fastify.authenticate,
        handler: deleteUserDataHandler
    });
}

export default authRoutes;
