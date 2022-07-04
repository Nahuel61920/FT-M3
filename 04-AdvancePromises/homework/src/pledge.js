"use strict";
/*----------------------------------------------------------------
Promises Workshop: construye la libreria de ES6 promises, pledge.js
----------------------------------------------------------------*/
// // TU CÓDIGO AQUÍ:
class $Promise {
    constructor(executor) {
        if (typeof executor !== "function")
            throw new TypeError("Executor must be a function");
        this._state = "pending";
        this._value = undefined;
        this._handlerGroups = [];
        // [{successCb: sH1, errorCb: eH1},{successCb: sH2, errorCb: eH2}]  -> QUEUE
        executor(this._internalResolve.bind(this), this._internalReject.bind(this));
    }
    _internalResolve(value) {
        if (this._state === "pending") {
            this._state = "fulfilled";
            this._value = value;
            this._callHandlers();
        }
    }
    _internalReject(value) {
        if (this._state === "pending") {
            this._state = "rejected";
            this._value = value;
            this._callHandlers();
        }
    }
    then(successCb, errorCb) {
        if (typeof successCb !== "function")
            successCb = false;
        if (typeof errorCb !== "function")
            errorCb = false;
        const downstreamPromise = new $Promise(() => { });
        this._handlerGroups.push({
            successCb,
            errorCb,
            // downstreamPromise: downstreamPromise
            downstreamPromise,
        });
        if (this._state !== "pending")
            this._callHandlers();
        return downstreamPromise; // <-- en estado de pending
    }
    _callHandlers() {
        while (this._handlerGroups.length) {
            let cb = this._handlerGroups.shift();
            if (this._state === "fulfilled") {
                // const result = cb.successCb && cb.successCb(this._value);
                if (cb.successCb) {
                    try {
                        const result = cb.successCb(this._value);
                        if (result instanceof $Promise) {
                            return result.then(
                                (value) => cb.downstreamPromise._internalResolve(value),
                                (error) => cb.downstreamPromise._internalReject(error)
                            );
                        } else {
                            cb.downstreamPromise._internalResolve(result);
                        }
                    } catch (e) {
                        cb.downstreamPromise._internalReject(e);
                    }
                } else {
                    return cb.downstreamPromise._internalResolve(this._value);
                }
            } else if (this._state === "rejected") {
                if (cb.errorCb) {
                    try {
                        const result = cb.errorCb(this._value);
                        if (result instanceof $Promise) {
                            return result.then(
                                (value) => cb.downstreamPromise._internalResolve(value),
                                (error) => cb.downstreamPromise._internalReject(error)
                            );
                        } else {
                            cb.downstreamPromise._internalResolve(result);
                        }
                    } catch (e) {
                        cb.downstreamPromise._internalReject(e);
                    }
                } else {
                    return cb.downstreamPromise._internalReject(this._value);
                }
            }
        }
    }
    catch(errorCb) {
        return this.then(null, errorCb);
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
