import {Server} from '@hapi/hapi';
import {jokesApi, jokesRepo, JokesRepo} from '..';
import {appServer} from '../../App';
import {Pool} from 'pg';

describe('JokesApi', () => {

    let server: Server;
    let repo: JokesRepo;
    const pool: Pool = new Pool({
        host: 'localhost',
        user: 'canyon',
        database: 'testdb',
        port: 5432,
    });

    beforeEach(async () => {
        await pool.query('truncate jokes cascade');
        await pool.query('insert into jokes (joke) values (\'This is a test joke. Funny, right?\')');
    });

    beforeEach(() => {
        repo = jokesRepo.create(pool);
        server = appServer.create({
            routes: jokesApi.routes({
                addJoke: repo.add,
                findAllJokes: repo.findAll,
                findJoke: repo.find,
                randomJoke: repo.random,
                searchJokes: repo.search,
            }),
        });
    });

    test('GET /api/jokes/random', async () => {
        const response = await server.inject({
            method: 'GET',
            url: 'http://localhost:3001/api/jokes/random',
        });

        expect(response.statusCode).toEqual(200);
        expect(JSON.parse(response.payload).data).toEqual(expect.objectContaining({joke: 'This is a test joke. Funny, right?'}));
    });

    test('POST /api/jokes', async () => {
        const response = await server.inject({
            method: 'POST',
            url: 'http://localhost:3001/api/jokes',
            payload: {joke: 'This is a less funny joke.'},
        });

        expect(response.statusCode).toEqual(201);
        expect(JSON.parse(response.payload).data).toEqual(expect.objectContaining({joke: 'This is a less funny joke.'}));
    });

    test('GET /api/jokes', async () => {
        await pool.query('insert into jokes (joke) values (\'This is a less funny joke.\')');

        const response = await server.inject({
            method: 'GET',
            url: 'http://localhost:3001/api/jokes',
        });

        expect(response.statusCode).toEqual(200);
        const result = JSON.parse(response.payload).data;
        expect(result[0]).toEqual(expect.objectContaining({joke: 'This is a test joke. Funny, right?'}));
        expect(result[1]).toEqual(expect.objectContaining({joke: 'This is a less funny joke.'}));
    });

    test('GET /api/jokes?search={search}', async () => {
        await pool.query('insert into jokes (joke) values (\'This is a another test joke, but it is in bad taste.\')');

        const response = await server.inject({
            method: 'GET',
            url: 'http://localhost:3001/api/jokes?search=nother',
        });

        expect(response.statusCode).toEqual(200);
        expect(JSON.parse(response.payload).data[0]).toEqual(expect.objectContaining({joke: 'This is a another test joke, but it is in bad taste.'}));
    });
});
