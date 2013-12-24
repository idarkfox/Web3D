/**
 * Created by sw on 13-12-23.
 */
if (0) {
}


//template 处理器（processor）
//<processor{元素区}{n}{c}><策略开关>
//按序循环执行{n}次 , 每个元素执行缺省值{c}次
// B6h 10110110b 策略开关
["(n)<template{fun:10:1|html:1:2|css:span:1}c><b6>"]["this is a template"];

//machine

//template

var template_switch = new function () {

    /**
     *
     * [(n)&lt;t{a|b|c|...}h>&lt;s>][remark]
     *
     *  &lt;s> Binary [00000111]
     *
     *  bit            description
     *  ---------------------------------------------------------------
     *  0.Replace       Default : true
     *                      If false: no replacement occurs
     *
     *  1.Sign          Default : true
     *                      Level:low
     *                      If n =  2 => start -> abc -> abc -> end
     *                      If n = -2 => start -> aa -> bb -> cc -> end
     *                      If false => n = |n|
     *
     *  2.Serial        Default : true
     *                      Level:high
     *                      If n = 2 => start -> abc -> abc -> end
     *                      If false => n = -|n| ;
     *                      serial_level > sign_level
     *
     *  3.Others        Unused
     *
     **/

}