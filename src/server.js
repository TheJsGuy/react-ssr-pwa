import restify from 'restify';
import React from 'react';
import { readFileSync, fstat } from 'fs';
import { join } from 'path';
import { renderToString } from 'react-dom/server';
import { render } from 'mustache';
import webpack from 'webpack';
import {
    Router, ServerLocation
} from '@reach/router';
import webpackConfig from '../webpack.config';

const { NODE_ENV } = process.env;

let App, FourOhFour;
loadReactComponents();

const template_path = join(__dirname, '../', 'dist', 'templates', 'index.mustache');
const static_path = join(__dirname, '../', 'dist');
const certPath = join(__dirname, '../', 'certs', 'localhost+1.pem');
const keyPath = join(__dirname, '../', 'certs', 'localhost+1-key.pem');

const cert = readFileSync(certPath, 'utf8');
const key = readFileSync(keyPath, 'utf8');
let template = readFileSync(template_path, 'utf8');

const server = restify.createServer({
    http2: { cert, key }
});

const compiler = webpack(webpackConfig);
const compile = () => compiler.run((err, stats) => { stats.compilation.chunks.forEach(({ files }) => console.info(files.join('\n'))); });

if (NODE_ENV === 'development') {
    require('chokidar')
        .watch(__dirname).on('raw', (event, path) => {
            console.log(`${event} :::: ${path}`);
            compile();
            template = readFileSync(template_path, 'utf-8');
            loadReactComponents();
            console.log('webpack reloaded');
        });
    server.get('/localcdn.com/*', restify.plugins.serveStaticFiles(static_path));
}

server.get('/ui*', (req, res, next) => {


    const metadata = {
        __rac_locale: 'en',
        __rac_app_title: 'React SSR',
        __rac_asset_base: '/localcdn.com',
        __rac_root: renderToString(
            <ServerLocation url={req.href()}>
                <Router>
                    <App path={'/ui/*'} />
                </Router>
            </ServerLocation>
        )
    };

    res.sendRaw(
        200,
        render(template, metadata),
        {
            'Content-Type': 'text/html'
        }
    );
    next();
});

server.use((req, res, next) => {
    res.set({
        'Service-Worker-Allowed': '/'
    });
    next();
})

// server.use((req, res, next) => {
//     res.status(404);
//     // res.header('Content-Type', 'text/html');
//     res.send(
//         renderToString(
//             <FourOhFour />
//         )
//     );
//     next();
// });

compile();

server.listen(443, stats => {
    console.log('Yo app started @ https://localhost');
});

const fallback = restify.createServer();
fallback.get('*', (req, res, next) => {
    res.redirect(301, `https://localhost${req.href()}`, next);
});
fallback.listen(80);

function loadReactComponents() {
    App = freshRequire('./app/App').default;
    FourOhFour = freshRequire('./app/components/FourOhFour').default;
}

function freshRequire(path) {
    delete require.cache[require.resolve(path)];
    return require(path);
}