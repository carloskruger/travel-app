const path = require('path')
const webpack = require('webpack')
const miniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
    output: {
        libraryTarget: 'var',
        library: 'Client'
        },     
    mode: "production",
    entry: './src/client/index.js',
    module: {
        rules: [ {
                    test: '/\.js$/',
                    exclude: /node_modules/,
                    loader: 'babel-loader'
                    },
                    {
                        test: /\.scss$/,
                        use: ['style-loader', 'css-loader', 'sass-loader']
                            }
                            
                ]
},
plugins: [
    new HtmlWebPackPlugin({
    template: "./src/client/views/index.html",
    filename: "./index.html",
    }),
    new WorkboxPlugin.GenerateSW(),
    new CleanWebpackPlugin({
        // Simulate the removal of files
        dry: true,
        // Write Logs to Console
        verbose: true,
        // Automatically remove all unused webpack assets on rebuild
        cleanStaleWebpackAssets: true,
        protectWebpackAssets: false
    })
    ],
    optimization: {
        minimizer: [new TerserPlugin ({}), new OptimizeCSSAssetsPlugin({})]
    }       
}