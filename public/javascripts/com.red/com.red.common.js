"use strict";

var com = com || {};
com.red = com.red || {
    exports: function (name) {
        this[name] = {};
    }
};

/**
 *
 * @param {Array} superClassArray
 * @param {Function} fun
 * @returns {Function}
 * @constructor
 */
function Extends(superClassArray, fun) {
    var subClass = fun || function (pm) {
        var self = this;
        var params = pm || {};
        superClassArray.forEach(function (v, i, o) {
            v.call(self, params);
        });
    };
    superClassArray.forEach(function (v, i, o) {
        var names = Object.getOwnPropertyNames(v.prototype);
        names.forEach(function (name) {
            var pro = Object.getOwnPropertyDescriptor(v.prototype, name);
            Object.defineProperty(subClass.prototype, name, pro);
        });
    });
    return subClass;
}

