import {Server} from '@hapi/hapi';
import {Pool} from 'pg';
import {appServer} from '../../App';
import {commentsRepo, CommentsRepo} from '../CommentsRepo';
import {commentsApi} from '../CommentsApi';

describe('CommentsApi', () => {

    let server: Server;
    let repo: CommentsRepo;
    const pool: Pool = new Pool({
        host: 'localhost',
        user: 'canyon',
        database: 'testdb',
        port: 5432,
    });

    beforeEach(async () => {
        await pool.query('truncate jokes cascade');
        await pool.query('truncate comments cascade');
    });

    beforeEach(() => {
        repo = commentsRepo.create(pool);
        server = appServer.create({
            routes: commentsApi.routes({
                addComment: repo.add,
                findComments: repo.find,
            }),
        });
    });

    test('GET /api/jokes/{id}/comments', async () => {
        const joke = await pool.query('insert into jokes (joke) values (\'This is a test joke. Funny, right?\') returning id');
        const jokeId = joke.rows[0].id;
        await pool.query(`insert into comments (joke_id, message) values (${jokeId}, 'Decent.')`);
        await pool.query(`insert into comments (joke_id, message) values (${jokeId}, 'Not the best.')`);

        const response = await server.inject({
            method: 'GET',
            url: `http://localhost:3001/api/jokes/${jokeId}/comments`,
        });

        expect(response.statusCode).toEqual(200);
        expect(JSON.parse(response.payload).data[0]).toEqual(expect.objectContaining({message: 'Decent.'}));
        expect(JSON.parse(response.payload).data[1]).toEqual(expect.objectContaining({message: 'Not the best.'}));
    });

    test('POST /api/jokes/{id}/comments', async () => {
        const joke = await pool.query('insert into jokes (joke) values (\'This is a test joke. Funny, right?\') returning id');
        const jokeId = joke.rows[0].id;

        const emptyResponse = await server.inject({
            method: 'GET',
            url: `http://localhost:3001/api/jokes/${jokeId}/comments`,
        });

        expect(emptyResponse.statusCode).toEqual(200);
        expect(JSON.parse(emptyResponse.payload).data).toEqual([]);

        const response = await server.inject({
            method: 'POST',
            url: `http://localhost:3001/api/jokes/${jokeId}/comments`,
            payload: {message: 'HILARIOUS.'},
        });

        expect(response.statusCode).toEqual(201);
        expect(JSON.parse(response.payload).data).toEqual(expect.objectContaining({message: 'HILARIOUS.'}));
    });
});
