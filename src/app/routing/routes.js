import React, { useEffect, useState } from 'react';
import HomePage from '../pages/Home';

export const routes = [
    {
        path: '/home',
        component: HomePage
    }
];

export const RoutedComponent = ({ component: Component }) => {

    const [initalState, setInitialState] = useState(null);

    useEffect(() => {
        (async () => {
            const componentData = await Component.init();
            setInitialState(componentData);
        })();
    }, [Component]);

    if (initalState) {
        return <Component {...initalState} />
    }

    return null;
}
