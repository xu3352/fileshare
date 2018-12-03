/**
 * Created by xuyinglong on 15/5/19.
 * jquery 版本需要 1.7.2 以上
 * see http://www.cnblogs.com/igin/archive/2008/11/16/1334510.html
 * 包含：DateUtil、FormUtil、RandomUtil、OtherUtil, NumberUtil
 */

// ================================================================== DateUtil
/**
 * 日期加减
 * @param interval [y,q,m,w,d,h...ms]
 * @param number
 * @returns {Date}
 */
Date.prototype.add = function(interval, number) {
    var d = this;
    var k={'y':'FullYear', 'q':'Month', 'm':'Month', 'w':'Date', 'd':'Date', 'h':'Hours', 'n':'Minutes', 's':'Seconds', 'ms':'MilliSeconds'};
    var n={'q':3, 'w':7};
    eval('d.set'+k[interval]+'(d.get'+k[interval]+'()+'+((n[interval]||1)*number)+')');
    return d;
}

/**
 * 计算两日期相差的日期年月日等
 * @param interval
 * @param objDate2
 * @returns {*}
 */
Date.prototype.diff = function(interval, objDate2) {
    var d=this, i={}, t=d.getTime(), t2=objDate2.getTime();
    i['y']=objDate2.getFullYear()-d.getFullYear();
    i['q']=i['y']*4+Math.floor(objDate2.getMonth()/4)-Math.floor(d.getMonth()/4);
    i['m']=i['y']*12+objDate2.getMonth()-d.getMonth();
    i['ms']=objDate2.getTime()-d.getTime();
    i['w']=Math.floor((t2+345600000)/(604800000))-Math.floor((t+345600000)/(604800000));
    i['d']=Math.floor(t2/86400000)-Math.floor(t/86400000);
    i['h']=Math.floor(t2/3600000)-Math.floor(t/3600000);
    i['n']=Math.floor(t2/60000)-Math.floor(t/60000);
    i['s']=Math.floor(t2/1000)-Math.floor(t/1000);
    return i[interval];
}

/**
 * 对Date的扩展，将 Date 转化为指定格式的String
 * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 * 例子：
 * (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
 * (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
 * @param fmt
 * @returns {*}
 * @constructor
 */
Date.prototype.format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

Date.prototype.toStringDate = function() {
    return this.format("yyyy-MM-dd");
}
Date.prototype.toStringDateTime = function() {
    return this.format("yyyy-MM-dd hh:mm:ss");
}
Date.prototype.toStringTime = function() {
    return this.format("hh:mm:ss");
}

/**
 * 时间倒计时
 * @param time 剩余秒数
 * @returns {string} 如：2小时5分钟
 */
function timeCountDown(time) {
    var t = parseInt(time); // 秒
    if (t <= 0) return "";

    var content = "";
    var h = (t > 60 * 60) ? parseInt(t / (60 * 60)) : 0;
    var m = (t > 60) ? parseInt((t - h * 60 * 60) / 60) : 0;
    var s = t % 60;

    if (h > 0) {
        content += (h >= 10) ? h : "0" + h;
        content += ":" + ((m >= 10) ? m : "0" + m);
        content += ":" + ((s >= 10) ? s : "0" + s);
    } else {
        content += (m >= 10) ? m : "0" + m;
        content += ":" + ((s >= 10) ? s : "0" + s);
    }
    return content;
}
// ================================================================== DateUtil



// ================================================================== FormUtil
/**
 * 在 input[data-type='date'] 后面加：上下两个按钮
 */
$(function(){
    var dom = '<span class="arrow-item">'+
        '    <a href="javascript:;" class="arrow-down" title="-1 天">▼</a>'+
        '    <a href="javascript:;" class="arrow-up" title="+1 天">▲</a>'+
        '</span>';
    $("input[data-type='date']").after( dom );

    $("span.arrow-item").on("click", "a", function(){
        var $date = $(this).parent().prev("input[data-type='date']");
        var d = new Date($.trim($date.val()));

        if (isNaN(d.getTime())) {
            d = new Date(); // default current date
        }

        if ( $(this).hasClass("arrow-up") ) {
            d.add('d', 1);
        } else if ( $(this).hasClass("arrow-down") ) {
            d.add('d', -1);
        }
        $date.val(d.toStringDate());
    });
});

