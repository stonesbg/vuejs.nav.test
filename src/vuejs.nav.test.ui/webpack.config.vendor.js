const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = env => {
  const isDevBuild = !(env && env.prod);

  return [
    {
      stats: { modules: false },
      resolve: { extensions: [".js"] },
      entry: {
        vendor: [
          "event-source-polyfill",
          "isomorphic-fetch",
          "jquery",
          "skeleton-css/css/skeleton.css",
          "font-awesome/css/font-awesome.min.css",
          "vue",
          "vue-router"
        ]
      },
      module: {
        rules: [
          //{ test: /\.css$/, use: [MiniCssExtractPlugin.loader,"css-loader" ] },
          {
            test:/\.(s*)css$/, 
                use: ExtractTextPlugin.extract({ 
                        fallback:'style-loader',
                        use:['css-loader'],
                    })
          },
          {
            test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: "url-loader?limit=100000"
          },
          {
            test: /\.(ttf|eot|svg|png)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: "url-loader?limit=100000"
          }
        ]
      },
      output: {
        path: path.join(__dirname, "wwwroot", "dist"),
        publicPath: "dist/",
        filename: "[name].js",
        library: "[name]_[hash]"
      },
      plugins: [
        new ExtractTextPlugin({
          filename: "vendor.css"
        }),
        new webpack.ProvidePlugin({ $: "jquery", jQuery: "jquery" }), // Maps these identifiers to the jQuery package (because Bootstrap expects it to be a global variable)
        new webpack.DefinePlugin({
          "process.env.NODE_ENV": isDevBuild ? '"development"' : '"production"'
        }),
        new webpack.DllPlugin({
          path: path.join(__dirname, "wwwroot", "dist", "[name]-manifest.json"),
          name: "[name]_[hash]"
        })
      ].concat(isDevBuild ? [] : [new webpack.optimize.UglifyJsPlugin()])
    }
  ];
};
