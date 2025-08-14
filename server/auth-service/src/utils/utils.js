import { findUserByName } from "../models/userDAO.js";

export function createResponse(status, code, data) {
    return ({
        statusCode: status,
        code: code,
        data: data
    });
}

export function validatePassword(password) {
    return (/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*\W)[A-Za-z\d\W]{8,15}$/.test(password))
}

export async function generateUsername(db, name) {
    let username = name.toLowerCase().replace('/[^a-z0-9]/g', '');
    if (username.length < 3) username = 'user' + username;

    let uniqueUserName = username;
    let counter = 0;
    while (await findUserByName(db, uniqueUserName)) {
        counter++;
        uniqueUserName = `${username}${counter}`;
    }
    return uniqueUserName;
}

