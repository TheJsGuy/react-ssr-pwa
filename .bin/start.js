/******************************************************************
 * react ssr app // built usign babel & express on server side    *
 ******************************************************************/

require('@babel/register')({
    ignore: [/(node_modules)/],
    presets: ['@babel/preset-env', '@babel/preset-react']
});
require('babel-polyfill');
require('../src/server');
