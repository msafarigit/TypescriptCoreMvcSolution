﻿const path = require('path');
const webpack = require('webpack');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = function (env, argv) {
    console.log('NODE_ENV: ', env.NODE_ENV); // 'local'
    console.log('Production: ', env.production); // true
    console.log('Process NODE_ENV: ', process.env.NODE_ENV); // undefined

    const singletonStyleLoader = { loader: 'style-loader', options: { injectType: 'singletonStyleTag' } }
    const miniCssExtractPluginLoader = {
        loader: MiniCssExtractPlugin.loader,
        options: {
            // by default it uses publicPath in webpackOptions.output
            publicPath: './',
            hmr: !env.production
        }
    }

    return {
        mode: env.production ? 'production' : 'development',
        devtool: env.production ? 'source-map' : 'eval',
        entry: () => new Promise((resolve) => resolve('./Content/js/app.js')),
        target: 'web', // <=== default is 'web'
        module: {
            noParse: /jquery|lodash/,
            rules: [
                {
                    test: /\.(sa|sc|c)ss$/,
                    exclude: [/\.lazy\.css$/i, /\.link\.css$/i, /\.module\.css$/i],
                    use: [
                        env.production ? miniCssExtractPluginLoader : singletonStyleLoader,
                        {
                            loader: 'css-loader',
                            options: {
                                modules: false,
                                sourceMap: true,
                                importLoaders: 0,
                                // 0 => no loaders (default);
                                // 1 => postcss-loader;
                                // 2 => postcss-loader, sass-loader
                            }
                        },
                        //'postcss-loader', // Loader for webpack to process CSS with PostCSS
                        // the ‘postcss - loader’ configuration object MUST BE USED BEFORE  the ‘sass - loader’!
                        //'sass-loader' // Loads a SASS/SCSS file and compiles it to CSS
                    ]
                }, {
                    test: /\.lazy\.css$/i,
                    use: [
                        { loader: 'style-loader', options: { injectType: 'lazyStyleTag' } },
                        { loader: 'css-loader', options: { modules: false, sourceMap: true } },
                    ],
                }, {
                    test: /\.link\.css$/i,
                    use: [
                        { loader: 'style-loader', options: { injectType: 'linkTag' } },
                        { loader: 'file-loader' }
                    ],
                }, {
                    // For CSS modules
                    test: /\.module\.css$/i,
                    use: [
                        'style-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                modules: true
                            }
                        },
                    ],
                }, {
                    test: /\.(eot|ttf|woff|woff2)$/i,
                    loader: 'url-loader',
                    options: {
                        limit: 8192
                    }
                }, {
                    test: /\.(png|svg|jpe?g|gif)$/,
                    loader: 'file-loader',
                    options: {
                        outputPath: 'images'
                    }
                }, {
                    test: /\.(csv|tsv)$/,
                    use: ['csv-loader']
                }, {
                    test: /\.xml$/,
                    use: ['xml-loader']
                }
            ],
        },
        optimization: {
            runtimeChunk: 'single',
            splitChunks: {
                chunks: 'all',
                minChunks: 1,
                maxAsyncRequests: 5,
                maxInitialRequests: 3,
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendors',
                        chunks: 'all'
                    },
                },
            },
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js']
        },
        output: {
            path: path.resolve(__dirname, 'wwwroot/dist'),
            filename: '[name].js',
            publicPath: 'dist/'
        },
        plugins: [
            new CleanWebpackPlugin(),
            new MiniCssExtractPlugin({
                filename: 'main.css',
                // filename: '[name].css', use with optimization.splitChunks.cacheGroups
            }),
            new webpack.ProvidePlugin({
                $: 'jquery',
                jQuery: 'jquery',
                'window.jQuery': 'jquery',
                Popper: ['popper.js', 'default']
            })
            //new CompressionPlugin({
            //    filename: '[path].gz[query]',
            //    algorithm: 'gzip',
            //    test: /\.js$|\.css$|\.html$|\.eot?.+$|\.ttf?.+$|\.woff?.+$|\.svg?.+$/,
            //    threshold: 10240,
            //    minRatio: 0.8
            //}),
            //new TerserPlugin({
            //    terserOptions: {
            //        compress: argv['optimize-minimize'] // only if -p or --optimize-minimize were passed
            //    }
            //})

        ]
    };
};

