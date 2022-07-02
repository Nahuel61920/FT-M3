'use strict';
/*----------------------------------------------------------------
Promises Workshop: construye la libreria de ES6 promises, pledge.js
----------------------------------------------------------------*/
// // TU CÓDIGO AQUÍ:
function $Promise(executor) {
    if (typeof executor !== 'function') {
        throw new TypeError('Executor must be a function');
    }

    this._state = 'pending';
    this._handlerGroups = [];
    
    executor(
        (data) => this._internalResolve(data),
        (reason) => this._internalReject(reason) 
    );
}

$Promise.prototype._internalResolve = function(data) {
    if(this._state === 'pending') {
        this._state = 'fulfilled';
        this._value = data;
        this._callHandlers();
    }
}
$Promise.prototype._internalReject = function(reason) {
    if(this._state === 'pending') {
        this._state = 'rejected';
        this._value = reason;
    }
}

$Promise.prototype.then = function(sCb, eCb) {
    this._handlerGroups.push({
        successCb: typeof sCb === 'function' ? sCb : false,
        errorCb: typeof eCb === 'function' ? eCb : false,
    });

    if(this._state !== 'pending') {
        this._callHandlers();
    }
}

$Promise.prototype._callHandlers = function() {
    while(this._handlerGroups.length) {
        const cb = this._handlerGroups.shift();
        if(this._state === 'fulfilled') {
            if(cb.successCb) {
                cb.successCb(this._value);
            }
        } else {
            if(cb.errorCb) {
                cb.errorCb(this._value);
            }
        }
    }
}

module.exports = $Promise;
/*-------------------------------------------------------
El spec fue diseñado para funcionar con Test'Em, por lo tanto no necesitamos
realmente usar module.exports. Pero aquí está para referencia:

module.exports = $Promise;

Entonces en proyectos Node podemos esribir cosas como estas:

var Promise = require('pledge');
…
var promise = new Promise(function (resolve, reject) { … });
--------------------------------------------------------*/
