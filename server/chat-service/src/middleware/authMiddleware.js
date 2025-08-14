import jwt from 'jsonwebtoken';
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

export async function verifyToken(ws, request, redis) {
    try {
        let cookie = getAuthCookies(request);
        if (!cookie) {
            ws.close(3000, 'Unauthorized');
            return ;
        }
        
        const payload = jwt.verify(cookie.accessToken, process.env.AJWT_SECRET_KEY);

        const idExist = await redis.sIsMember('userIds', `${payload.id}`);
        console.log('idExist value: ', idExist);
        if (!idExist) {
            ws.close(3000, 'Unauthorized');
            return ;
        }
        
        ws.userId = payload.id;
        ws.isAuthenticated = true;
        console.log(`WebSocket: User ${ws.userId} authenticated`);
    } catch (error) {
        console.log('WebSocket: ', error);
        ws.close(1008, 'Token invalid');
    }
}