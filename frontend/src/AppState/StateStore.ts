import * as Redux from 'redux';
import {jokeState, JokeState} from '../Joke';
import {commentState, CommentState} from '../Comments';

export type AppState = {
    readonly comments: readonly CommentState[];
    readonly joke: JokeState
};

const appReducer: Redux.Reducer<AppState, Redux.Action> =
    Redux.combineReducers({
        comments: commentState.reducer,
        joke: jokeState.reducer,
    });

const create = (): Redux.Store<AppState> =>
    Redux.createStore(appReducer);

export const stateStore = {
    create,
};
