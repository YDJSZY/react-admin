/**
 * Created by luwenwei on 17/9/13.
 */
let path = require('path');
let MiniCssExtractPlugin = require('mini-css-extract-plugin')

let config = {
    //入口文件输出配置
    output: {
        path: path.resolve(__dirname, '../dist/'),
        publicPath: './',
        filename: '[name].js',
        chunkFilename: '[name].js',
    },

    plugins: [
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: '[name].css',
            chunkFilename: '[id].css'
        })
    ]
};

module.exports = config;