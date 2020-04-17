import React from 'react';
import { Router, Link } from '@reach/router';
import { routes, RoutedComponent } from './routing/routes';

const Nav = () => (
    <>
        <Link to={'/ui/home'}>Home</Link>
    </>
);

const App = () => (
    <>
        <h1>Hey I'm react SSR App</h1>
        <Nav />
        <Router>{routes.map(route => <RoutedComponent {...route} key={route.path} />)}</Router>
    </>
);

export default App;
