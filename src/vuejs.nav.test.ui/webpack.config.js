const path = require("path");
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CheckerPlugin = require("awesome-typescript-loader").CheckerPlugin;
const bundleOutputDir = "./wwwroot/dist";

process.traceDeprecation = true;

module.exports = env => {
    const isDevBuild = !(env && env.prod);

    return [{
        stats: {
            modules: false
        },
        context: __dirname,
        resolve: {
            extensions: [".js", ".ts", ".vue", ".json"],
            alias: {
                vue$: "vue/dist/vue.esm.js"
            }
        },
        entry: {
            main: "./ClientApp/boot.ts"
        },
        module: {
            rules: [{
                    test: /\.vue\.html$/,
                    include: /ClientApp/,
                    loader: "vue-loader",
                    options: {
                        extractCSS: true,
                        loaders: {
                            js: "awesome-typescript-loader?silent=true"
                        }
                    }
                },
                {
                    test: /.vue$/,
                    include: /ClientApp/,
                    loader: "vue-loader",
                    options: {
                        extractCSS: true,
                        loaders: {
                            js: "awesome-typescript-loader?silent=true"
                        }
                    }
                },
                //{ test: /\.ts$/, include: /ClientApp/, use: 'awesome-typescript-loader?silent=true'},
                {
                    test: /\.tsx?$/,
                    loader: "ts-loader",
                    exclude: /node_modules/,
                    include: /ClientApp/,
                    options: {
                        appendTsSuffixTo: [/\.vue$/]
                    }
                },
                // {
                //     test: /\.css$/,
                //     use: ['style-loader', 'css-loader']
                // },
                // {
                //     test: /\.scss$/,
                //     use: [
                //         'style-loader',
                //         'css-loader',
                //         {
                //             loader: 'sass-loader',
                //             options: {
                //                 sourceMap: true
                //             }
                //         }
                //     ]
                // },
                { // regular css files
                    test: /\.css$/,
                    use: ExtractTextPlugin.extract({
                      use: 'css-loader?importLoaders=',
                    }),
                  },
                  { // sass / scss loader for webpack
                    test: /\.(sass|scss)$/,
                    use: ExtractTextPlugin.extract(['css-loader', 'sass-loader'])
                  },
                {
                    test: /\.(png|jpg|jpeg|gif|svg)$/,
                    use: "url-loader?limit=25000"
                }
            ]
        },
        output: {
            path: path.join(__dirname, bundleOutputDir),
            filename: "[name].js",
            publicPath: "dist/"
        },
        plugins: [
            new CheckerPlugin(),
            new ExtractTextPlugin('main.css',{
                allChunks: true
            }),
            // new ExtractTextPlugin('[name].css', {
            //     allChunks: true
            // }),
            //new ExtractTextPlugin("style.css", { allChunks: false }),
            new webpack.DefinePlugin({
                "process.env": {
                    NODE_ENV: JSON.stringify(isDevBuild ? "development" : "production")
                }
            }),
            new webpack.DllReferencePlugin({
                context: __dirname,
                manifest: require("./wwwroot/dist/vendor-manifest.json")
            })
        ].concat(
            isDevBuild ?
            [
                // Plugins that apply in development builds only
                new webpack.SourceMapDevToolPlugin({
                    filename: "[file].map", // Remove this line if you prefer inline source maps
                    moduleFilenameTemplate: path.relative(
                        bundleOutputDir,
                        "[resourcePath]"
                    ) // Point sourcemap entries to the original file locations on disk
                })
            ] :
            [
                // Plugins that apply in production builds only
                //new webpack.optimize.UglifyJsPlugin()
            ]
        )
    }];
};