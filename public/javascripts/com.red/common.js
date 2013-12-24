/**
 * @author Feng Sheng Wu <idarkfox@qq.com>
 */
"use strict";

//----------------------------------------------------------------------------------------------------------------------
/** @typedef {Object} JsonObject */
//----------------------------------------------------------------------------------------------------------------------
var org = org || function () {
    var o = Object.create(null);
    o.red = Object.create(null);
    return o;
}();
/**
 * @name use
 * @param {Function} _module
 * @param {JsonObject} params         json object
 */
org.red.use = function (_module, params) {

    var jsonParams = params || {};
    if (_module.prototype.name) {
        org.red[_module.prototype.name.toLowerCase()] = new _module();
    }
};
//----------------------------------------------------------------------------------------------------------------------

//----------------------------------------------------------------------------------------------------------------------
/**
 *
 * @param {Array} superClassArray   Required
 * @param {Function} constr         Optional, Constructor
 * @returns {Function}
 * @constructor
 * @example
 * var Boom = $extends_ext([Foo,Bar]);
 * Boom.prototype.add = {...};
 * var orz = new Boom();
 * var Brz = $extends_ext([Foo,Bar],function(ext){
 *      //class body
 *      return function(jsonParams){
 *          var self = this;
 *          ext( jsonParams, self );
 *          {...}
 *          {...}
 *      }
 * });
 */
function $extends_ext(superClassArray, constr) {

    var ext = function (params, body) {
        superClassArray.forEach(function (O_o) {
            O_o.call(body, params);
        });
    };
    // Class inherit, extends body
    var subClass = constr ? constr(ext) : function (jsonParams) {
        var self = this;
        ext(jsonParams || {}, self);
    };

    // Class inherit, extends prototype
    superClassArray.forEach(function (O_o) {
        var names = Object.getOwnPropertyNames(O_o.prototype);
        names.forEach(function (name) {
            var pro = Object.getOwnPropertyDescriptor(O_o.prototype, name);
            Object.defineProperty(subClass.prototype, name, pro);
        });
    });

    return subClass;
}


//----------------------------------------------------------------------------------------------------------------------
/**
 * @name $defined
 * @param kv                            Required
 * @param {(String|Number)} kv.anyName  Required
 * @param {(Object|window)} dest        Optional Destination
 * @constructor
 * @example
 * $defined( {CONST_NAME:val,"CONST_NAME2":val} );
 */
function $defined(kv, dest) {
    var _window = dest || window;
    for (var o_o in kv) {
        Object.defineProperty(_window, o_o, {
            value: kv[o_o], writable: false, enumerable: true, configurable: false
        });
    }
}
//----------------------------------------------------------------------------------------------------------------------
function $require(class_name_and_path) {
    //com.red["xxx"] =

}
//----------------------------------------------------------------------------------------------------------------------
window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        /** @param {Function} callback
         @param {Element} element */
            function (callback, element) {
            window.setTimeout(callback, 1000 / 60);
        };
})();
//----------------------------------------------------------------------------------------------------------------------
(function () {
    var oldLoad = window.onload;
    onload = function () {
        if (oldLoad)
            oldLoad(arguments);
        if ("undefined" != typeof TTemplate) {
            /** @typedef {TTemplate} org.red.ttemplate */
            org.red.use(TTemplate);
        }
    };
})();