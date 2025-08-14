import WebSocket from 'ws';

async function getPlayersData(redis, rabbit, socket) {
    let players = [];
    let finalPlayers = [];

    const playersIds = await redis.sMembers('userIds');
    console.log("PLAYER_IDS: ", playersIds);
    const idKeys = playersIds.map(id => `player:${id}`);
    if (idKeys && idKeys[0]) {
        players = await redis.sendCommand([
            'JSON.MGET',
            ...idKeys,
            '$'
        ])
        console.log("HAHOMA PLAYERS: ", players);
        finalPlayers = await Promise.all(players
            .map(jsonPlayer => {
                const player = JSON.parse(jsonPlayer);
                if (player && player[0])
                    return player[0];

            })
        );
        
        finalPlayers.sort(sortPlayers);
        console.log("Players from dashboard-service", finalPlayers);

        finalPlayers.forEach((player, rank) => {
            if (player.rank !== rank + 1) {
                rabbit.produceMessage({
                    type: 'UPDATE_RANK',
                    userId: player.userId,
                    rank: rank + 1
                }, 'profile.rank.update')
                player.rank = rank + 1;
            }
        });
    }
    return finalPlayers;
}

function sortPlayers(player1, player2) {
    if (player1.level !== player2.level)
        return player2.level - player1.level

    if (player1.xp !== player2.xp)
        return player2.xp - player1.xp;

    if (player1.matches_won !== player2.matches_won)
        return player2.matches_won - player1.matches_won;

    if (player1.matches_played !== player2.matches_played)
        return player2.matches_played - player1.matches_played;
    
    return (1);
}

export async function displayDashBoard(redis, socket, rabbit) {
    
    if (socket.isAuthenticated && socket.readyState === WebSocket.OPEN) {
        const players = await getPlayersData(redis, rabbit, socket);
        if (players)
            socket.send(JSON.stringify(players));
    }
}  	