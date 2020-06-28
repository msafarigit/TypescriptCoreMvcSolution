require('./lib');

import ES6Lib from './es6codelib';

document.getElementById("fillthis").innerHTML = getText();

let myES6Object = new ES6Lib();
document.getElementById("fillthiswithes6lib").innerHTML = myES6Object.getData();

import _ from 'lodash';
function component() {
    const element = document.createElement('div');
    // Lodash, currently included via a script, is required for this line to work
    element.innerHTML = _.join(['Hello', 'webpack'], ' ');
    return element;
}

document.body.appendChild(component());
