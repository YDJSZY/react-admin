/**
 * Created by luwenwei on 17/9/13.
 */
let webpack = require('webpack');
let path = require('path');

let config = {
    output: {
        path: path.resolve(__dirname, '../dist/'),
        publicPath: './',
        filename: '[name].[chunkhash:5].js',
        chunkFilename: '[name].[chunkhash:5].js'
    },

    plugins: [
       
    ]
}

module.exports = config;