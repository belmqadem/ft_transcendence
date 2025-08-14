import WebSocket from 'ws';


export function createResponse(status, code, data) {
    return ({
        statusCode: status,
        code: code,
        data: data
    });
}

