/**
 * Created by luwenwei on 17/9/14.
 */
let CopyWebpackPlugin = require('copy-webpack-plugin');
let ExtractTextPlugin = require("extract-text-webpack-plugin");
let webpack = require('webpack');
let path = require('path');
let argv = process.argv;
let port = argv[argv.length - 1] || 3000; /*npm start -- --port 3000*/
let config = {
    output:{
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        chunkFilename: '[name].js'
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: port,
        historyApiFallback: true,
        hot: true,
        host: '127.0.0.1',
        inline: true,
        progress: true,
        headers: {
            'Access-Control-Allow-Origin': '*' // 5
        },
        proxy: {
            /*'/api': {
                target: 'http://127.0.0.1:8000/',
                changeOrigin: true,
                secure: false
            },
            '/accounts/':{
                target: 'http://127.0.0.1:8000/',
                changeOrigin: true,
                secure: false
            },
            '/static/':{
                target: 'http://127.0.0.1:8000/',
                changeOrigin: true,
                secure: false
            },
            '/admin/':{
                target: 'http://127.0.0.1:8000/',
                changeOrigin: true,
                secure: false
            },
            '/backend/':{
                target: 'http://127.0.0.1:8000/',
                changeOrigin: true,
                secure: false
            }*/
        }
    },

    module: {
        rules: [
        ]
    },

    plugins: [
        new CopyWebpackPlugin([
            { from: './constants.json', to: path.resolve(__dirname, 'dist') },
            { from: './myinfo.json', to: path.resolve(__dirname, 'dist') },
            { from: './data.json', to: path.resolve(__dirname, 'dist') },
            { from: './node_modules/tinymce/plugins', to: './plugins' },
            { from: './node_modules/tinymce/themes', to: './themes' },
            { from: './node_modules/tinymce/skins', to: './skins' },
            { from: './src/images', to: './images' }
            //{ from: './node_modules/tinymce/langs', to: './langs' }
        ]),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            async: 'used-twice',
            minChunks: (module, count) => (
                count >= 2
            )
        }),
        new ExtractTextPlugin('styles.css')
    ]
};

module.exports = config;