/**
 * Created by luwenwei on 17/9/13.
 */
let webpack = require('webpack');
let CopyWebpackPlugin = require('copy-webpack-plugin');
let path = require('path');
let ExtractTextPlugin = require('extract-text-webpack-plugin');

let config = {
    //入口文件输出配置
    output: {
        path: path.resolve(__dirname, '../dist/'),
        publicPath: './',
        filename: '[name].js',
        chunkFilename: '[name].js',
    },

    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            names: ['vendors','manifest']
        }),
        new CopyWebpackPlugin([
            { from: './node_modules/tinymce/skins', to: './skins' }
        ]),
        new ExtractTextPlugin('styles.css')
    ]
};

module.exports = config;