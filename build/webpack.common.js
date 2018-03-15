const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = function (cssLoaderOptions, sassLoaderOptions) {
    return {
        entry: "./src/index.ts",

        output: {
            filename: "bundle.js",
            path: __dirname + "/../dist",
            publicPath: "/dist/"
        },

        resolve: {
            extensions: [".ts", ".js", ".json", '.scss', '.png']
        },

        module: {
            rules: [{
                test: /\.ts?$/,
                loader: "awesome-typescript-loader"
            }, {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    use: [{
                        loader: "typings-for-css-modules-loader",
                        options: cssLoaderOptions
                    }, {
                        loader: "postcss-loader", options: {
                            sourceMap: true
                        }
                    }, {
                        loader: "sass-loader",
                        options: sassLoaderOptions
                    }]
                })
            }, {
                test: /\.modernizrrc\.json$/,
                use: [{
                    loader: "modernizr-loader"
                }, {
                    loader: "json-loader"
                }]
            }, {
                test: /\.(png)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 1073741824
                    }
                }]
            }]
        },
        plugins: [
            new ExtractTextPlugin("stylesheets/main.css")
        ]
    }
};