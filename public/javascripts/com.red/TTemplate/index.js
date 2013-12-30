/**
 * Created by Feng Sheng Wu on 13-12-23.
 * @author Feng Sheng Wu <idarkfox@qq.com>
 */
"use strict";

/**
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Excuse me that my English isn't very good.
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 * [(n)&lt;t{a:x:y},{b},{c...}r>&lt;s>][remark]
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 *  &lt;n>
 *  Loop count, loop executes n times
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 *  &lt;t>
 *  Template, template for use in a processor
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 *  &lt;r>
 *  default number for "y"
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 *  &lt;{a:x:y},{b},{c}...>
 *  Items: a|b|c Is a data packet for replacement
 *      example:    {html},{css},{function}
 *
 *  Items can be a character string or a numeric value of type NUMBER.
 *      example:    {0},{1:1},{2:10:5}
 *
 *  Item: a:x:y
 *  x: name/number
 *  y: total number for print
 *
 *  Focus: It can be Lambda expression
 *
 *  Lambda expression:
 *  If use Lambda then lexical analysis ignores "x" and "y"
 *  Form: =>expr;
 *  expr: JavaScript expression.
 *  example:
 *        1.    {=>context.packet[name][n]}
 *        2.    {=>Math.pow(2,n)}
 *        3.    {=>context.packet[name](n)}
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 *  &lt;s>
 *  Strategy: number value. bit [00000111].
 *
 *  bit             description
 *  ---------------------------------------------------------------
 *  0.Replace       Default : true
 *                      Level : Top
 *                      If false: no replacement occurs
 *
 *  1.Sign          Default : true
 *                      Level:low
 *                      If n =  2 => start -> abc -> abc -> end (is serial)
 *                      If n = -2 => start -> aa -> bb -> cc -> end
 *                      If false => n = |n|
 *
 *  2.Debug         Default : true
 *                      report error text
 *
 *  3.Others        Unused
 *
 **/

/* if undefined */
if ("undefined" == typeof TTemplate) {
    /* defined*/
    var TTemplate = new Function();
    TTemplate.prototype.name = "TTemplate";
    TTemplate.prototype.rex = /\[[\x09\x20]*\"(\((\-?\d*)\))?[\x09\x20]*<[\x09\x20]*template[\x09\x20]*(\{(.*)\}){1}[\x09\x20]*(\d+)*[\x09\x20]*>[\x09\x20]*(<[\x09\x20]*([0-9a-fA-F]{1,4})*[\x09\x20]*>)?[\x09\x20]*\"[\x09\x20]*\](\[[\x09\x20]*\"(.*)\"[\x09\x20]*\])?;/gim;

    TTemplate.prototype.createCmd = function (table) {

        for (var i = 0; i < table.cmd_array.length; i++) {
            if (table.cmd_array[i]) {
                if (table.cmd_array[i].search(/=>/) >= 0) {           //Lambda expression
                    var lambda = table.cmd_array[i].split(/=>/);
                    if (lambda.length > 1) {
                        var obj = {};
                        obj.lambda = new Function("context", "return " + lambda[1]);
                        obj.count = table.print_count;
                        table.cmd.push(obj);
                    }
                } else {                                        //template
                    var tpl = table.cmd_array[i].split(/:/);
                    if (tpl[0]) {

                        var obj = {};
                        obj.group = tpl[0];
                        obj.posi = parseInt(tpl[1]) || 0;
                        obj.posi = isNaN(obj.posi) ? 0 : obj.posi;
                        obj.content = "";
                        var grp = table.packet[obj.group];
                        if (typeof obj.posi == "number") {
                            var zj = 0;
                            for (var z in grp) {
                                if (zj == obj.posi) {
                                    obj.content = grp[z];
                                    break;
                                }
                                zj++;
                            }
                        } else {
                            obj.content = grp[ obj.posi ];
                        }
                        if (obj.content) {
                            obj.content = obj.content.toString();
                        }
                        if (table.strategy & 4 && 0 == obj.content.length) {
                            obj.content = "{ " + obj.group + ":" + obj.posi + ": Can not find the template. }";
                        }

                        obj.count = tpl[2] || table.print_count;
                        table.cmd.push(obj);
                    }
                }
            }
        }
    };

    TTemplate.prototype.output = function (jsonParams) {
        var self = this;
        var jparams = jsonParams || {};
        var source = jparams.src;
        var out = source.replace(this.rex, function ($0, $1, $2, $3, $4, $5, $6, $7, $8, $9) {

            // $0   context
            // $2   loop count
            // $4   cmd
            // $5   print count
            // $7   strategy
            // $9   packet

            // var default_print_count = parseInt( $5||"1" );
            var table = {
                content: $0, loop: parseInt($2 || "1"), cmd: [], print_count: parseInt($5 || "1"), strategy: parseInt($7 || "0xFF"), remark: $9 || "", packet: jparams.ins || null, isSerial: true

            };

            if (!(table.strategy & 1)) {
                return table.content;
            }

            table.cmd_array = ($4 || "").split("},{");
            self.createCmd(table);
            table.isSerial = table.strategy & 2 && table.loop > 0;
            table.loop = Math.abs(table.loop);

            var strOut = "";
            if (!table.cmd.length) {
                if (table.strategy & 4) {
                    return "< Lack of rules >" + table.content;
                }
            }

            if (table.isSerial) {
                for (; table.loop > 0; table.loop--)
                    for (var j = 0; j < table.cmd.length; j++)
                        for (var i = 0; i < table.cmd[j].count; i++)
                            strOut += table.cmd[j].lambda || false ? table.cmd[j].lambda(table) : table.cmd[j].content;
            } else {
                var loop_count = table.loop;
                for (var j = 0; j < table.cmd.length; j++) {
                    table.loop = loop_count;
                    for (; table.loop > 0; table.loop--)
                        for (var i = 0; i < table.cmd[j].count; i++)
                            strOut += table.cmd[j].lambda || false ? table.cmd[j].lambda(table) : table.cmd[j].content;
                }
            }
            //console.log(" parame length:" + $4.split("|").length + "\n 1:[" + $1 + "]\n 2:[" + $2 + "]\n 3:[" + $3 + "]\n 4:[" + $4 + "]\n 5:[" + $5 + "]\n 6:[" + $6 + "]\n 7:[" + $7 + "]\n 8:[" + $8 + "]\n 9:[" + $9 + "]\n 0:" + $0);
            return strOut;
        });
        //console.log(out);
    }


    /** @typedef {TTemplate} org.red.ttemplate */
    org.red.use(TTemplate);
//end if
}