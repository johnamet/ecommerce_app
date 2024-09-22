#!/usr/bin/node
import { createClient } from "redis";
import { promisify } from 'util';

class Cache{

    constructor(){
        this.client = createClient();

        this.client.connect().then(r => {
                console.log('Redis client connected to the server');
            }
        ).catch(error => {
            console.error(`Redis client error: ${error.message}`);
        });
    }

    /**
     * Pings the Redis server to check ig the connection is alive
     * @returns {boolean} - Returns true if the server returns PONG otherwise false
     */
    async isLive(){
        const result = await this.client.ping();
        return result === "PONG";
    }

    /**
     * Retrieves the value associated with the
     * specified key from the Redis cache.
     * @params {string} key - The key to look up in the cache.
     * @returns {any} - The cached value if it exists otherwise null.
     */
    async get(key){
        try{
            const value = await this.client.get(key);
            return value;
        } catch(error){
            console.error(`Error while retrieving value from redis server.
                Error: ${error}`);
        }
    }

    /**
     * Stores a value in Redis associated with the key and sets an expiration time
     * for the key.
     * @param {String} key - The key to store the value under.
     * @param {any} value - The value to store.
     * @param {int} param2(Optional) - The time-to-live (TTL)for the key in seconds. 
     */
    async set(key, value, {ttl}){
        try{
            await this.client.set(key, value, {ttl});
        }catch(error){
            console.error(`Error while setting value in redis server. Error:
                ${error}`);
        }
    }

    /**
     * Deletes a key from the Redis cache.
     * @param {String} key - The key which the value is stored under
     */
    async del(key){
        try{
            await this.client.del(key);
        }catch(error){
            console.error(`Error while deleting value under key. 
                Error: ${error}`);
        }
    }

    /**
     * Sets expiration for stored values in Redis.
     * @param {String} key - The key under which the value is stored
     */
    async expire(key){
        try{
            this.client.expire(key);
        }catch(error){
            console.error(`Failed to set expiration for key. Error: ${error}`);
        }
    }
}

const cache = new Cache();

export default cache;