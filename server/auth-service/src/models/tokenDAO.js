
export async function findTokenById(db, id) {
    return await db.get('SELECT * FROM token WHERE id = ?',
        [id]
    );
}

export async function findToken(db, token) {
    return await db.get('SELECT * FROM token WHERE token = ?',
        [token]
    );
}

export async function addToken(db, token, userId) {
    const result = await db.run('INSERT INTO token (token, expires_at, user_id) VALUES (?, DATETIME(\'now\', \'+7 days\'), ?)',
        [token, userId]
    );
    console.log("Token inserted with ID:", result.lastID);
    return result.lastID;
}

export async function revokeToken(db, token) {
    const result = await db.run('UPDATE token SET revoked = 1 where token = ?',
        [token]
    );
    console.log("Token revoked with ID:", result.lastID);
    return result.lastID;
}

export async function findValidTokenByUid(db, uid) {
    return await db.get('SELECT * FROM token WHERE user_id = ? AND revoked = 0 AND expires_at > DATETIME(\'now\')',
        [uid]
    );
}
