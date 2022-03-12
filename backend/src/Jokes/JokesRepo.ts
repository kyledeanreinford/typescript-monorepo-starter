
export type JokeFields = {
    readonly joke: string
}

export type JokeRecord =
    JokeFields & { readonly id: number }

export type JokesRepo = {
    random: () => JokeRecord
    add: (fields: JokeFields) => JokeRecord
    findAll: () => JokeRecord[]
    search: (query: string) => JokeRecord[]
}

const initialJoke: JokeRecord = {
    id: 1,
    joke: 'Only Chuck Norris shuts down websites without due process, not SOPA or PIPA.',
};

const create = (): JokesRepo => {
    const jokes: JokeRecord[] = [initialJoke];

    return {
        random: () => {
            const index = Math.floor(Math.random() * jokes.length);
            return jokes[index];
        },
        add: fields => {
            const lastJoke = jokes[jokes.length - 1];
            const newJoke = {...fields, id: lastJoke.id + 1};
            jokes.push(newJoke);
            return newJoke;
        },
        findAll: () =>
            jokes.slice(),
        search: (query: string) =>
            jokes.slice().filter(it => it.joke.includes(query)),
    };
};

export const jokesRepo = {
    create,
};
