export async function getPendingCredentialsByUID(db, id) {
    return await db.get('SELECT new_email, new_password FROM pending_credentials WHERE user_id = ?', [id]);
}

export async function insertPendingCredentials(db, id, email, password) {
    await db.run(
        `INSERT INTO pending_credentials (user_id, new_email, new_password) 
        VALUES (?, ?, ?)
        ON CONFLICT (user_id) DO UPDATE SET 
            new_email = excluded.new_email,
            new_password = excluded.new_password;
        `, [id, email, password]);
}

export async function deletePendingCredentials(db, id) {
    await db.run('DELETE FROM pending_credentials WHERE user_id = ?', [id]);
}

