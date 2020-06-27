require('./lib');

import ES6Lib from './es6codelib';

document.getElementById("fillthis").innerHTML = getText();

let myES6Object = new ES6Lib();
document.getElementById("fillthiswithes6lib").innerHTML= myES6Object.getData();

