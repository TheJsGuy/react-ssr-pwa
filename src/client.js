import React from 'react';
import ReactDOM from 'react-dom';
import {
    createHistory,
    LocationProvider,
    Router
} from '@reach/router';

import App from './app/App';

const history = createHistory(window);

ReactDOM.hydrate(
    (
        <LocationProvider history={history}>
            <Router>
                <App path="/ui/*" />
            </Router>
        </LocationProvider>
    ),
    document.querySelector('[__rac_root]')
);

