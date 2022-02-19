import * as Json from 'schemawax';
import {Decoder} from 'schemawax';
import {http, Http} from '../Networking/Http';
import {Joke} from './JokeState';

const decoder =
    Json.object({
        required: {
            value: Json.object({required: {joke: Json.string}}),
        },
    });

const jokeDecoder: Decoder<Joke> =
    decoder.andThen(json => ({content: json.value.joke}));

const fetchRandom = (baseUrl: string): Http.Result<Joke> =>
    http
        .sendRequest({method: 'GET', url: `${baseUrl}/jokes/random`})
        .flatMapOk(http.expectStatusCode(200))
        .flatMapOk(http.decodeJson(jokeDecoder));

export const jokeApi = {
    fetchRandom,
};