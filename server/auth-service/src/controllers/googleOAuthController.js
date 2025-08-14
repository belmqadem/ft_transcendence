import { addUserAndOAuthIdentity, findOauthIdentity, findUserByEmail, findUserById, linkOAuthIdentityToUser } from "../models/userDAO.js";
import { addToken, findValidTokenByUid } from "../models/tokenDAO.js";
import { createResponse, generateUsername } from "../utils/utils.js";
import { setAuthCookies, clearAuthCookies } from "../utils/authCookies.js";

export async function   googleSetupHandler(request, reply) {
    
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_ID}&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}&response_type=code&scope=profile email&access_type=offline&prompt=consent`;
    reply.redirect(url);
}

export async function googleLoginHandler(request, reply) {
    
    try {
        clearAuthCookies(reply);
        const { code } = request.query;
        if (!code)
            return reply.redirect(process.env.FRONT_END_URL);
        const tokens = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                code,
                client_id: process.env.GOOGLE_ID,
                client_secret: process.env.GOOGLE_SECRET,
                redirect_uri: process.env.GOOGLE_REDIRECT_URI,
                grant_type: 'authorization_code'
            }).toString()
        });

        console.log('Google tokens: ', tokens);
        if (!tokens.ok)
        {
            const errorText = await tokens.text();
            console.log('Google tokens error: ', errorText);
            return reply.redirect(process.env.FRONT_END_URL);
        }

        const { access_token, refresh_token } = await tokens.json();
        const userinfo  = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            method: 'GET',
            headers: { Authorization: `Bearer ${access_token}` }
        });

        const userInfo = await userinfo.json();
        console.log('User info: ', userInfo);
        const actualInfo = {
            provider: 'google',
            sub: userInfo.sub,
            email: userInfo.email,
            accessToken: access_token,
            refreshToken: refresh_token
        }

        let isNewUser = false;
        let user;
        const oauthId = await findOauthIdentity(this.db, 'google', userInfo.sub);
        if (oauthId) {
            user = await findUserById(this.db, oauthId.user_id);
            if (user)
                console.log('Already existing user with ID:', user.id);
        } else {
            user = await findUserByEmail(this.db, userInfo.email);
            if (user) {
                console.log(`Existing user with ID : ${user.id} but not linked to google`);
                await linkOAuthIdentityToUser(this.db, user.id, actualInfo);
            }
            else {
                console.log('New User');
                isNewUser = true;
                const uniqueUserName = await generateUsername(this.db, userInfo.given_name || userInfo.email.split('@')[0]);
                const newUserId = await addUserAndOAuthIdentity(this.db, {
                    username: uniqueUserName,
                    ...actualInfo
                })
                user = await findUserById(this.db, newUserId);
            }
        }

        const accessToken = await this.jwt.signAT({ id: user.id });
        const tokenExist = await findValidTokenByUid(this.db, user.id);
        let refreshToken;
        if (tokenExist) {
            refreshToken = tokenExist.token;
        } else {
            refreshToken = this.jwt.signRT({ id: user.id });
            await addToken(this.db, refreshToken, user.id);
        }
        setAuthCookies(reply, accessToken, refreshToken);
        await this.redis.sAdd(`userIds`, `${user.id}`);
        
        if (isNewUser) {
            this.rabbit.produceMessage({
                type: 'INSERT',
                userId: user.id,
                username: user.username,
                email: user.email,
                avatar_url: userInfo.picture
            }, 'profile.user.created');
        }

        return reply.redirect(process.env.FRONT_END_URL);
    } catch (error) {
        console.log(error);
        return reply.redirect(process.env.FRONT_END_URL);
    }
}