/*
 webpack is used to compile JavaScript modules. Once installed, you can interface with webpack either from its CLI or API.
  The import and export statements have been standardized in ES2015.
  Although they are not supported in most browsers yet, webpack does support them out of the box.
  As you can see, webpack replaces all the export statements with Object.defineProperty on the exports object.
  It also replaces all references to imported values with property accessors.
  Also note the "use strict" directive at the beginning of every ESM.
  This was added by webpack to account for the strict mode in ESMs.

 Note:
  that webpack will not alter any code other than import and export statements.
  If you are using other ES2015 features, make sure to use a transpiler such as Babel or Bublé via webpack's loader system.

  runtime.js: split runtime code into a separate chunk.
  vendor.js: This file contains any libraries imported into your app.
   Third party libraries imported into your app also get compiled into this file(e.g.lodash, moment etc).
  main.js: This is where the action happens.This file contains all your code.

 webpack Module
  In contrast to Node.js modules, webpack modules can express their dependencies in a variety of ways. A few examples are:
    - An ES2015 import statement
    - A CommonJS require() statement
    - An AMD define and require statement
    - An @import statement inside of a css/sass/less file.
    - An image url in a stylesheet url(...) or HTML <img src=...> file.

  it is important to know that ES2015 introduced two different modes:
    - script for regular scripts with a global namespace
    - module for modular code with explicit imports and exports

  If you try to use the import or export statement inside a script, it will raise a SyntaxError.
  These statements just make no sense in a global context.
  On the other hand, the module mode implies strict mode, which forbids certain language features, such as the with statement.
  Hence, it is necessary to define the mode before the script is parsed and executed.

 Using source maps:
  When webpack bundles your source code, it can become difficult to track down errors and warnings to their original location.
  In order to make it easier to track down errors and warnings, JavaScript offers source maps, which map your compiled code back to your original source code.

 devtool: string false
  Choose a style of source mapping to enhance the debugging process. These values can affect build and rebuild speed dramatically.

 Choosing a Development Tool:
  It quickly becomes a hassle to manually run npm run build every time you want to compile your code.
  There are a couple of different options available in webpack that help you automatically compile your code whenever it changes:
    1-webpack's Watch Mode: You can instruct webpack to "watch" all files within your dependency graph for changes.
      If one of these files is updated, the code will be recompiled so you don't have to run the full build manually.
      The only downside is that you have to refresh your browser in order to see the changes.
    2-webpack-dev-server: The webpack-dev-server provides you with a simple web server and the ability to use live reloading.
    3-webpack-dev-middleware: webpack-dev-middleware is a wrapper that will emit files processed by webpack to a server.
      This is used in webpack-dev-server internally, however it's available as a separate package to allow more custom setups if desired.

  In most cases, you probably would want to use webpack-dev-server, but let's explore all of the above options.
*/

/*
Loaders:
 Out of the box, webpack only understands JavaScript and JSON files.
 Loaders allow webpack to process other types of files and convert them into valid modules that can be consumed by your application and added to the dependency graph.
 At a high level, loaders have two properties in your webpack configuration:
    - The test property identifies which file or files should be transformed.
    - The use property indicates which loader should be used to do the transforming.

 module: {
    rules: [ { test: /\.txt$/, use: 'raw-loader' } ]
 }

 The configuration above has defined a rules property for a single module with two required properties: test and use.
 This tells webpack's compiler the following:
 "Hey webpack compiler, when you come across a path that resolves to a '.txt' file inside of a require()/import statement,
  use the raw-loader to transform it before you add it to the bundle."

 Keep in mind that when using regex to match files, you may not quote it. i.e /\.txt$/ is not the same as '/\.txt$/' or "/\.txt$/".
*/

/*
 url-loader: A loader for webpack which transforms files into base64 URIs.
    url-loader works like file-loader, but can return a DataURL if the file is smaller than a byte limit.
 file-loader: The file-loader resolves import/require() on a file into a url and emits the file into the output directory.
*/

/*
 Loading CSS:
  module.rules for css enables you to import './style.css' into the file that depends on that styling.
 Now, when that module is run, a <style> tag with the stringified css will be inserted into the <head> of your html file.

 The css-loader interprets @import and url() like import/require() and will resolve them.
 The style-loader Inject CSS into the DOM.
 It's recommended to combine style-loader with the css-loader.

 The style-loader will dynamically insert the <link href="path/to/file.css" rel="stylesheet"> tag at runtime via JavaScript.
 You should use MiniCssExtractPlugin if you want to include a static <link href="path/to/file.css" rel="stylesheet">.
*/

/*
 resolve.extensions: you can now require('file') instead of require('file.js'), Attempt to resolve these extensions in order
 */

/*
 Plugins:
  While loaders are used to transform certain types of modules,
  plugins can be leveraged to perform a wider range of tasks like bundle optimization,
  asset management and injection of environment variables.
*/

