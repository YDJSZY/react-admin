/**
 * Created by luwenwei on 17/9/13.
 */
let webpack = require('webpack');
let CopyWebpackPlugin = require('copy-webpack-plugin');
let path = require('path');
let ExtractTextPlugin = require('extract-text-webpack-plugin');

let config = {
    output: {
        path: path.resolve(__dirname, '../dist/'),
        publicPath: './',
        filename: '[name].[chunkhash:5].js',
        chunkFilename: '[name].[chunkhash:5].js'
    },

    module: {
        rules: [
            {
                test: /\.css$/,
                include: [
                    path.join(__dirname, './src/styles'),
                ],
                exclude: [path.join(__dirname, '../node_modules/antd')],
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader?minimize=true'
                })
            }
        ]
    },

    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            names: ['vendors','manifest']
        }),
        new CopyWebpackPlugin([
            { from: './node_modules/tinymce/skins', to: './skins' }
        ]),
        new ExtractTextPlugin('[name].[chunkhash:8].css'),
        new webpack.optimize.UglifyJsPlugin({    //压缩代码
            compress: {
                warnings: false
            },
            comments: false,
            mangle:false,
            except: ['$super', '$', 'exports', 'require']    //排除关键字
        })
    ]
}

module.exports = config;