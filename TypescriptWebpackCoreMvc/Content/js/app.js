//import $ from 'jquery'; //when added, $ is defined in this module not in another scripts modules

import 'bootstrap'; //Importing Bootstrap JavaScript
//import 'bootstrap/dist/css/bootstrap.min.css'; //added in style.css

const { getText } = require('./lib'); //CommonJS module require
import ES6Lib from './es6codelib';

document.getElementById("fillthis").innerHTML = getText();

$('#fillthiswithjquery').html('Filled by Jquery??');

let myES6Object = new ES6Lib();
document.getElementById("fillthiswithes6lib").innerHTML = myES6Object.getData();

import '../css/style.css';

/* sync:
import _ from 'lodash';
function component() {
    const element = document.createElement('div');
    // Lodash, currently included via a script, is required for this line to work
    element.innerHTML = _.join(['Hello', 'webpack'], ' ');
    element.classList.add('hello');
    return element;
}
document.body.appendChild(component());
*/

// async:
async function getComponent() {
    const element = document.createElement('div');
    const { default: _ } = await import(/* webpackChunkName: "lodash" */ 'lodash');

    element.innerHTML = _.join(['Hello', 'webpack'], ' ');
    element.classList.add('hello');
    return element;
}

getComponent().then(component => {
    document.body.appendChild(component);
});

/*
 In this setup, index.js explicitly requires lodash to be present, and binds it as _ (no global scope pollution).
 By stating what dependencies a module needs, webpack can use this information to build a dependency graph.
 It then uses the graph to generate an optimized bundle where scripts will be executed in the correct order.
 */

/*
 The usage specification for the library use will be as follows:
    1- ES2015 module import:
        import * as webpackNumbers from 'webpack-numbers';
        webpackNumbers.wordToNum('Two');

    2- CommonJS module require:
        const webpackNumbers = require('webpack-numbers');
        webpackNumbers.wordToNum('Two');

    3- AMD module require:
        require(['webpackNumbers'], function (webpackNumbers) {
          webpackNumbers.wordToNum('Two');
        });

    4- The consumer also can use the library by loading it via a script tag:
        <!doctype html>
        <html>
          ...
          <script src="https://unpkg.com/webpack-numbers"></script>
          <script>
            // ...
            // Global variable
            webpackNumbers.wordToNum('Five')
            // Property in the window object
            window.webpackNumbers.wordToNum('Five')
            // ...
          </script>
        </html>

 Note that we can also configure it to expose the library in the following ways:
    - Property in the global object, for node.
    - Property in the this object.
 url: https://github.com/kalcifer/webpack-library-example
 */