/**
 * 列表页面的搜索表单的文本框，回车时，执行提交操作
 * $("#queryForm .data-search")  回车执行查询操作
 */
$(function(){
    $("#queryForm .data-search").on("keypress", "input", function(e){
        if (e.which == 13) {
            $("#queryForm").submit();
        }
    });
});

/**
 * 默认值设置
 * $("select[data-value]")    自动回填
 * $(":radio[data-value]")    自动回填
 * $(":checkbox[data-value]") 自动回填
 * $(":text[data-value]")     自动回填
 */
$(function(){
    // 文本框默认值
    $(":text[data-value],:hidden[data-value]").each(function(){
        var $input = $(this);
        // 强制仅 text 和 hidden 赋值；有遇到 radio value 被修改的情况
        if ($input.attr("type") != "text" && $input.attr("type") != "hidden") return;
        $input.val( $input.attr("data-value") );
    });
    $("select[data-value]").each(function(){
        $(this).val($(this).attr("data-value"));
    });
    // 单选框选中
    $(":radio[data-value]").each(function(){
        var name = $(this).attr("name");
        var value = $(this).attr("data-value");
        $(":radio[name='"+name+"'][value='"+value+"']").attr("checked", "checked");
    });
    // 复选框
    $(":checkbox[data-value]").each(function(){
        var name = $(this).attr("name");
        var value = $(this).attr("data-value");
        if ($(this).val() == value) $(this).attr("checked", "checked");
    });
    // 文本框 百分比的，如：0.1 => 10%
    $(":text[data-percent]").each(function(){
        var percent = $(this).attr("data-percent");
        $(this).val( parseInt(parseFloat(percent) * 100) );
    });
});

/**
 * 下拉变更时，提交表单查询
 */
$(function(){
    $("#queryForm .data-search").on("change", "select[data-change-submit='on']", function(){
        $("#queryForm").submit();
    } );
});

/**
 * 文本框获取焦点时，选中所有
 */
$(function(){
    $("body").on("click", "input[data-onfocus='select-all']", function(){
        $(this).select();
    } );
});

/**
 * 超链接 点击事件控制
 */
$(function(){
    $("a[data-url]").click(function(){
        var url = $(this).attr('data-url');
        var target = $(this).attr("data-target");
        if (!target) target = '_self';
        var a = '<a id="dataUrlLink" style="display: none;" href="'+url+'" target="'+target+'"><span>GO</span></a>';
        $("body").append(a);
        $("#dataUrlLink span").click();
        $("#dataUrlLink").remove();
    });
});

/**
 * 文本框失去焦点时，检查最大、最小值
 */
$(function(){
    // 数字：最小值, 最大值
    $("body").on("blur", "input[data-min], input[data-max]", function(){
        var $input = $(this);
        var value = parseFloat($input.val().trim());
        var min = parseFloat($input.attr('data-min'));
        var max = parseFloat($input.attr('data-max'));
        if (isNaN(value)) {
            $input.val($input.attr("data-blank")!=undefined?$input.attr("data-blank"):!isNaN(min)?min:0); // if not a number
            return;
        }
        $input.val(value);
        if (!isNaN(min) && value < min) $input.val(min);
        if (!isNaN(max) && value > max) $input.val(max);
    });

    // 数字：数值大小不能小于(lt) 或 不能大于(gt)
    $("body").on("blur", "input[data-number-lt], input[data-number-gt]", function(){
        var $input = $(this);
        var value = parseFloat($input.val());
        var min = parseFloat($("#"+ $input.attr('data-number-gt') ).val() );
        var max = parseFloat($("#"+  $input.attr('data-number-lt') ).val() );
        if (isNaN(value)) {
            $input.val($input.attr("data-blank")!=undefined?$input.attr("data-blank"):!isNaN(min)?min:0); // if not a number
            return;
        }
        $input.val(value);
        if (!isNaN(min) && value < min) $input.val(min);
        if (!isNaN(max) && value > max) $input.val(max);
    });
});
// ================================================================== FormUtil



