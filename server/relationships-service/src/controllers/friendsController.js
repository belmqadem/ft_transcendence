import {
    addFriendRequest,
    updateFriendRequestStatus,
    deleteFriend,
    getFriendsByUserId,
    getPendingRequestsByUserId,
    deleteFriendship,
    getSentRequestsByUserId
  } from '../models/friendshipDAO.js';
import { createResponse } from '../utils/utils.js';
  
export async function sendRequest(request, reply) {
  try {
        const requesterId = request.user.id;
        const { addresseeId } = request.body;

        if (!addresseeId)
          return reply.code(400).send(createResponse(400, 'ADDRESSEE_REQUIRED'));

        if (requesterId === addresseeId)
          return reply.code(400).send(createResponse(400, 'ADDRESSEE_INVALID'));

        let blockExist = await this.redis.sIsMember(`blocker:${requesterId}`, `${addresseeId}`);
        if (!blockExist)
            blockExist = await this.redis.sIsMember(`blocker:${addresseeId}`, `${requesterId}`);
        if (blockExist)
            return reply.code(400).send(createResponse(400, 'BLOCK_EXISTS'));
  
        let exists = await addFriendRequest(this.db, requesterId, addresseeId);
        if (exists)
          return reply.code(400).send(createResponse(400, 'FRIEND_REQUEST_ALREADY_SENT'));

        this.rabbit.produceMessage(
          { 
            type: 'FRIEND_REQUEST_SENT',
            sender_id: requesterId, 
            recipient_id: addresseeId 
          },
          'notifications.friend_request.sent'
        );

        return reply.code(200).send(createResponse(200, 'FRIEND_REQUEST_SENT'));
    } catch (error) {
      console.log(error);
      return reply.code(500).send(createResponse(500, 'INTERNAL_SERVER_ERROR'));
    }
}

export async function acceptRequest(request, reply) {
  try {
        const addresseeId = request.user.id;
        const { requesterId } = request.body;

        if (!requesterId)
          return reply.code(400).send(createResponse(400, 'REQUESTER_REQUIRED'));

        const idExist = await this.redis.sIsMember('userIds', `${requesterId}`);
        console.log('idExist value: ', idExist);
        if (!idExist || addresseeId === requesterId)
          return reply.code(400).send(createResponse(400, 'REQUESTER_INVALID'));
        
        let isValid = await updateFriendRequestStatus(this.db, requesterId, addresseeId, 'accepted');
        if (!isValid)
          return reply.code(400).send(createResponse(400, 'FRIEND_REQUEST_INVALID'));

        this.rabbit.produceMessage(
          { 
            type: 'FRIEND_REQUEST_ACCEPTED', 
            sender_id: addresseeId, 
            recipient_id: requesterId 
          },
          'notifications.friend_request.accepted'
        );

        return reply.code(200).send(createResponse(200, 'FRIEND_REQUEST_ACCEPTED'));
    } catch (error) {
      console.log(error);
      return reply.code(500).send(createResponse(500, 'INTERNAL_SERVER_ERROR'));
    }
}

export async function rejectRequest(request, reply) {
  try {
        const addresseeId = request.user.id;
        const { requesterId } = request.body;

        if (!requesterId)
          return reply.code(400).send(createResponse(400, 'REQUESTER_REQUIRED'));

        const idExist = await this.redis.sIsMember('userIds', `${requesterId}`);
        console.log('idExist value: ', idExist);
        if (!idExist || addresseeId === requesterId)
          return reply.code(400).send(createResponse(400, 'REQUESTER_INVALID'));

        let isValid = await deleteFriendship(this.db, addresseeId, requesterId);
        if (!isValid)
          return reply.code(400).send(createResponse(400, 'FRIEND_REQUEST_INVALID'));
        
        this.rabbit.produceMessage(
          { 
            type: 'FRIEND_REQUEST_CANCELED',
            sender_id: addresseeId, 
            recipient_id: requesterId 
          },
          'notifications.friend_request.canceled'
        );
        return reply.code(200).send(createResponse(200, 'FRIEND_REQUEST_REJECTED'));
    } catch (error) {
      console.log(error);
      return reply.code(500).send(createResponse(500, 'INTERNAL_SERVER_ERROR'));
    }
}

export async function removeFriend(request, reply) {
  try {
    const userId = request.user.id;
    const friendId = parseInt(request.params.friendId);

    if (!friendId)
      return reply.code(400).send(createResponse(400, 'FRIEND_REQUIRED'));

    const idExist = await this.redis.sIsMember('userIds', `${friendId}`);
    console.log('idExist value: ', idExist);
    if (!idExist || userId === friendId)
      return reply.code(400).send(createResponse(400, 'FRIEND_INVALID'));
    
    let isDeleted = await deleteFriend(this.db, userId, friendId);
    if (!isDeleted)
      return reply.code(400).send(createResponse(200, 'FRIEND_REQUEST_INVALID'));

    return reply.code(200).send(createResponse(200, 'FRIEND_REMOVED'));
  } catch (error) {
    console.log(error);
    return reply.code(500).send(createResponse(500, 'INTERNAL_SERVER_ERROR'));
  }
}

export async function listFriends(request, reply) {
  try {
    const userId = request.user.id;

    const friends = await getFriendsByUserId(this.db, userId);

    return reply.code(200).send(createResponse(200, 'FRIENDS_LISTED', { friends: friends }));
  } catch (error) {
    console.log(error);
    return reply.code(500).send(createResponse(500, 'INTERNAL_SERVER_ERROR'));
  }
}

export async function listRequests(request, reply) {
  try {
      const userId = request.user.id;

      const pendingRequests = await getPendingRequestsByUserId(this.db, userId);
      const sentRequests = await getSentRequestsByUserId(this.db, userId);

      return reply.code(200).send(createResponse(200, 'REQUESTS_LISTED', { pendingRequests: pendingRequests, sentRequests: sentRequests }));
    } catch (error) {
      console.log(error);
      return reply.code(500).send(createResponse(500, 'INTERNAL_SERVER_ERROR'));
    }
}
