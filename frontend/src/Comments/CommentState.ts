import {Action, Reducer} from 'redux';
import {match} from 'ts-pattern';
import {Result} from '../Prelude';
import {Http, RemoteData, remoteData} from '../Networking';

/* State */

export type Comment = {
    readonly content: string
};

export type CommentState = {
    readonly data: RemoteData<Comment>
};

const initialState: CommentState = {
    data: remoteData.notLoaded(),
};

/* Actions */

type CommentAction =
    | { readonly type: 'comment/start loading comment' }
    | { readonly type: 'comment/finished loading comment', readonly value: Result<Comment, Http.Error> }

const isCommentAction = (variable: unknown): variable is CommentAction =>
    (variable as CommentAction).type.startsWith('comment/');

const startLoading: CommentAction =
    {type: 'comment/start loading comment'};

const finishedLoading = (value: Result<Comment, Http.Error>): CommentAction =>
    ({type: 'comment/finished loading comment', value});

/* Reducer */

const doStartLoading = (state: CommentState): CommentState =>
    ({data: remoteData.startLoading(state.data)});

const doFinishLoading = (state: CommentState, value: Result<Comment, Http.Error>): CommentState =>
    ({data: remoteData.ofResult(value)});

const reducer: Reducer<CommentState, Action> = (state = initialState, action: Action): CommentState => {
    if (!isCommentAction(action)) return state;

    return match(action)
        .with({type: 'comment/start loading comment'}, () => doStartLoading(state))
        .with({type: 'comment/finished loading comment'}, ({value}) => doFinishLoading(state, value))
        .exhaustive();
};

export const commentState = {
    startLoading,
    finishedLoading,
    reducer,
};