/*
 ProvidePlugin:
  Automatically load modules instead of having to import or require them everywhere.
    new webpack.ProvidePlugin({
     identifier: ['module1', 'property1'],
     // ...
    });
  By default, module resolution path is current folder (./**) and node_modules.
  other: identifier: path.resolve(path.join(__dirname, 'src/module1'))

 Whenever the identifier is encountered as free variable in a module, the module is loaded automatically
 and the identifier is filled with the exports of the loaded module (or property in order to support named exports).
 For importing the default export of an ES2015 module, you have to specify the default property of module.

 Usage: Lodash Map
    new webpack.ProvidePlugin({
      _map: ['lodash', 'map']
    });
*/

/*
 Cleaning up the /dist folder:
  As you might have noticed over the past guides and code example, our /dist folder has become quite cluttered.
  Webpack will generate the files and put them in the /dist folder for you,
  but it doesn't keep track of which files are actually in use by your project.
  In general it's good practice to clean the /dist folder before each build, so that only used files will be generated.
  Let's take care of that.
  A popular plugin to manage this is the clean-webpack-plugin so let's install and configure it.
 */

/*
 MiniCssExtractPlugin: This plugin extracts CSS into separate files. It creates a CSS file per JS file which contains CSS.
 It supports On-Demand-Loading of CSS and SourceMaps.

 {
     filename: devMode ? bundleFileName + '.css' : bundleFileName + '.min.css',
     chunkFilename: devMode ? '[id].css' : '[id].[hash].css'
 }

 Extracting all CSS in a single file: The CSS can be extracted in one CSS file using optimization.splitChunks.cacheGroups.
 optimization: {
     splitChunks: {
         cacheGroups: {
             styles: {
                 name: 'styles',
                 test: /\.(sa|sc|c)ss$/,
                 chunks: 'all',
                 enforce: true,
             },
         },
     },
 }
*/

/*
 Module Resolution: A resolver is a library which helps in locating a module by its absolute path.
 A module can be required as a dependency from another module as:
    import foo from 'path/to/module';
    // or
    require('path/to/module');

 The dependency module can be from the application code or a third-party library.
 The resolver helps webpack find the module code that needs to be included in the bundle for every such require/import statement.
 */

/*
 Hot Module Replacement: HMR exchanges, adds, or removes modules while an application is running, without a full reload.
 This can significantly speed up development in a few ways:
    - Retain application state which is lost during a full reload.
    - Save valuable development time by only updating what's changed.
    - Instantly update the browser when modifications are made to CSS/JS in the source code,
      which is almost comparable to changing styles directly in the browser's dev tools.
 */

/*
 Prevent Duplication:
  The SplitChunksPlugin allows us to extract common dependencies into an existing entry chunk or an entirely new chunk.
  Let's use this to de-duplicate the lodash dependency from:
  optimization: {
     splitChunks: {
       chunks: 'all',
     }
  }

 Extracting Boilerplate:
  As we learned in code splitting, the SplitChunksPlugin can be used to split modules out into separate bundles.
 webpack provides an optimization feature to split runtime code into a separate chunk using the optimization.runtimeChunk option.

 Set it to single to create a single runtime bundle for all chunks:
 optimization: {
     runtimeChunk: 'single',
 }

 It's also good practice to extract third-party libraries, such as lodash or react,
 to a separate vendor chunk as they are less likely to change than our local source code.
 This step will allow clients to request even less from the server to stay up to date.
 optimization: {
    runtimeChunk: 'single',
    splitChunks: {
        cacheGroups: {
            vendor: {
                test: /[\\/]node_modules[\\/]/,
                name: 'vendors',
                chunks: 'all'
            },
        },
    },
 }
 */

/*
 Build Performance:
 1- Worker Pool: The thread-loader can be used to offload expensive loaders to a worker pool.
  Don't use too many workers, as there is a boot overhead for the Node.js runtime and the loader. 
  Minimize the module transfers between worker and main process. IPC is expensive.

 2-Compile in Memory: The following utilities improve performance by compiling and serving assets in memory rather than writing to disk:
    -webpack-dev-server
    -webpack-hot-middleware
    -webpack-dev-middleware

 3-Persistent cache: Enable persistent caching with the cache-loader. Clear cache directory on "postinstall" in package.json.

 4-Avoid Production Specific Tooling: These tools should typically be excluded in development:
    -TerserPlugin
    -ExtractTextPlugin
    -[hash]/[chunkhash]
    -AggressiveSplittingPlugin
    -AggressiveMergingPlugin
    -ModuleConcatenationPlugin
 */
