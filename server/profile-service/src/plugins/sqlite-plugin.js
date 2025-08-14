import fp from 'fastify-plugin';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';


async function sqlitePlugin(fastify, options) {
    const db = await open({
        filename: './profile.db.sqlite',
        driver: sqlite3.Database
    });
    fastify.decorate('db', db);
};

export default fp(sqlitePlugin);
