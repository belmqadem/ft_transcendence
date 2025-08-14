export function createResponse(status, code, data) {
    return ({
        statusCode: status,
        code: code,
        data: data
    });
}

import https from 'https'
import fs from 'fs';
import path from 'node:path';
import { fetchAllProfiles } from '../models/profileDAO.js';

export async function downloadAvatarUrl(avatar_url, userId) {
    const ext = path.extname(avatar_url);
    const fileName = `${userId}_${Date.now()}${ext}`;

    const uploadPath = path.join(process.cwd(), 'uploads', 'avatars', fileName);
    console.log(uploadPath);
    fs.mkdirSync(path.dirname(uploadPath), { recursive: true });  
    
    return new Promise((resolve, reject) => {

        const file = fs.createWriteStream(uploadPath);
        
        const request = https.get(avatar_url, function(response) {
            response.pipe(file);
            file.on("finish", () => {
                file.close();
                console.log("Download Completed at ", uploadPath);
                resolve(fileName);
                
            }).on('error', (err) => {
                fs.unlink(uploadPath, () => {});
                console.error('Error downloading file:', err.message);
            });
        });
        
        request.on('error', (err) => {
            fs.unlink(uploadPath, () => {reject(err)});
        });
    })
}

import WebSocket from 'ws';

async function getOnlineStatuses(db, onlineUsers){

    const profiles = await fetchAllProfiles(db);
    // console.log("FRIENDS IDS ==> ", profiles);
    const actualProfiles = profiles.map(profile => {
        // console.log("Handling userId ", profile.userId)
        if (!onlineUsers.has(profile.userId))
            return { userId: profile.userId, isOnline: false };
        return { userId: profile.userId, isOnline: true };
    })
    // console.log(actualProfiles);
    return actualProfiles;

}

export async function displayOnlineStatuses(db, socket, onlineUsers) {
    const statuses = await getOnlineStatuses(db, onlineUsers);

    if (socket.isAuthenticated && socket.readyState === WebSocket.OPEN)
        socket.send(JSON.stringify({ userStatuses: statuses }));
}