import {Joke} from './Joke';
import {Comments} from './Comments';
import React from 'react';

export const Container = (): React.ReactElement => {
    return (
        <>
            <h2>Here's a joke:</h2>
            <Joke/>
            <Comments/>
        </>
    );
};