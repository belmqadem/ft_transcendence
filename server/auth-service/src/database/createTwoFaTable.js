
export async function createTwoFaTable(db){
    try {
        await db.exec(
            `CREATE TABLE IF NOT EXISTS twofa (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            enabled INTEGER DEFAULT FALSE,
            is_primary INTEGER DEFAULT FALSE,
            is_verified INTEGER DEFAULT FALSE,
            type TEXT CHECK (type IN ('app', 'email')) DEFAULT NULL,
            otp TEXT DEFAULT NULL,
            otp_exp INTEGER NULL,
            secret TEXT DEFAULT NULL,
            temp_secret TEXT DEFAULT NULL,
            qrcode_url TEXT DEFAULT NULL,
            user_id INTEGER NOT NULL,
            FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
            )`
        );
        console.log("TwoFa table created.");
    } catch (err) {
        console.error("Error creating table:", err.message);
    }
}
            