
export async function addFriendRequest(db, requesterId, addresseeId) {
    const existing = await db.get(
        `SELECT * FROM friendships WHERE 
            (requester_id = ? AND addressee_id = ?) 
            OR (requester_id = ? AND addressee_id = ?)`,
        [requesterId, addresseeId, addresseeId, requesterId]
    );

    if (existing) {
        return true;
    }

    const result = await db.run(
        `INSERT INTO friendships (requester_id, addressee_id, status) VALUES (?, ?, 'pending')`,
        [requesterId, addresseeId]
    );

    return false;
}

export async function updateFriendRequestStatus(db, requesterId, addresseeId, status) {
    if (!['accepted', 'rejected'].includes(status)) {
        return false;
    }

    const result = await db.run(
        `UPDATE friendships SET status = ? WHERE requester_id = ? AND addressee_id = ? AND status = 'pending'`,
        [status, requesterId, addresseeId]
    );

    if (result.changes === 0) {
        return false;
    }

    return true;
}

export async function deleteFriend(db, userId, friendId) {
    const result = await db.run(
        `DELETE FROM friendships WHERE 
            (requester_id = ? AND addressee_id = ? AND status = 'accepted') 
            OR (requester_id = ? AND addressee_id = ? AND status = 'accepted')`,
        [userId, friendId, friendId, userId]
    );

    if (result.changes === 0) {
        return false
    }

    return true;
}

export async function getFriendsByUserId(db, userId) {
    const friends = await db.all(
        `SELECT 
            CASE 
                WHEN requester_id = ? THEN addressee_id 
                ELSE requester_id 
            END AS friend_id
        FROM friendships
        WHERE (requester_id = ? OR addressee_id = ?) AND status = 'accepted'`,
        [userId, userId, userId]
    );

    return friends;
}

export async function getPendingRequestsByUserId(db, userId) {
    const requests = await db.all(
        `SELECT requester_id FROM friendships WHERE addressee_id = ? AND status = 'pending'`,
        [userId]
    );

    return requests;
}

export async function getSentRequestsByUserId(db, userId) {
    const requests = await db.all(
        `SELECT addressee_id FROM friendships WHERE requester_id = ? AND status = 'pending'`,
        [userId]
    );

    return requests;
}


export async function deleteFriendships(db, id) {
	const result = await db.run('DELETE FROM friendships WHERE requester_id = ? OR addressee_id = ?', [id, id]);
	if (result.changes === 0)
		return false;
	return true;
}

export async function deleteFriendship(db, addresseeId, requesterId) {
	const result = await db.run(
		`DELETE FROM friendships WHERE (requester_id = ? AND addressee_id = ?) OR (requester_id = ? AND addressee_id = ?)`,
		[requesterId, addresseeId, addresseeId, requesterId]
	);

	if (result.changes === 0) {
		return false;
	}
	return true;
}