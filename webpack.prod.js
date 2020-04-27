const path = require('path')
const webpack = require('webpack')
const miniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin')

module.exports = {
    mode: "production",
    entry: './src/client/index.js',
    module: {
        rules: [ {
                    test: '/\.js$/',
                    exclude: /node_modules/,
                    loader: 'babel-loader'
                    }
                ]
},
plugins: [
    new HtmlWebPackPlugin({
    template: "./src/client/views/index.html",
    filename: "./index.html",
    }),
    new WorkboxPlugin.GenerateSW()
    ],
 
    optimization: {
        minimizer: [new TerserPlugin ({}), new OptimizeCSSAssetsPlugin({})]
    }       

}