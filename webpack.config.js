const HtmlWebpackPlugin = require('html-webpack-plugin');
const { InjectManifest } = require('workbox-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');
const { readFileSync } = require('fs');
const { join } = require('path');

const manifestPath = join(__dirname, 'src', 'manifest.json');
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));

module.exports = {
    entry: {
        main: ['babel-polyfill', './src/client.js']
    },
    output: {
        path: path.resolve('dist'),
        filename: '[name].bundle.js',
        // switch public paths for CDN while going live
        publicPath: '/localcdn.com/'
    },
    optimization: {
        usedExports: true,
        splitChunks: {
            chunks: 'all'
        }
    },
    module: {
        rules: [
            {
                test: /\.js/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/,
                use: {
                    loader: 'file-loader'
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/templates/index.mustache',
            filename: './templates/index.mustache'
        }),
        new InjectManifest({
            swSrc: './src/worker.js',
            swDest: 'service-worker.js'
        }),
        new ManifestPlugin({
            serialize: config => {
                return JSON.stringify({
                    ...config,
                    ...manifest
                });
            }
        }),
        new CopyPlugin([
            {
                from: './src/images/*',
                to: 'images',
                flatten: true
            }
        ])
    ],
    mode: 'development'
};
