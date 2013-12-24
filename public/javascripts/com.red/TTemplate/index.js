/**
 * Created by Feng Sheng Wu on 13-12-23.
 * @author Feng Sheng Wu <idarkfox@qq.com>
 */
"use strict";

//if undefined
if ("undefined" == typeof TTemplate) {
    /* defined*/
    var TTemplate = new Function();
    TTemplate.prototype.name = "TTemplate";


    //按序执行（n）次      模板分组 : 模板号/名 : 一次注入量
    //insert count (n)   {group:sn/name:count|...}
    ["(1)<template{fun:10:1|html:1:2|css:span:1}>"]["this is a template"];
    /* (1) result:
     *  group SN / Name
     *  <fun  NO     10      template >
     *  <html NO      1      template >
     *  <html NO      1      template >
     *  <css  Name   span    template >
     *
     * defalut: (1)
     * ["<template{fun:10:1|html:1:2|css:span:1}>"]["this is a template"];
     * Consistent results
     * */

    ["(2)<template{fun:10:1|html:1:2|css:span:1}>"]["this is a template"];
    /* (2) result:
     *  <fun  NO     10      template >             /loop count => 1
     *  <html NO      1      template >
     *  <html NO      1      template >
     *  <css  Name   span    template >
     *  <fun  NO     10      template >             /loop count => 2
     *  <html NO      1      template >
     *  <html NO      1      template >
     *  <css  Name   span    template >
     * */


    ["(-2)<template{fun:10:1|html:1:2|css:span:1}>"]["this is a template"];
    /* (-2) result:
     *  <fun  NO     10      template >             /loop count = ( |-2| x (fun:1) ) => 2
     *  <fun  NO     10      template >
     *  <html NO      1      template >             /loop count = ( |-2| x (html:2) ) => 4
     *  <html NO      1      template >
     *  <html NO      1      template >
     *  <html NO      1      template >
     *  <css  Name   span    template >
     *  <css  Name   span    template >
     * */


    //(n){group:sn/name:count|...}c partial-count
    // "{::count}" Ignore it, and replace Using partial-count
    //(n):overall-count
    ["(1)<template{fun:10|html:1|css:span}2>"]["this is a template"];
    /* (1) result:
     *  group SN / Name
     *  <fun  NO     10      template >
     *  <fun  NO     10      template >
     *  <html NO      1      template >
     *  <html NO      1      template >
     *  <css  Name   span    template >
     *  <css  Name   span    template >
     * */

    ["(2)<template{fun:10|html:1|css:span}2>"]["this is a template"];
    /* (2) result:
     *  group SN / Name
     *  <fun  NO     10      template >             /loop count = 1 and  fun:2
     *  <fun  NO     10      template >
     *  <html NO      1      template >
     *  <html NO      1      template >
     *  <css  Name   span    template >
     *  <css  Name   span    template >
     *  <fun  NO     10      template >             /loop count = 2 and  fun:2
     *  <fun  NO     10      template >
     *  <html NO      1      template >
     *  <html NO      1      template >
     *  <css  Name   span    template >
     *  <css  Name   span    template >
     * */

    ["(-2)<template{fun:10|html:1|css:span}2>"]["this is a template"];
    /* (-2) result:
     *  group SN / Name
     *  <fun  NO     10      template >             /loop count = ( |-2| x (fun:2) ) => 4
     *  <fun  NO     10      template >
     *  <fun  NO     10      template >
     *  <fun  NO     10      template >
     *  <html NO      1      template >
     *  <html NO      1      template >
     *  <html NO      1      template >
     *  <html NO      1      template >
     *  <css  Name   span    template >
     *  <css  Name   span    template >
     *  <css  Name   span    template >
     *  <css  Name   span    template >
     * */

    ["(3)<template{fun:10|html:1|css:span}>"]["this is a template"];
    /* (3) result:
     *  group SN / Name                     fun:1,html:1,css:1
     *  <fun  NO     10      template >             /loop count = 1
     *  <html NO      1      template >
     *  <css  Name   span    template >
     *  <fun  NO     10      template >             /loop count = 2
     *  <html NO      1      template >
     *  <css  Name   span    template >
     *  <fun  NO     10      template >             /loop count = 3
     *  <html NO      1      template >
     *  <css  Name   span    template >
     * */

    ["(-3)<template{fun:10|html:1|css:span}>"]["this is a template"];
    /* (-3) result:
     *  group SN / Name                     fun:1,html:1,css:1
     *  <fun  NO     10      template >             /loop count = ( |-3| x (fun:1) ) => 3
     *  <fun  NO     10      template >             /loop count = 2
     *  <fun  NO     10      template >             /loop count = 3
     *  <html NO      1      template >
     *  <html NO      1      template >
     *  <html NO      1      template >
     *  <css  Name   span    template >
     *  <css  Name   span    template >
     *  <css  Name   span    template >
     * */

    ["(-2)<template{fun:10:1|html:1:2|css:span:1}2><10110110>"]["this is a template"];


    //TTemplate.prototype.rex = /\[\"(\((\-?\d*)\))?<template(\{(.*)\}){1}(\d+)*>\"\](\[\".*\"\])*;/gim;

    TTemplate.prototype.rex = /\[[\x09\x20]*\"(\((\-?\d*)\))?[\x09\x20]*<[\x09\x20]*template[\x09\x20]*(\{(.*)\}){1}[\x09\x20]*(\d+)*[\x09\x20]*>[\x09\x20]*(<[\x09\x20]*([0-9a-fA-F]{1,4})*[\x09\x20]*>)?[\x09\x20]*\"[\x09\x20]*\](\[[\x09\x20]*\"(.*)\"[\x09\x20]*\])?;/gim;


    TTemplate.prototype.output = function (jsonParams) {
        var jp = jsonParams;
        var source = jp.src;
        var inject = jp.ins;
        var out = source.replace(this.rex, function ($0, $1, $2, $3, $4, $5, $6, $7, $8, $9) {

            // $0 $2 $4 $5 $7 /$9

            var loopCount = parseInt($2 || 1);
            var aRules = $4.split("|");

            var stat = Object.create(null);
            stat.s = 1;
            stat.tplGroup = inject;
            stat.tpl = null;
            stat.rules = aRules;
            stat.rule = null;

            // state machine
            var pssor = [function (r) {
                r.s = 0;
            }];

            //processor
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

            /*
             while (stat.s) {
             pssor[stat.s](stat);
             }*/


            console.log(" parame length:" + $4.split("|").length + "\n 1:[" + $1 + "]\n 2:[" + $2 + "]\n 3:[" + $3 + "]\n 4:[" + $4 + "]\n 5:[" + $5 + "]\n 6:[" + $6 + "]\n 7:[" + $7 + "]\n 8:[" + $8 + "]\n 9:[" + $9 + "]\n 0:" + $0);

            var idx = parseInt($2);
            return idx < inject.length ? inject[idx] : inject[parseInt(0)];
        });
        console.log(out);
    }


//end if
}