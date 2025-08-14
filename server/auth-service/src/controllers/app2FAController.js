import QRCode from 'qrcode'
import speakeasy from 'speakeasy'
import { findUserById } from '../models/userDAO.js';
import { addToken, findValidTokenByUid } from '../models/tokenDAO.js';
import { createResponse } from '../utils/utils.js';
import {
    findPrimaryTwoFaByUid,
    findTwoFaByUidAndType,
    makeTwoFaPrimaryByUidAndType,
    storeTempSecret,
    updateTempSecret,
    updateUser2FA,
    updateUserSecret
} from '../models/twoFaDAO.js';
import { clearAuthCookies, setAuthCookies } from '../utils/authCookies.js';

export async function setup2FAApp(request, reply) {
    
    try {
        const userId = request.user?.id;
        const user = await findUserById(this.db, userId);
        if (!user)
            return reply.code(401).send(createResponse(401, 'UNAUTHORIZED'));
        
        const secret = speakeasy.generateSecret({
            name: `BHV Club (${user.username})`,
            length: 32
        });
        const otpauthUrl = secret.otpauth_url;
        const qrCodeUrl = await QRCode.toDataURL(otpauthUrl);

        const twoFa = await findTwoFaByUidAndType(this.db, user.id, 'app');
        if (!twoFa)
            await storeTempSecret(this.db, secret.base32, qrCodeUrl, userId);
        else
        {
            if (twoFa.temp_secret)
                return reply.code(400).send(createResponse(400, 'TWOFA_ALREADY_PENDING', { qrCode: twoFa.qrcode_url }));
            if (twoFa.enabled && twoFa.type === 'app')
                return reply.code(400).send(createResponse(400, 'TWOFA_ALREADY_ENABLED'));
            await updateTempSecret(this.db, secret.base32, user.id);
        }
                
        return reply.code(200).send(createResponse(200, 'SCAN_QR', { qrCode: qrCodeUrl }));
    } catch (error) {
        console.log(error);
        return reply.code(500).send(createResponse(500, 'INTERNAL_SERVER_ERROR'));
    }
}

export async function verify2FAAppSetup(request, reply) {
    
    try {
        
        const userId = request.user?.id;
        const user = await findUserById(this.db, userId);
        if (!user)
            return reply.code(401).send(createResponse(401, 'UNAUTHORIZED'));
        
        const twoFa = await findTwoFaByUidAndType(this.db, user.id, 'app');
        if (!twoFa)
            return reply.code(400).send(createResponse(400, 'TWOFA_NOT_SET'));
        else if (twoFa.enabled)
            return reply.code(400).send(createResponse(400, 'TWOFA_ALREADY_ENABLED'));

        const { otpCode } = request.body;
        if (!otpCode)
            return reply.code(401).send(createResponse(401, 'OTP_REQUIRED'));
        
        const isValid = speakeasy.totp.verify({
            secret: twoFa.temp_secret,
            encoding: 'base32',
            token: otpCode,
            window: 1
        })
        if (!isValid)
            return reply.code(401).send(createResponse(401, 'OTP_INVALID'));
        
        await updateUser2FA(this.db, user.id, 'app');
        await updateUserSecret(this.db, user.id);
        const hasPrimary = await findPrimaryTwoFaByUid(this.db, user.id);
        if (!hasPrimary)
            await makeTwoFaPrimaryByUidAndType(this.db, user.id, 'app');
        
        return reply.code(200).send(createResponse(200, 'TWOFA_ENABLED', { isPrimary: ( hasPrimary ? false : true ) }));
    } catch (error) {   
        console.log(error);
        return reply.code(500).send(createResponse(500, 'INTERNAL_SERVER_ERROR'));
    }
}

export async function verify2FAAppLogin(request, reply) {
    
    try {
        
        const userId = request.user?.id;
        const user = await findUserById(this.db, userId);
        if (!user)
            return reply.code(401).send(createResponse(401, 'UNAUTHORIZED'));
        
        const twoFa = await findTwoFaByUidAndType(this.db, user.id, 'app');
        if (!twoFa)
            return reply.code(400).send(createResponse(400, 'TWOFA_NOT_SET'));
        else if (!twoFa.enabled)
            return reply.code(400).send(createResponse(400, 'TWOFA_NOT_ENABLED'));
        
        const { otpCode } = request.body;
        if (!otpCode)
            return reply.code(401).send(createResponse(401, 'OTP_REQUIRED'));
        
        const isValid = speakeasy.totp.verify({
            secret: twoFa.secret,
            encoding: 'base32',
            token: otpCode,
            window: 1
        })
        if (!isValid)
            return reply.code(401).send(createResponse(401, 'OTP_INVALID'));
        
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