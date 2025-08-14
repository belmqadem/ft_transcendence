import { 
    addUserAndOAuthIdentity, 
    findOauthIdentity, 
    findUserByEmail, 
    findUserById, 
    linkOAuthIdentityToUser 
} from "../models/userDAO.js";
import { 
    addToken, 
    findValidTokenByUid 
} from "../models/tokenDAO.js";
import { 
    createResponse, 
    generateUsername 
} from "../utils/utils.js";
import { 
    clearAuthCookies, 
    setAuthCookies 
} from "../utils/authCookies.js";

export async function   fortyTwoSetupHandler(request, reply) {
    
    const url = `https://api.intra.42.fr/oauth/authorize?client_id=${process.env.FORTY_TWO_ID}&redirect_uri=${process.env.FORTY_TWO_REDIRECT_URI}&response_type=code`;
    reply.redirect(url);
}

export async function fortyTwoLoginHandler(request, reply) {
    
    try {
        clearAuthCookies(reply);
        const { code } = request.query;
        if (!code)
            return reply.redirect(process.env.FRONT_END_URL);
        const tokens = await fetch('https://api.intra.42.fr/oauth/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                code,
                client_id: process.env.FORTY_TWO_ID,
                client_secret: process.env.FORTY_TWO_SECRET,
                redirect_uri: process.env.FORTY_TWO_REDIRECT_URI,
                grant_type: 'authorization_code'
            }).toString()
        });

        console.log('42 tokens: ', tokens);
        if (!tokens.ok)
        {
            const errorText = await tokens.text();
            console.log('42 tokens error: ', errorText);
            return reply.redirect(process.env.FRONT_END_URL);
        }

        const { access_token } = await tokens.json();
        const userinfo  = await fetch('https://api.intra.42.fr/v2/me', {
            method: 'GET',
            headers: { Authorization: `Bearer ${access_token}` }
        });

        console.log('User info: ', userinfo);
        const userInfo = await userinfo.json();
        console.log('User Info: ', userInfo);
        const actualInfo = {
            provider: '42',
            sub: userInfo.id,
            email: userInfo.email,
            accessToken: access_token,
            refreshToken: null
        }

        let isNewUser = false;
        let user;
        const oauthId = await findOauthIdentity(this.db, '42', userInfo.id);
        if (oauthId) {
            user = await findUserById(this.db, oauthId.user_id);
            if (user)
                console.log('Already existing user with ID:', user.id);
        } else {
            user = await findUserByEmail(this.db, userInfo.email);
            if (user) {
                console.log(`Existing user with ID : ${user.id} but not linked to 42`);
                await linkOAuthIdentityToUser(this.db, user.id, actualInfo);
            }
            else {
                console.log('New User');
                isNewUser = true;
                const uniqueUserName = await generateUsername(this.db, userInfo.login || userInfo.email.split('@')[0]);
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
                avatar_url: userInfo.image.link
            }, 'profile.user.created');
        }

        return reply.redirect(process.env.FRONT_END_URL);
    } catch (error) {
        console.log(error);
        return reply.redirect(process.env.FRONT_END_URL);;
    }
}

