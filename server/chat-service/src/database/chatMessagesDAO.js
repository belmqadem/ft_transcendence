export async function addMessage(db, message) {
    const result = await db.run('INSERT INTO messages (recipient_id, sender_id, content) VALUES (?, ?, ?)',
        [
            message.recipient_id,
            message.sender_id,
            message.content
        ]
    );
    console.log(`Message inserted with ID: ${result.lastID}`);
    return result.lastID;
}

export async function markAsRead(db, id) {
    await db.run('UPDATE messages SET read = 1 AND delivered = 1 WHERE id = ?',
        [id]
    )
}

export async function markAsDelivered(db, id) {
    await db.run('UPDATE messages SET delivered = 1 WHERE id = ?',
        [id]
    )
}

export async function getAllMessages(db, id) {
    const result = await db.all('SELECT recipient_id, sender_id, content FROM messages WHERE recipient_id = ? OR sender_id = ? ORDER BY created_at',
        [id, id]
    );
    console.log('Fetching all messages: ', result);
    return (result);
}

export async function getMessageById(db, id) {
    const result = await db.get('SELECT * FROM messages WHERE id = ?', [id]);
    console.log(`Fetching message with ID ${id}`);
    return result;
    
}

export async function deleteMessages(db, id) {
    await db.run('DELETE FROM messages WHERE recipient_id = ? OR sender_id = ?', [id, id]);
}