// ================================================================== RandomUtil
/**
 * 随机数字 [min, max]
 * @param min
 * @param max
 * @returns {number}
 */
function rand(min, max) {
    return Math.floor(Math.max(min, Math.random() * (max + 1)));
};

/**
 * 随机密码组合
 * @param len
 * @param kind 类型数组[0,1,2,3] == [小写字母, 大写字母, 数字, 特殊字符]
 * @returns {string}
 */
function randChar(len, kind) {
    var text = ['abcdefghijklmnopqrstuvwxyz', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', '1234567890', '~!@#$%^&*()_+";",./?<>'];
    var pw = '';
    var len = len ? len : rand(8, 16); // 长度为8-16

    if (!kind) kind = [0, 1, 2, 3];   //default all text subindex

    for (var i = 0; i < len; ++i) {
        // var strpos = rand(0, text.length - 1);
        var index = rand(0, kind.length - 1);
        var strpos = kind[index];
        pw += text[strpos].charAt(rand(0, text[strpos].length - 1));
    }
    return pw;
}
// ================================================================== RandomUtil

/**
 * bootstrap tooltip 提示初始化
 */
$(function(){
    //$('[data-toggle="tooltip"]').tooltip();
})

// ================================================================== tooltip



// ================================================================== StringUtil
/**
 * 去掉前后所有空白字符
 * @returns {*|string|void|XML}
 */
String.prototype.trim = function() {
    return this.replace(/(^\s+)|(\s+$)/g,"");
}
/**
 * 去掉左侧所有空白字符
 * @returns {*|string|void|XML}
 */
String.prototype.ltrim = function() {
    return this.replace(/(^\s+)/g,"");
}
/**
 * 去掉右侧所有空白字符
 * @returns {*|string|void|XML}
 */
String.prototype.rtrim = function() {
    return this.replace(/(\s+$)/g,"");
}
/**
 * 替换所有匹配到的字符串
 * @param find
 * @param replace
 * @returns {string}
 */
String.prototype.replaceAll = function (find, replace) {
    var str = this;
    return str.replace(new RegExp(find, 'g'), replace);
};
// ================================================================== StringUtil



// ================================================================== NumberUtil
/**
 * 小数转百分比形式
 * @param num 保留几位小数
 * @returns ##.#%
 */
Number.prototype.percent = function(num) {
    if (!isFinite(this)) return "";
    var n = (this * 100).toFixed(num);
    if (n == 0) return "";
    return n.toString() + '%';
}
// ================================================================== NumberUtil


// ================================================================== ScrollUtil Jquery插件
$.fn.extend({
    // 滚动到指定位置，获取焦点
    scrollAndFocus:function() {
        $("html,body").animate({scrollTop:$(this).offset().top - 100}, 1000);
        $(this).focus();
    }
});

// ================================================================== ScrollUtil


// ================================================================== ArrayUtil
/**
 * 是否包含元素
 * @param obj
 * @returns boolean
 */
Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] == obj) return true;
    }
    return false;
}
// ================================================================== ArrayUtil

// ================================================================== URLUtil
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
function qs(n) {
    var s = window.location.search;
    var v = s.match(new RegExp("[\?\&]" + n + "=([^\&]*)(\&?)", "i"));
    return v ? v[1] : v;
}
function allqs() {
    var dic = {};
    var ss = location.search.substring(1).split('&');
    for (var i = 0, len = ss.length; i < len; i++) {
        var ss2 = ss[i].split('=');
        ss2[0] && (dic[ss2[0]] = ss2[1]);
    }
    return dic;
}
function toqs(qs) {
    var ss = [];
    for (var p in qs) {
        ss.push(p + '=' + qs[p]);
    }
    return ss.join('&');
}
// ================================================================== URLUtil

