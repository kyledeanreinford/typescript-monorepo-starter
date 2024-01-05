import * as schema from 'schemawax';
import {http, Http} from '../Networking';
import {Comment} from './CommentState';
import {json} from '../ApiSupport';


const decoder =
    schema.object({
        required: {message: schema.string},
    });

const commentDecoder: schema.Decoder<Comment> =
    decoder.andThen(json => ({content: json.comment}));

const fetchComments = (baseUrl: string, id: number): Http.Result<Comment> =>
    http
        .sendRequest({method: 'GET', url: `${baseUrl}/jokes/${id}/comments`})
        .flatMapOk(http.expectStatusCode(200))
        .flatMapOk(http.decodeJson(json.dataDecoder(commentDecoder)));

export const commentsApi = {
    fetchComments,
};
