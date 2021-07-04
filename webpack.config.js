const file = require('file-loader');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: './src/index.js',
    output: {
        path: __dirname + '/dist',
        filename: 'bundle.min.js'
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin({
        terserOptions: {
            ecma: 6,
            compress: true,
            output: {
                comments: false,
                beautify: false
            }
        }
      })]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Undefined',
            template: './index.html',
            filename: 'index.html',
        }),
    ],
};
