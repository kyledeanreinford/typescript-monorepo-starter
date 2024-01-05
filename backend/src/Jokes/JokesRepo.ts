import {Pool} from 'pg';

export type JokeFields = {
    readonly joke: string
}

export type JokeRecord =
    JokeFields & { readonly id: number }

export type JokesRepo = {
    readonly random: () => Promise<JokeRecord>
    readonly add: (fields: JokeFields) => Promise<JokeRecord>
    readonly find: (id: number) => Promise<JokeRecord|undefined>
    readonly findAll: () => Promise<readonly JokeRecord[]>
    readonly search: (query: string) => Promise<readonly JokeRecord[]>
}

const create = (pool: Pool): JokesRepo => {
    return {
        random: async () => {
            const result = await pool.query('select * from jokes');
            const allJokes = result.rows;
            const index = Math.floor(Math.random() * allJokes.length);
            return allJokes[index];
        },
        add: async fields => {
            const result = await pool.query('insert into jokes (joke) values ($1) returning id', [fields.joke]);
            return {...fields, id: result.rows[0].id};
        },
        find: async (id: number) => {
            const result = await pool.query('select * from jokes where id = $1', [id]);
            return result.rows[0];
        },
        findAll: async () => {
            const result = await pool.query('select * from jokes');
            return result.rows;
        },
        search: async (query: string) => {
            const result = await pool.query('select * from jokes where joke ~ $1', [query]);
            return result.rows;
        },
    };
};

const singleton = create(new Pool({
    host: 'localhost',
    user: 'canyon',
    database: 'jokesdb',
    port: 5432,
}));

export const jokesRepo = {
    create,
    singleton,
};
