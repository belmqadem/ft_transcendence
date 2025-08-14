import { 
    fetchAllProfiles,
    findDuplicateUsername, 
    getProfileById, 
    updateAvatarUrlById, 
    updateProfileById 
} from "../models/profileDAO.js";
import { createResponse, displayOnlineStatuses } from "../utils/utils.js";
import fs from 'node:fs';
import { pipeline } from 'node:stream/promises';
import path from 'node:path';
import { verifyWSToken } from "../middleware/authMiddleware.js";

export async function getProfile(request, reply) {
    try {
        const { id } = request.params;
        
        const profile = await getProfileById(this.db, id);
        if (!profile)
            return reply.code(400).send(createResponse(400, 'PROFILE_NOT_FOUND'));
        
        return reply.code(200).send(createResponse(200, 'PROFILE_FETCHED', { profile: profile }));
    } catch (error) {
        console.log(error);
        return reply.code(500).send(createResponse(500, 'INTERNAL_SERVER_ERROR'));
    }
}

export async function updateProfile(request, reply) {
    try {
        const { id } = request.params;
        const tokenId = request.user?.id;
        if (tokenId != id)
            return reply.code(403).send(createResponse(403, 'UNAUTHORIZED'));
        
        const { username, matches_won, matches_lost, hasWon } = request.body;
        
        const profile = await getProfileById(this.db, id);
        if (!profile)
            return reply.code(400).send(createResponse(400, 'PROFILE_NOT_FOUND'));
        
        const updatedFields = {};
        if (username) {
            const dupUser = await findDuplicateUsername(this.db, username);
            if (dupUser)
                return reply.code(400).send(createResponse(400, 'USERNAME_EXISTS'));
            updatedFields.username = username;
            this.rabbit.produceMessage({
                id: id,
                username: username
            }, 'auth.username.updated');
        }
        
        if (matches_won !== undefined && hasWon) {
            updatedFields.matches_won = matches_won;
            updatedFields.matches_played = profile.matches_lost + matches_won;
            updatedFields.level = (matches_won * 100 + profile.matches_lost * 50) / 500;
        } 
        if (matches_lost !== undefined && !hasWon) {
            updatedFields.matches_lost = matches_lost;
            updatedFields.matches_played = profile.matches_won + matches_lost;
            updatedFields.level = (matches_lost * 50 + profile.matches_won * 100) / 500;
        } 


        if (Object.keys(updatedFields).length === 0)
            return reply.code(400).send(createResponse(400, 'MISSING_FIELDS'));
        
        const changes = await updateProfileById(this.db, id, updatedFields);
        if (changes === 0)
            return reply.code(400).send(createResponse(400, 'ZERO_CHANGES'));
        const updatedProfile = await getProfileById(this.db, id);
        await this.redis.sendCommand([
            'JSON.SET',
            `player:${tokenId}`,
            '$',
            JSON.stringify(updatedProfile)
        ])


        return reply.code(200).send(createResponse(200, 'PROFILE_UPDATED', { profile: updatedProfile }));
    } catch (error) {
        console.log(error);
        return reply.code(500).send(createResponse(500, 'INTERNAL_SERVER_ERROR'));
    }
}

export async function uploadAvatarUrl(request, reply) {
    try {
        const userId = request.user?.id;
        const data = await request.file();
        data.file.on('limit' , () => {
            return reply.code(413).send(createResponse(400, 'FILE_TOO_LARGE'));
        })
        console.log('DATA received: ', data);
        if (!data)
            return reply.code(400).send(createResponse(400, 'FILE_REQUIRED'));
        
        const ext = path.extname(data.filename);
        if (ext !== '.webp' && ext !== '.jpeg' && ext !== '.jpg' && ext !== '.png')
            return reply.code(400).send(createResponse(400, 'UNSUPPORTED_FILE_TYPE'));
        const fileName = `${userId}_${Date.now()}${ext}`;
        const uploadPath = path.join(process.cwd(), 'uploads', 'avatars', fileName);
        console.log("Upload path: ", uploadPath);
        fs.mkdirSync(path.dirname(uploadPath), { recursive: true });

        await pipeline(data.file, fs.createWriteStream(uploadPath));
        
        await updateAvatarUrlById(this.db, userId, fileName);
        const updatedProfile = await getProfileById(this.db, userId);
        await this.redis.sendCommand([
            'JSON.SET',
            `player:${userId}`,
            '$',
            JSON.stringify(updatedProfile)
        ])
        return reply.code(200).send(createResponse(200, 'AVATAR_UPLOADED', { avatar_url: fileName }));
    } catch (error) {
        console.log(error);
        return reply.code(500).send(createResponse(500, 'INTERNAL_SERVER_ERROR'));
    }
}

export async function getAvatarUrl(request, reply) {
    try {
        const { fileName } = request.params;
        if (!fileName)
            return reply.code(400).send(createResponse(400, 'FILENAME_REQUIRED'));

        const filePath = path.join(process.cwd(), 'uploads', 'avatars', fileName);
        if (!fs.existsSync(filePath))
            return reply.code(404).send(createResponse(404, 'FILE_NOT_FOUND'));

        const ext = path.extname(fileName).toLowerCase();
        const mimeType = ((ext === '.jpeg' || ext === '.jpg') ? 'image/jpeg' :
            ext === '.png' ? 'image/png' :
            ext === '.webp' ? 'image/webp' :
            'application/octet-stream');
        const stream = fs.createReadStream(filePath);

        stream.on('error', (err) => {
            console.error('Stream error:', err);
            reply.code(500).send(createResponse(500, 'INTERNAL_SERVER_ERROR'));
        });
        
        return reply.type(mimeType).send(stream);
    } catch (error) {
        console.log(error);
        return reply.code(500).send(createResponse(500, 'INTERNAL_SERVER_ERROR'));
    }
}

export async function getAllProfiles(request, reply) {
    try {
        const allProfiles = await fetchAllProfiles(this.db);
        return reply.code(200).send(createResponse(200, 'PROFILES_FETCHED', { profiles: allProfiles }));
    } catch (error) {
        console.log(error);
        return reply.code(500).send(createResponse(500, 'INTERNAL_SERVER_ERROR'));
    }
}


const onlineUsers = new Map();

export async function fetchOnlineStatuses(socket, request) {
    try {
        socket.userId = null;
        socket.isAuthenticated = false;
        await verifyWSToken(socket, request, this.redis);
        if (socket.userId) {
            if (!onlineUsers.has(socket.userId))
                onlineUsers.set(socket.userId, new Set());
            onlineUsers.get(socket.userId).add(socket);
            displayOnlineStatuses(this.db, socket, onlineUsers);
        }
        else {
            socket.close(3000, 'Unauthorized');
            return ;
        }

        setInterval(displayOnlineStatuses, 5000, this.db, socket, onlineUsers);

        socket.on('error', (error) => {
            console.error('FastifyWebSocket: Client error:', error);
        });

        socket.on('close', () => {
            console.log('FastifyWebSocket: Client disconnected.');
            if (socket.isAuthenticated && onlineUsers.has(socket.userId)) {
            onlineUsers.get(socket.userId).delete(socket);
            if (onlineUsers.get(socket.userId).size === 0) 
                onlineUsers.delete(socket.userId);
            }
        })
    } catch (error) {
        console.log(error);
        socket.close(1008, 'Malformed payload');
    }    
}