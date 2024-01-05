import React from 'react';
import * as ReactRedux from 'react-redux';
import {useAsyncResult} from '../Prelude';
import {appContext, AppState} from '../AppState';
import {remoteData} from '../Networking';
import {commentsApi, commentState} from '../Comments';

export const Comments = (): React.ReactElement => {
    const dispatch = ReactRedux.useDispatch();
    const env = appContext.get();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(`Submitted ${e}`);
    };

    useAsyncResult(() => {
        dispatch(commentState.startLoading);

        return commentsApi
            .fetchComments(env.baseApiUrl, 1)
            .onComplete(result => dispatch(commentState.finishedLoading(result)));
    });

    const commentData = ReactRedux.useSelector((state: AppState) => state.comment.data);

    const LoadedComments = (comments: readonly Comment[]) => {
        return (
            <article>
                <h3>Comments</h3>
                { comments.map((comment) => {
                    return <article>{comment.data}</article>;
                })}
                <p>What do you think of this joke?</p>
                <form onSubmit={(e) => handleSubmit(e)}>
                    <input/>
                    <button type="submit">Submit Feedback</button>
                </form>;
            </article>
        );
    };

    return remoteData.mapAll(commentData, {
        whenNotLoaded: () => <article/>,
        whenLoading: () => <article>Loading...</article>,
        whenRefreshing: (comments) => <LoadedComments comments={comments}/>,
        whenLoaded: (comments) => <LoadedComments comments={comments}/>,
        whenFailed: () => <article>Error while loading</article>,
    });
};