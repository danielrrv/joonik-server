const webpack = require('webpack');
const path = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");
// const CleanWebpackPlugin = require('clean-webpack-plugin');

/**
 * This plugin allows us inject bundled JS into a index.html
*/

const htmlPluginIndex = new HtmlWebPackPlugin({
    template: "./lib/src/index.html",
    filename: "./index.html"
});

/**
 * 
 * Nueva instancia para crear otra app de React
 * 
 */
const htmlPluginAdmin = new HtmlWebPackPlugin({
    template: './src/admin.html',
    filename: './admin.html'
})

// const cleanPlugin = new CleanWebpackPlugin('dist')



//Webpack object
module.exports = {
    mode: 'development',
    //this is the file to be bundle, Be sure to bring all into this.
    entry: {

        app: ["./lib/src/development.js"],
        vendor: ["@babel/polyfill", "react"],
    /*
  agrega otra entry file para crear otra app, recuerda colocarle 
  el nombre del bundle sera nombre.bundle.js y se insertara en
  nombre.html(admin.html por ejemplo)
  
  */},

    //where you file will finally save
    output: {
        filename: "[name].bundle.js",
        path: __dirname + "/dist/src"
    },
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"

                }
            },
        
            {
                test: /\.css$/,
                use: [
                    {
                        loader: "style-loader"
                    },
                    {
                        loader: "css-loader",
                        options: {
                            modules: true,
                            importLoaders: 1,
                            localIdentName: "[name]_[local]_[hash:base64]",
                            sourceMap: true,
                            minimize: true
                        }
                    }
                ]
            }
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx'],
    },
    plugins: [
        htmlPluginIndex, 
        /*htmlPluginAdmin*/  
        new webpack.HotModuleReplacementPlugin(),
    ],
    devServer: {
        contentBase: path.join(__dirname, 'dist/src'),
        hot: true,
        open: true,
        historyApiFallback: true,
        port: 3000,
    }
}



