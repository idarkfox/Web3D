"use strict";

//----------------------------------------------------------------------------------------------------------------------

//----------------------------------------------------------------------------------------------------------------------
var org = org || function () {
    var o = Object.create(null);
    o.red = Object.create(null);
    return o;
}();

org.red.template = Object.create(null);

//(2)["<template{fun|html|css}10>"]["this is a template"];
//org.red.template.rex = /(\((\d*)\))?\[\"<template(\{(.*)\}){1}(\d+(?=\>)|(\w+))*>\"\]\[\".*\"\];/gim;

//(2)["<template{fun:10|html:1|css}>"]["this is a template"];
org.red.template.rex = /(\((\d*)\))?\[\"<template(\{(.*)\}){1}(\d+(?=\>)|(\w+))*>\"\]\[\".*\"\];/gim;

//function rule(str){
//    if (!str.length)
//        return false;
//
//    var rex_rule = /(?=fun|html|css)/i;
//
//    if( rex_rule.test(str)  ){
//        console.log();
//        return true;
//    } else {
//        return false;
//    }
//}

org.red.template.output = function (jsonParams) {
    var jp = jsonParams;
    var source = jp.src;
    var inject = jp.ins;
    //var out    = source.replace( /(\((\d*)\))?\[\"<template((\/(fun|html|css))+(\/\d)?)+>\"\];/gim ,function($0,$1,$2,$3,$4,$5,$6){
    var out = source.replace(org.red.template.rex, function ($0, $1, $2, $3, $4, $5, $6, $7, $8) {

        // $0 $2 $4 $5 $6

        var loopCount = parseInt($2 || 1);
        var aRules = $4.split("|");

//        var templateName = 0;
//        var isObject = false;
//        var isTemplateName = false;

        var stat = Object.create(null);
        stat.s = 1;
        stat.tplGroup = inject;
        stat.tpl = null;
        stat.rules = aRules;
        stat.rule = null;

        // state machine
        var pssor = [function (r) {
            r.s = 0;
        }]; //processor
        (1);
        pssor.push(function (r) {
            r.s = $5 == $6 ? 2 : 20;
        });       //is template name?
        (2);
        pssor.push(function (r) {
            r.s = r.rules.length ? 3 : 19
        });  //use template name.
        (3);
        pssor.push(function (r) {
            r.rules = r.rules.reverse();
            r.rule = null;
            for (var i = r.rules.length - 1; i >= 0; i--) {
                if (r.rules[i] && r.rules[i].length) {
                    r.rule = r.rules.pop();
                    break;
                } else {
                    r.rules.pop();
                }
            }
            r.s = r.rule ? 4 : 18;
        });                             //get template group name.
        (4);
        pssor.push(function (r) {
            r.s = ( "undefined" != typeof r.tplGroup[r.rule] ) ? 5 : 17
        });                             //inject data is template group?
        (5);
        pssor.push(function (r) {
            r.s = aRule.length ? 6 : 16
        });

        //20
        pssor.push(function (r) {
            r.s = aRule.length ? 3 : 19
        });


        while (stat.s) {
            pssor[stat.s](stat);
        }


        //console.log(" parame length:"+ $4.split("|").length + "\n 1:["+ $1 + "]\n 2:[" + $2 + "]\n 3:[" + $3 + "]\n 4:[" + $4 + "]\n 5:["+ $5+"]\n 6:["+ $6+"]\n 7:["+ $7+"]\n 8:["+ $8+"]\n 0:" + $0 );

        var idx = parseInt($2);
        return idx < inject.length ? inject[idx] : inject[parseInt(0)];
    });
    console.log(out);
}

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
