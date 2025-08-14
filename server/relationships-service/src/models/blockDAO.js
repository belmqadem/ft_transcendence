export async function findBlock(db, blockedId, blockerId) {
    console.log('Fetching block relationship...');
    const result = await db.get('SELECT * FROM block WHERE (blocker_id = ? AND blocked_id = ?) OR (blocker_id = ? AND blocked_id = ?)', 
        [
            blockerId,
            blockedId,
            blockedId,
            blockerId
        ]
    )
    return (result);
}

export async function addBlock(db, blockerId, blockedId) {
    console.log('Inserting block relationship...');
    await db.run('INSERT INTO block (blocker_id, blocked_id) VALUES (?, ?)',
        [
            blockerId,
            blockedId
        ]
    )
}

export async function removeBlock(db, blockerId, blockedId) {
    console.log('Removing block relationship...');
    await db.run('DELETE FROM block WHERE blocker_id = ? AND blocked_id = ?', 
        [
            blockerId,
            blockedId
        ]
    );
}

export async function getBlockList(db, id) {
    console.log('Fetching block list...');
    return await db.all('SELECT * FROM block WHERE blocker_id = ?', [id]);
}