import React from 'react';

const HomePage = ({ someKey }) => {
    return (
        <div>someKey &rarr; {someKey}</div>
    );
};

HomePage.init = async () => {
    // todo: some async action
    return Promise.resolve({
        someKey: 'someVal'
    })
};

export default HomePage;
