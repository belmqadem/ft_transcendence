import { serialize, parse} from 'cookie'

const COOKIES_OPTS = {
    httpOnly: true,
    secure: true,
    sameSite: 'Lax',
    path: '/'
}

export function setAuthCookies(reply, accessToken, refreshToken) {
    const accessTokenCookie = serialize('accessToken', accessToken, {
        ...COOKIES_OPTS,
        maxAge: 60 * 15
    });

    const refreshTokenCookie = serialize('refreshToken', refreshToken, {
        ...COOKIES_OPTS,
        maxAge: 60 * 60 * 24 * 7
    });

    reply.header('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);
}

export function setTempAuthToken(reply, tempToken) {
    const tempTokenCookie = serialize('tempToken', tempToken, {
        ...COOKIES_OPTS,
        maxAge: 60 * 5
    });
    reply.header('Set-Cookie', tempTokenCookie);
}

export function clearTempAuthToken(reply) {
    const tempTokenCookie = serialize('tempToken', '', {
        ...COOKIES_OPTS,
        maxAge: 0
    });

    reply.header('Set-Cookie', tempTokenCookie);
}

export function getTempAuthToken(request) {
    const authCookie = request.headers.cookie || '';
    const cookies = parse(authCookie);
    return cookies.tempToken;
}

export function clearAuthCookies(reply) {
    const accessTokenCookie = serialize('accessToken', '', {
        ...COOKIES_OPTS,
        maxAge: 0
    });
    
    const tempTokenCookie = serialize('tempToken', '', {
        ...COOKIES_OPTS,
        maxAge: 0
    });

    const refreshTokenCookie = serialize('refreshToken', '', {
        ...COOKIES_OPTS,
        maxAge: 0
    });

    reply.header('Set-Cookie', [accessTokenCookie, refreshTokenCookie, tempTokenCookie]);
}

export function getAuthCookies(request) {
    const authCookies = request.headers.cookie || '';
    const cookies = parse(authCookies);
    return {
        accessToken: cookies.accessToken,
        refreshToken: cookies.refreshToken
    };
}