import fp from "fastify-plugin";
import jwt from "jsonwebtoken";
import { createResponse } from "../utils/utils.js";
import { getAuthCookies, getTempAuthToken } from "../utils/authCookies.js";

async function jwtPlugin(fastify, options) {
  const { accessTokenKey, refreshTokenKey, tempTokenKey } = options;

  fastify.decorate("jwt", {
    //AT = Access Token (15 minutes) \ RT = Refresh Token (7 days) \ TT = Temporary Token (5 minutes)
    signTT(payload, expiresIn = "5m") {
      try {
        return jwt.sign(payload, tempTokenKey, { expiresIn });
      } catch (error) {
        console.log("Error in signing temp token: ", error);
        throw new Error(error);
      }
    },

    async signAT(payload, expiresIn = "15m") {
      try {
        return jwt.sign(payload, accessTokenKey, { expiresIn });
      } catch (error) {
        console.log("Error in signing access token: ", error);
        throw new Error(error);
      }
    },

    signRT(payload, expiresIn = "7d") {
      try {
        delete payload.exp;
        return jwt.sign(payload, refreshTokenKey, { expiresIn });
      } catch (error) {
        console.log("Error in signing refresh token: ", error);
        throw new Error(error);
      }
    },

    verifyAT(token) {
      try {
        return jwt.verify(token, accessTokenKey);
      } catch (error) {
        console.log("Error in verifying access token: ", error);
        throw new Error(error);
      }
    },

    verifyRT(token) {
      try {
        return jwt.verify(token, refreshTokenKey);
      } catch (error) {
        console.log("Error in verifying refresh token: ", error);
        throw new Error(error);
      }
    },

    verifyTT(token) {
      try {
        return jwt.verify(token, tempTokenKey);
      } catch (error) {
        console.log("Error in verifying temp token: ", error);
        throw new Error(error);
      }
    },
  });

  fastify.decorate("authenticate", async (request, reply) => {
    try {
      let cookie = getAuthCookies(request);
      let decodedUser;
      if (!cookie.accessToken) {
        cookie = getTempAuthToken(request);
        if (!cookie)
          return reply.code(401).send(createResponse(401, "TOKEN_REQUIRED"));
        try {
          decodedUser = await fastify.jwt.verifyTT(cookie);
          request.user = decodedUser;
          return;
        } catch (error) {
          if (error.name === "TokenExpiredError")
            return reply
              .code(401)
              .send(createResponse(401, "TEMP_TOKEN_EXPIRED"));
          return reply
            .code(401)
            .send(createResponse(401, "TEMP_TOKEN_INVALID"));
        }
      }
      try {
        decodedUser = await fastify.jwt.verifyAT(cookie.accessToken);
        request.user = decodedUser;
        return;
      } catch (error) {
        if (error.name === "TokenExpiredError")
          return reply
            .code(401)
            .send(createResponse(401, "ACCESS_TOKEN_EXPIRED"));
        return reply
          .code(401)
          .send(createResponse(401, "ACCESS_TOKEN_INVALID"));
      }
    } catch (error) {
      console.log("Error while authenticating: ", error);
      return reply.code(500).send(createResponse(500, "INTERNAL_SERVER_ERROR"));
    }
  });
}

export default fp(jwtPlugin);
