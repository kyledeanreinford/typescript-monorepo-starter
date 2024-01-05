import * as schema from 'schemawax';
import {ServerRoute} from '@hapi/hapi';
import {JokeFields, jokesRepo} from './JokesRepo';
import {SearchQuery, searchQueryDecoder, ShowPathParams, showPathParamsDecoder, typedRoute} from '../ApiSupport';

const fieldsDecoder: schema.Decoder<JokeFields> =
    schema.object({
        required: {joke: schema.string},
    });

const randomJoke = (deps: Dependencies): ServerRoute =>
    typedRoute.get('/api/jokes/random', {
        decoders: typedRoute.decoders,
        handler: async (_, {h}) => h.response({data: await deps.randomJoke()}),
    });

const addJoke = (deps: Dependencies): ServerRoute =>
    typedRoute.post<JokeFields>('/api/jokes', {
        decoders: {...typedRoute.decoders, body: fieldsDecoder},
        handler: async ({body}, {h}) => {
            const data = await deps.addJoke(body);
            return h.response({data}).code(201);
        },
    });

const listJoke = (deps: Dependencies): ServerRoute =>
    typedRoute.get<SearchQuery>('/api/jokes', {
        decoders: {...typedRoute.decoders, query: searchQueryDecoder},
        handler: async ({query}, {h}) => {
            const data = query.search
                ? await deps.searchJokes(query.search)
                : await deps.findAllJokes();
            return h.response({data});
        },
    });

const findJoke = (deps: Dependencies): ServerRoute =>
    typedRoute.get<unknown, ShowPathParams>('/api/jokes/{id}', {
        decoders: {...typedRoute.decoders, path: showPathParamsDecoder},
        handler: async ({path}, {h}) => {
            const maybeJoke = await deps.findJoke(path.id);

            return maybeJoke
                ? h.response({data: maybeJoke})
                : h.response().code(204);
        },
    });

const dependencies = {
    randomJoke: jokesRepo.singleton.random,
    addJoke: jokesRepo.singleton.add,
    findAllJokes: jokesRepo.singleton.findAll,
    searchJokes: jokesRepo.singleton.search,
    findJoke: jokesRepo.singleton.find,
};

type Dependencies = typeof dependencies;

export const jokesApi = {
    routes: (deps = dependencies) => [
        randomJoke(deps),
        addJoke(deps),
        listJoke(deps),
        findJoke(deps),
    ],
};