// ================================================================== TableUtil
$(function(){
    /**
     * 列表页面 table.data-grid tbody 如果空, 则展示指定的文案
     */
    $("table.data-grid[data-empty-msg]").each(function(){
        var $table = $(this);
        if ($table.find("tbody tr").length == 0) {
            var columSize = $table.find("thead tr:last th").length;
            var msg = $table.attr("data-empty-msg");
            var dom = '<tr><td colspan="'+columSize+'">'+msg+'</td></tr>';
            $table.find("tbody").append(dom);
        }
    });
});

/**
 * 合计指定列的值, 最后追加table最后一行, 指定列将会自动累加
 * $("table thead tr:last th.sum") 这一列的 text()
 * @param table
 */
function data_grid_sum(table) {
    var $table = $(table);

    // 过滤出那些 th.sum 列需要统计
    var indexList = [];
    $table.find("thead tr:last th.sum").each(function () {
        var $th = $(this);
        indexList.push($table.find("thead tr:last th").index($th))
    });
    if (indexList.length <= 0) return;

    // init dict
    var dict = {};
    for (var i = 0; i < indexList.length; i++) {
        dict[indexList[i]] = 0;
    }

    // 统计 tbody 对应的 td 的 text, 放到字典里
    $table.find("tbody tr").each(function () {
        var $tr = $(this);
        for (var i = 0; i < indexList.length; i++) {
            var index = indexList[i];
            var v = parseInt($tr.find("td:eq(" + index + ")").text());
            if (isNaN(v)) continue;
            dict[index] += v;
        }
    });

    // 追加 tr 到 table 的 末尾
    var tr = '<tr>';
    var columSize = $table.find("thead tr:last th").length;
    for (var i = 0; i < columSize; i++) {
        var v = '';
        if (dict[i]) v = dict[i];
        if (i === 0 && v === '') v = '合计';
        tr += '<td>' + v + '</td>';
    }
    tr += '</tr>';
    $table.append(tr);
}

/**
 * table列表达式计算
 * $("table thead tr th[grid-expr]") 这一列会进行计算
 * 数据列以 [c0, c1, c2 ...] 命名, 可以使用 grid-alias 取别名
 * @see https://xu3352.github.io/javascript/2018/05/09/javascript-table-column-data-expression
 * @param table
 */
