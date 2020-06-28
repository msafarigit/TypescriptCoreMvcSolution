const path = require('path');
const webpack = require('webpack');

module.exports = function (env, argv) {
    console.log('NODE_ENV: ', env.NODE_ENV); // 'local'
    console.log('Production: ', env.production); // true

    return {
        mode: env.production ? 'production' : 'development',
        devtool: env.production ? 'source-maps' : 'eval',
        entry: () => new Promise((resolve) => resolve('./Content/js/app.js')),
        target: 'web', // <=== default is 'web'
        module: {
            noParse: /jquery|lodash/,
        },
        output: {
            path: path.resolve(__dirname, 'wwwroot/dist'),
            filename: '[name].js',
            publicPath: 'dist/'
        }
        //plugins: [
        //    new TerserPlugin({
        //        terserOptions: {
        //            compress: argv['optimize-minimize'] // only if -p or --optimize-minimize were passed
        //        }
        //    })
        //]
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
 Plugins:
 While loaders are used to transform certain types of modules,
 plugins can be leveraged to perform a wider range of tasks like bundle optimization,
 asset management and injection of environment variables.
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