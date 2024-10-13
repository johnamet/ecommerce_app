#!/usr/bin/node

import cache from "../utils/redis";


class AppController{

    /**
     * A void request to test whether server is online
     * @param {object} req - An express request object
     * @param {object} res - An express response object
     * @returns {Response} - An express response
     */
    static getStatus(req, res){
        return res.status(200).send({
            "status": "Ok"
        });
    }

    /**
     * Checks the connection of the Redis server.
     * @param {object} req - An express request object
     * @param {object} res - An express response object
     * @returns {Promise<Response} - A promisify express response.
     */

    static async getHealth(req, res){
        const isLive = await cache.isLive();

        return res.status(200).send({
            "redis": isLive
        });
    }
}

export default AppController;