function data_grid_calc(table) {
    var $table = $(table);

    // 过滤出哪些列需要计算 [{index:expr}]
    var exprList = [];
    $table.find("thead tr th[grid-expr]").each(function () {
        var $th = $(this);
        var index = $table.find("thead tr th").index($th);
        var expr = $(this).attr("grid-expr");
        exprList.push( {index:index, expr:expr} );
    });
    if (exprList.length <= 0) return;

    // 别名字典 {aliasA:c3}
    var aliasDict = {};
    $table.find("thead tr th[grid-alias]").each(function () {
        var $th = $(this);
        var index = $table.find("thead tr th").index($th);
        var alias = $(this).attr("grid-alias");
        aliasDict[alias] = "c" + index;
    });
    var aliasList = grid_alias_reverse_list(aliasDict);
    // console.log( aliasDict );

    // 统计 tbody 对应的 td 的 text, 放到字典里
    var row = 1;
    $table.find("tbody tr").each(function () {
        var $tr = $(this);

        // 此行所有列的值取出来
        var dataTdList = [];
        var $tds = $tr.find("td");
        for (var i = 0; i < $tds.length; i++) {
            var v = parseInt($($tds[i]).text());
            if (isNaN(v)) {
                v = 0;
                // 如果没有值, 但这一列是表达式呢?
                var index = $tr.find("td").index($tds[i]);
                var $head_tr = $table.find("thead tr th:eq("+index+")");
                if ($head_tr.attr("grid-expr")) {
                    v = "(" + $head_tr.attr("grid-expr") + ")"
                }
            }
            dataTdList.push(v);
        }
        // console.log( "dataTdList:" + dataTdList );

        // 按表达式求值
        for (var i = 0; i < exprList.length; i++) {
            var index = exprList[i]["index"];
            var expr = exprList[i]["expr"];

            // 表达式填值后 eval 计算
            var numberExpr = grid_expr_complex_to_simple(expr, aliasDict, aliasList, dataTdList);
            var number = eval( numberExpr );
            // 展示
            $tr.find("td:eq(" + index + ")").text( number );
            // 日志
            // console.log("data[" + row + "," + index + "] expr:" + expr + " numberExpr:" + numberExpr + " number:" + number);
        }
        row++;
    });
}
// 表达式计算:复杂->简单->数字
function grid_expr_complex_to_simple(expr, aliasDict, aliasList, dataTdList) {
    var newExpr = expr;

    // console.log(newExpr);
    // 循环求值:直到表达式 (没有别名 && 没有[c0, c1, c2 ...]) 的时候为止
    do {
        newExpr = grid_expr_alias_replace(newExpr, aliasList, aliasDict);
        // console.log(newExpr);
        newExpr = grid_expr_fill(newExpr, dataTdList);
        // console.log(newExpr);
    } while (grid_expr_has_alias(newExpr, aliasList) || newExpr.match(/c\d+/))
    return newExpr;
}
// 倒序的别名List
function grid_alias_reverse_list(aliasDict) {
    var aliasList = [];
    for (var alias in aliasDict) {
        aliasList.push(alias);
    }
    // 倒序:长的排前面, 一样长的按字母倒序
    aliasList.sort(function (a, b) {
       if (a.length != b.length) return a.length < b.length;
       if (a == b) return 0;
       return a < b;
    });
    return aliasList;
}
// 表达式是否包含别名
function grid_expr_has_alias(expr, aliasList) {
    for (var i in aliasList) {
        if (expr.indexOf(aliasList[i]) >= 0) return true;
    }
    return false;
}
// 表达式别名替换:别名长的优先!
function grid_expr_alias_replace(expr, aliasList, aliasDict) {
    var newExpr = expr;
    // 包含别名的进行别名替换
    if (aliasDict.length <= 0) return newExpr;
    if (!grid_expr_has_alias(newExpr, aliasList)) return newExpr;

    for (var i in aliasList) {
        var alias = aliasList[i];
        newExpr = newExpr.replace(new RegExp(alias, 'g'), aliasDict[alias]);
    }
    return newExpr;
}
// 表达式填充:列编号大的优先!
function grid_expr_fill(expr, list) {
    var newExpr = expr;
    // 匹配 [c0, c1, c2 ...] 的进行数值填充
    if (!newExpr.match(/c\d+/)) return newExpr;

    // 倒序!(不然超过10列会悲剧)
    for (var i = list.length - 1; i >= 0; i--) {
        var reg = new RegExp("c" + i, 'g');
        newExpr = newExpr.replace(reg, list[i]);
    }
    return newExpr;
}
/**
 * 点击表头进行排序处理 倒序(默认)|正序
 * $("table thead tr th") 绑定点击事件
 */
function data_grid_orderby(table) {
    var $table = $(table);
    $table.find("thead tr th").on("click", function () {
        var $th = $(this);
        var arrow = $th.find("code").text();  // ⇡ or ⇣
        var index = $table.find("thead tr th").index($th);
        var $trList = $table.find("tbody tr");

        // 正序排列
        $trList.sort(function (tr1, tr2) {
            var d1 = parseFloat($(tr1).find("td:eq(" + index + ")").text());
            var d2 = parseFloat($(tr2).find("td:eq(" + index + ")").text());
            if (isNaN(d1)) return 0;
            if ("⇣" == arrow) return d1 > d2 ? 1 : -1;  // (无 | 倒序) => 正序
            return d1 < d2 ? 1 : -1;    // 正序 => 倒序(默认)
        });

        // 重新排序
        $table.find("tbody tr").remove();
        for (var i in $trList) {
            if ( $trList[i].tagName == "TR" ) {
                $table.append( $trList[i] );
            }
        }
        // 设置小图标
        $table.find("thead tr th code").remove();
        $th.prepend("<code>" + ("⇣" == arrow ? "⇡" : "⇣") + "</code>");
    });
}
// ================================================================== TableUtil

function isPC(){
    var userAgentInfo = navigator.userAgent;
    var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; }
    }
    return flag;
}

window.mobilecheck = function() {
    var check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
};
