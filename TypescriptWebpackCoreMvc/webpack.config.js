const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = function (env, argv) {
    console.log('NODE_ENV: ', env.NODE_ENV); // 'local'
    console.log('Production: ', env.production); // true

    return {
        mode: env.production ? 'production' : 'development',
        devtool: env.production ? 'source-map' : 'eval',
        entry: () => new Promise((resolve) => resolve('./Content/js/app.js')),
        target: 'web', // <=== default is 'web'
        module: {
            noParse: /jquery|lodash/,
            rules: [
                {
                    test: /\.css$/,
                    exclude: /\.lazy\.css$/i,
                    use: [
                        { loader: 'style-loader', options: { injectType: 'singletonStyleTag' } },
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
                        //'postcss-loader',
                        //'sass-loader'
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
                                modules: true,
                            },
                        },
                    ],
                }, {
                    test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i,
                    loader: 'url-loader',
                    options: {
                        limit: 8192,
                    },
                }
            ],
        },
        output: {
            path: path.resolve(__dirname, 'wwwroot/dist'),
            filename: '[name].js',
            publicPath: 'dist/'
        },
        plugins: [
            new CleanWebpackPlugin()
            //    new TerserPlugin({
            //        terserOptions: {
            //            compress: argv['optimize-minimize'] // only if -p or --optimize-minimize were passed
            //        }
            //    })
        ]
    };
};

/*
 webpack is used to compile JavaScript modules. Once installed, you can interface with webpack either from its CLI or API.
  The import and export statements have been standardized in ES2015.
  Although they are not supported in most browsers yet, webpack does support them out of the box.

 Note:
  that webpack will not alter any code other than import and export statements.
  If you are using other ES2015 features, make sure to use a transpiler such as Babel or Bublé via webpack's loader system.

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

 Using source maps:
  When webpack bundles your source code, it can become difficult to track down errors and warnings to their original location.
  In order to make it easier to track down errors and warnings, JavaScript offers source maps, which map your compiled code back to your original source code.

 devtool: string false
 Choose a style of source mapping to enhance the debugging process. These values can affect build and rebuild speed dramatically.
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
 Plugins:
  While loaders are used to transform certain types of modules,
  plugins can be leveraged to perform a wider range of tasks like bundle optimization,
  asset management and injection of environment variables.
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