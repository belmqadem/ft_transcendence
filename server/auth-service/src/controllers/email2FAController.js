import { 
    addToken, 
    findValidTokenByUid 
} from '../models/tokenDAO.js';
import { 
    clearOtpCode,
    findPrimaryTwoFaByUid,
    findTwoFaByUidAndType, 
    makeTwoFaPrimaryByUidAndType, 
    storeOtpCode,
    updateOtpCode, 
    updateUser2FA 
} from '../models/twoFaDAO.js';
import { findUserById } from '../models/userDAO.js';
import { clearAuthCookies, setAuthCookies } from '../utils/authCookies.js';
import { createResponse } from '../utils/utils.js';

export async function setup2FAEmail(request, reply) {
    
    try {
        const userId = request.user?.id;
        const user = await findUserById(this.db, userId);
        if (!user)
            return reply.code(400).send(createResponse(401, 'UNAUTHORIZED'));
        
        const otpCode = `${Math.floor(100000 + Math.random() * 900000) }`
        const twoFa = await findTwoFaByUidAndType(this.db, user.id, 'email');
        if (!twoFa)
            await storeOtpCode(this.db, otpCode, userId);
        else
        {
            if (twoFa.enabled)
                return reply.code(400).send(createResponse(400, 'TWOFA_ALREADY_ENABLED'));
            await updateOtpCode(this.db, otpCode, user.id, twoFa.type);
        }

        await this.sendMail(otpCode, user.email);

        return reply.code(200).send(createResponse(200, 'CODE_SENT'));
    } catch (error) {
        console.log(error);
        return reply.code(500).send(createResponse(500, 'INTERNAL_SERVER_ERROR'));
    }
}

export async function verify2FAEmailSetup(request, reply) {
    
    try {
        
        const userId = request.user?.id;
        const user = await findUserById(this.db, userId);
        if (!user)
            return reply.code(400).send(createResponse(401, 'UNAUTHORIZED'));
        
        const twoFa = await findTwoFaByUidAndType(this.db, user.id, 'email');
        if (!twoFa)
            return reply.code(400).send(createResponse(400, 'TWOFA_NOT_SET'));
        else if (twoFa.enabled)
            return reply.code(400).send(createResponse(400, 'TWOFA_ALREADY_ENABLED'));

        const { otpCode } = request.body;
        if (!otpCode)
            return reply.code(401).send(createResponse(401, 'OTP_REQUIRED'));

        console.log(`otpCode : ${twoFa.otp} | otp_exp : ${twoFa.otp_exp}`);
        if (twoFa.otp !== otpCode || twoFa.otp_exp < Date.now())
            return reply.code(401).send(createResponse(401, 'OTP_INVALID'));

        await clearOtpCode(this.db, user.id, twoFa.type);
        await updateUser2FA(this.db, user.id, 'email');
        const hasPrimary = await findPrimaryTwoFaByUid(this.db, user.id);
        if (!hasPrimary)
            await makeTwoFaPrimaryByUidAndType(this.db, user.id, 'email');
        return reply.code(200).send(createResponse(200, 'TWOFA_ENABLED', { isPrimary: ( hasPrimary ? false : true ) }));
    } catch (error) {
        console.log(error);
        return reply.code(500).send(createResponse(500, 'INTERNAL_SERVER_ERROR'));
    }
}

export async function verify2FALogin(request, reply) {
    
    try {
        
        const userId = request.user?.id;
        const user = await findUserById(this.db, userId);
        if (!user)
            return reply.code(400).send(createResponse(401, 'UNAUTHORIZED'));
        
        const twoFa = await findTwoFaByUidAndType(this.db, user.id, 'email');
        if (!twoFa)
            return reply.code(400).send(createResponse(400, 'TWOFA_NOT_SET'));
        else if (!twoFa.enabled)
            return reply.code(400).send(createResponse(400, 'TWOFA_NOT_ENABLED'));
        
        const { otpCode } = request.body;
        if (!otpCode)
            return reply.code(401).send(createResponse(401, 'OTP_REQUIRED'));
        
        if (twoFa.otp !== otpCode || twoFa.otp_exp < Date.now())
            return reply.code(401).send(createResponse(401, 'OTP_INVALID'));
        
        await clearOtpCode(this.db, user.id, twoFa.type);
        
        const accessToken = await this.jwt.signAT({ id: userId });
        const tokenExist = await findValidTokenByUid(this.db, user.id);
        let refreshToken;
        if (tokenExist) {
            refreshToken = tokenExist.token;
        } else {
            refreshToken = this.jwt.signRT({ id: user.id });
            await addToken(this.db, refreshToken, user.id);
        }
        clearAuthCookies(reply);
        setAuthCookies(reply, accessToken, refreshToken);
        return reply.code(200).send(createResponse(200, 'USER_LOGGED_IN'));
    } catch (error) {
        console.log(error);
        return reply.code(500).send(createResponse(500, 'INTERNAL_SERVER_ERROR'));
    }
}