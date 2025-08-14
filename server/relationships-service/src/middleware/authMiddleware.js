import jwt from 'jsonwebtoken';
import { createResponse } from '../utils/utils.js';
import { parse } from 'cookie'

export function getAuthCookies(request) {
    const authCookies = request.headers.cookie || '';
    const cookies = parse(authCookies);
    if (!cookies || !cookies.accessToken || !cookies.refreshToken)
        return null;
    return {
        accessToken: cookies.accessToken,
        refreshToken: cookies.refreshToken
    };
}


export async function verifyToken(request, reply) {
    try {
        let cookie = getAuthCookies(request);
        if (!cookie)
            return reply.code(401).send(createResponse(401, 'UNAUTHORIZED'));
        
        const payload = jwt.verify(cookie.accessToken, process.env.AJWT_SECRET_KEY);
        const idExist = await this.redis.sIsMember('userIds', `${payload.id}`);
        console.log('idExist value: ', idExist);
        if (!idExist)
            return reply.code(401).send(createResponse(401, 'UNAUTHORIZED'));
        request.user = payload;
    } catch (error) {
        if (error.name === 'TokenExpiredError')
            return reply.code(401).send(createResponse(401, 'ACCESS_TOKEN_EXPIRED'))    
        return reply.code(401).send(createResponse(401, 'ACCESS_TOKEN_INVALID'));
    }
}
