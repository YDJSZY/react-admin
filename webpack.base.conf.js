/**
 * Created by luwenwei on 17/9/13.
 */
let path = require('path');
let CleanWebpackPlugin = require('clean-webpack-plugin');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let ExtractTextPlugin = require('extract-text-webpack-plugin');
let env = process.env.NODE_ENV;
let webpackConfig = {
    //入口文件输出配置
    entry: {
        app:path.resolve(__dirname, './src/index.js'),
        vendors:['react', 'react-dom', 'react-router', 'react-router-dom', 'tinymce']
    },
    module: {
        //加载器配置
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    cacheDirectory: true,
                    plugins: ['transform-runtime', 'transform-decorators-legacy', ['import', [{ libraryName: 'antd', 'libraryDirectory': 'es', style: 'css' }]]],
                    presets:['es2015','react','stage-0']
                }
            },
            {
                test: /\.css$/,
                exclude: [path.join(__dirname,'./node_modules/antd'), path.join(__dirname, './src/styles')],
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader'
                })
            },
            {
                test: /\.css$/,
                include:[
                    path.join(__dirname, './node_modules/antd'),
                    path.join(__dirname, './src/styles'),
                ],
                loader : 'style-loader!css-loader',// 一定要有style-loader
            },
            { test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/, loader: 'url-loader?limit=50000&name=font/[name].[ext]'}
        ]
    },
    //其它解决方案配置
    resolve: {
        extensions: ['.js', '.json'],
        alias: {
            'commonMethods': __dirname+'/src/utils/commonMethods.js',
            'react/lib/ReactMount': 'react-dom/lib/ReactMount'
        }
    },
    //插件项
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html',
            inject: true, // 自动注入
            minify: {
                removeComments: true, // 去注释
                collapseWhitespace: true, // 压缩空格
                removeAttributeQuotes: true // 去除属性引用
            },
            chunksSortMode: 'dependency'
        })
    ]
};

if (env !== 'server') {
    webpackConfig.plugins.push(new CleanWebpackPlugin(['dist']))//传入数组,指定要删除的目录
}

module.exports = webpackConfig;