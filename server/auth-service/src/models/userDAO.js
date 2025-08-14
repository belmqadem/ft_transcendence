
export async function findUserByName(db, username) {
    console.log('fetching user by name...')
    return await db.get('SELECT * FROM user WHERE username = ?',
        [username]
    );
}

export async function findUserByEmail(db, email) {
    console.log('fetching user by email...')
    return await db.get('SELECT * FROM user WHERE email = ?',
        [email]
    );
}

export async function findUserById(db, id) {
    console.log('fetching user by id...')
    return await db.get('SELECT * FROM user WHERE id = ?',
        [id]
    );
}

export async function findUser(db, username, email) {
    console.log('fetching user...')
    return await db.get('SELECT * FROM user WHERE username = ? OR email = ?', 
        [username, email]
    );
}

export async function findOauthIdentity(db, provider, sub) {
    console.log(`fetching OAuth identity...(provider :${provider}, sub: ${sub})`)
    return await db.get('SELECT * FROM oauth_identity WHERE provider = ? AND provider_sub = ?',
        [provider, sub]);
}

export async function addUser(db, username, email, password) {
    const result = await db.run('INSERT INTO user (username, email, password) VALUES (?, ?, ?)',
        [username, email, password]
    );
    console.log("User inserted with ID: ", result.lastID);
    return result.lastID;
}

export async function updateUser(db, id, password) {
    const result = await db.run(`UPDATE user SET password = ?, updated_at = DATETIME('now') WHERE id = ?`, [password, id]);
    console.log("User updated with ID: ", result.changes);
    return result.changes;
}

export async function deleteUser(db, id) {
    const result = await db.run('DELETE FROM user WHERE id = ?',
        [id]
    );

    console.log("User deleted with ID: ", id);
    return result.changes;
}

export async function   addUserAndOAuthIdentity(db, userInfo) {
    const userResult = await db.run('INSERT INTO user (username, email) VALUES (?, ?)',
        [
            userInfo.username,
            userInfo.email
        ]
    );
    console.log('Added user with ID: ', userResult.lastID);

    await db.run('INSERT INTO oauth_identity (user_id, provider, provider_sub, email, access_token, refresh_token) VALUES (?, ?, ?, ?, ?, ?)',
        [
            userResult.lastID,
            userInfo.provider,
            userInfo.sub,
            userInfo.email,
            userInfo.accessToken,
            userInfo.refreshToken
        ]
    );
    console.log("OAuth identity linked with ID: ", userResult.lastID);
    return userResult.lastID;
}

export async function linkOAuthIdentityToUser(db, id, userInfo) {
    await db.run('INSERT INTO oauth_identity (user_id, provider, provider_sub, email, access_token, refresh_token) VALUES (?, ?, ?, ?, ?, ?)',
        [
            id,
            userInfo.provider,
            userInfo.sub,
            userInfo.email,
            userInfo.accessToken,
            userInfo.refreshToken
        ]
    );
    console.log("OAuth identity linked with ID: ", id);
    return id;
}

export async function updateEmailById(db, email, id) {
    const result = await db.run(`UPDATE user SET email = ?, updated_at = DATETIME('now') WHERE id = ?`,
        [email, id]
    );
    console.log('Update email for userId: ', id);
}

export async function updateUsernameById(db, username, id) {
    const result = await db.run(`UPDATE user SET username = ?, updated_at = DATETIME('now') WHERE id = ?`,
        [username, id]
    );
    console.log('Update username for userId: ', id);
}

export async function deleteOAuthIdentitybyUID(db, id) {
    await db.run('DELETE FROM oauth_identity WHERE user_id = ?', 
        [id]
    );
}