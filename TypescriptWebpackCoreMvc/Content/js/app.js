const { getText } = require('./lib');

import ES6Lib from './es6codelib';

document.getElementById("fillthis").innerHTML = getText();

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