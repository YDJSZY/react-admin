/**
 * Created by luwenwei on 17/9/13.
 */
let path = require('path');
let CleanWebpackPlugin = require('clean-webpack-plugin');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let MiniCssExtractPlugin = require('mini-css-extract-plugin');
let env = process.env.NODE_ENV;
let webpackConfig = {
    //入口文件输出配置
    entry: {
        app:path.resolve(__dirname, './src/index.js'),
        react:['react', 'react-dom', 'react-router', 'react-router-dom']
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
                    plugins: ['transform-runtime',['import', [{ libraryName: 'antd', 'libraryDirectory': 'es', style: 'css' }]]],
                    presets:['es2015','react','stage-0']
                }
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader, // replace ExtractTextPlugin.extract({..})
                    'css-loader'
                ]
            },
            { test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/, loader: 'url-loader?limit=50000&name=font/[name].[ext]'}
        ]
    },
    //其它解决方案配置
    resolve: {
        extensions: ['.js', '.json'],
        alias: {
            'commonMethods': __dirname+'/src/utils/commonMethods.js',
            'uploadFile': __dirname+'/src/packages/fileUpload/dist/js/upload-file.min.js',
            'react/lib/ReactMount': 'react-dom/lib/ReactMount'
        }
    },

    /*optimization: {
        runtimeChunk: {
            name: 'manifest'
        },
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    priority: -20,
                    chunks: 'all'
                }
            }
        }
    },*/
    //插件项
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: './index.html',
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