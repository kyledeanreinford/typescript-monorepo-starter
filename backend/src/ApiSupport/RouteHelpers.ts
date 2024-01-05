import * as schema from 'schemawax';
import {decoders} from './Decoders';

export type SearchQuery =
    { readonly search?: string }

export type ShowPathParams =
    { readonly id: number }

export const searchQueryDecoder: schema.Decoder<SearchQuery> =
    schema.object({optional: {search: schema.string}});

export const showPathParamsDecoder: schema.Decoder<ShowPathParams> =
    schema.object({
        required: {id: decoders.stringToInt},
    });
