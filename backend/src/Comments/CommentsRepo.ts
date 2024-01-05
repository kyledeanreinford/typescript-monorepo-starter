import {Pool} from 'pg';

export type CommentFields = {
    readonly message: string,
}

export type CommentRecord =
    CommentFields & { readonly id: number }

export type CommentsRepo = {
    readonly find: (joke_id: number) => Promise<readonly CommentRecord[]>
    readonly add: (joke_id: number, fields: CommentFields) => Promise<CommentRecord>
}

const create = (pool: Pool): CommentsRepo => {
    return {
        find: async (joke_id: number) => {
            const result = await pool.query('select * from comments where joke_id = $1', [joke_id]);
            return result.rows;
        },
        add: async (joke_id, fields) => {
            const {message} = fields;
            const result = await pool.query('insert into comments (joke_id, message) values ($1, $2) returning id', [joke_id, message]);
            return {...fields, id: result.rows[0].id};
        },
    };
};

const singleton = create(new Pool({
    host: 'localhost',
    user: 'canyon',
    database: 'jokesdb',
    port: 5432,
}));

export const commentsRepo = {
    create,
    singleton,
};
