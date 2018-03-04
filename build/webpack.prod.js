const CleanWebpackPlugin = require("clean-webpack-plugin");
const common = require("./webpack.common.js");
const merge = require("webpack-merge");
const webpack = require('webpack');

const cssLoaderOptions = {
    minimize: true,
    namedExport: true,
    scss: true,
    modules: false,
    url: true,
    root: '.'
};

const sassLoaderOptions = {};

module.exports = merge(common(cssLoaderOptions, sassLoaderOptions), {
    plugins: [
        new CleanWebpackPlugin(['dist'], {
            root: __dirname
        }),
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.DefinePlugin({
            "process.env": {
                "NODE_ENV": JSON.stringify("production")
            }
        })
    ]
});
