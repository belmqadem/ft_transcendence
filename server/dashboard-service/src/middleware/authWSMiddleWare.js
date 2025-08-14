import jwt from 'jsonwebtoken';
import { parse } from 'cookie'

export function getWSAuthCookies(request) {
    const authCookies = request.headers.cookie || '';
    const cookies = parse(authCookies);
    if (!cookies || !cookies.accessToken || !cookies.refreshToken)
        return null;
    return {
        accessToken: cookies.accessToken,
        refreshToken: cookies.refreshToken
    };
}


export async function verifyWSToken(socket, request, redis) {
    try {
        let cookie = getWSAuthCookies(request);
        if (!cookie) {
            socket.close(3000, 'Unauthorized');
            return ;
        }
        
        const payload = jwt.verify(cookie.accessToken, process.env.AJWT_SECRET_KEY);

        const idExist = await redis.sIsMember('userIds', `${payload.id}`);
        console.log('idExist value: ', idExist);
        if (!idExist) {
            socket.close(3000, 'Unauthorized');
            return ;
        }
        
        socket.userId = payload.id;
        socket.isAuthenticated = true;
        console.log(`WebSocket: User ${socket.userId} authenticated`);
    } catch (error) {
        console.log('WebSocket: ', error);
        socket.close(1008, 'Token invalid');
    }
}