import {ServerRoute} from '@hapi/hapi';
import {ShowPathParams, showPathParamsDecoder, typedRoute} from '../ApiSupport';
import {CommentFields, commentsRepo} from './CommentsRepo';
import * as schema from 'schemawax';

const fieldsDecoder: schema.Decoder<CommentFields> =
    schema.object({
        required: {message: schema.string},
    });

const findComments = (deps: Dependencies): ServerRoute =>
    typedRoute.get<unknown, ShowPathParams>('/api/jokes/{id}/comments', {
        decoders: {...typedRoute.decoders, path: showPathParamsDecoder},
        handler: async ({path}, {h}) => {
            const maybeComment = await deps.findComments(path.id);

            return maybeComment
                ? h.response({data: maybeComment})
                : h.response().code(204);
        },
    });

const addComment = (deps: Dependencies): ServerRoute =>
    typedRoute.post<CommentFields, unknown, ShowPathParams>('/api/jokes/{id}/comments', {
        decoders: {...typedRoute.decoders, path: showPathParamsDecoder, body: fieldsDecoder},
        handler: async ({body, path}, {h}) => {
            const data = await deps.addComment(path.id, body);
            return h.response({data}).code(201);
        },
    });

const dependencies = {
    findComments: commentsRepo.singleton.find,
    addComment: commentsRepo.singleton.add,
};

type Dependencies = typeof dependencies;

export const commentsApi = {
    routes: (deps = dependencies) => [
        findComments(deps),
        addComment(deps),
    ],
};