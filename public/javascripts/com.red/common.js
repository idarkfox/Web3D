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
 * @example
 * var Baz = Extends([Foo,Bar]);
 * Baz.prototype.add = {...};
 */
function $extends(superClassArray, fun) {
    var subClass = fun || function (pm) {
        var self = this;
        var params = pm || {};
        superClassArray.forEach(function (_class) {
            _class.call(self, params);
        });
    };
    superClassArray.forEach(function (_class) {
        var names = Object.getOwnPropertyNames(_class.prototype);
        names.forEach(function (name) {
            var pro = Object.getOwnPropertyDescriptor(_class.prototype, name);
            Object.defineProperty(subClass.prototype, name, pro);
        });
    });
    return subClass;
}

/**
 * @name $defined
 * @param kv                            Required
 * @param {(String|Number)} kv.anyName  Required
 * @param {(Object|window)} dest        Optional
 * @constructor
 * @example
 * $defined {CONST_NAME:val};
 */
function $defined(kv, dest) {
    var _window = dest || window;
    for (var anyName in kv) {
        Object.defineProperty(window, anyName, {
            value: kv[anyName], writable: false, enumerable: true, configurable: false
        });
    }
}

function $require(class_name_and_path) {

}

