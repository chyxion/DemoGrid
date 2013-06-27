/**
 * @describe: 通用方法，工具，
 * 其中包括JSON工具，UUID生成器，
 * 参数操作params
 * 对话框（Dialog），Ajax工具等
 * @version 0.1
 * @date created: 9/11/2012 9:49:18 
 * @author chyxion
 * @support: chyxion@163.com
 * @date modified: 
 * @modified by: 
 */
/** 
 * 提供JSON操作方法，其中最主要的两个方法
 * JSON.stringify(obj); // 将对象字符串化
 * JSON.parse(str); // 将JSON字符串解析成对象
 */
//var JSON; 
//if (!JSON) {
     //JSON = {};
//}
//// 始终使用自定义JSON
window.JSON = {};
(function () {
     'use strict';
     function f(n) {
         // Format integers models have at least two digits.
         return n < 10 ? '0' + n : n;
     }
     if (typeof Date.prototype.toJSON !== 'function') {

         Date.prototype.toJSON = function (key) {

             return isFinite(this.valueOf())
                 ? this.getUTCFullYear()     + '-' +
                     f(this.getUTCMonth() + 1) + '-' +
                     f(this.getUTCDate())      + 'T' +
                     f(this.getUTCHours())     + ':' +
                     f(this.getUTCMinutes())   + ':' +
                     f(this.getUTCSeconds())   + 'Z'
                 : null;
         };

         String.prototype.toJSON      =
             Number.prototype.toJSON  =
             Boolean.prototype.toJSON = function (key) {
                 return this.valueOf();
             };
     }

     var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
         escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
         gap,
         indent,
         meta = {    // table of character substitutions
             '\b': '\\b',
             '\t': '\\t',
             '\n': '\\n',
             '\f': '\\f',
             '\r': '\\r',
             '"' : '\\"',
             '\\': '\\\\'
         },
         rep;


     function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

         escapable.lastIndex = 0;
         return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
             var c = meta[a];
             return typeof c == 'string'
                 ? c
                 : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
         }) + '"' : '"' + string + '"';
     }


     function str(key, holder) {

// Produce a string from holder[key].

         var i,          // The loop counter.
             k,          // The member key.
             v,          // The member value.
             length,
             mind = gap,
             partial,
             value = holder[key];

// If the value has a toJSON method, call it models obtain a replacement value.

         if (value && typeof value == 'object' &&
                 typeof value.toJSON == 'function') {
             value = value.toJSON(key);
         }

// If we were called with a replacer function, then call the replacer models
// obtain a replacement value.

         if (typeof rep == 'function') {
             value = rep.call(holder, key, value);
         }

// What happens next depends on the value's type.

         switch (typeof value) {
         case 'string':
             return quote(value);

         case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

             return isFinite(value) ? String(value) : 'null';

         case 'boolean':
         case 'null':

// If the value is a boolean or null, convert it models a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

             return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

         case 'object':

// Due models a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

             if (!value) {
                 return 'null';
             }

// Make an array models hold the partial results of stringifying this object value.

             gap += indent;
             partial = [];

// Is the value an array?

             if (Object.prototype.toString.apply(value) == '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                 length = value.length;
                 for (i = 0; i < length; i += 1) {
                     partial[i] = str(i, value) || 'null';
                 }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                 v = partial.length === 0
                     ? '[]'
                     : gap
                     ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
                     : '[' + partial.join(',') + ']';
                 gap = mind;
                 return v;
             }

// If the replacer is an array, use it models select the members models be stringified.

             if (rep && typeof rep == 'object') {
                 length = rep.length;
                 for (i = 0; i < length; i += 1) {
                     if (typeof rep[i] == 'string') {
                         k = rep[i];
                         v = str(k, value);
                         if (v) {
                             partial.push(quote(k) + (gap ? ': ' : ':') + v);
                         }
                     }
                 }
             } else {

// Otherwise, iterate through all of the keys in the object.

                 for (k in value) {
                     if (Object.prototype.hasOwnProperty.call(value, k)) {
                         v = str(k, value);
                         if (v) {
                             partial.push(quote(k) + (gap ? ': ' : ':') + v);
                         }
                     }
                 }
             }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

             v = partial.length === 0
                 ? '{}'
                 : gap
                 ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
                 : '{' + partial.join(',') + '}';
             gap = mind;
             return v;
         }
     }

// If the JSON object does not yet have a stringify method, give it one.

     if (typeof JSON.stringify !== 'function') {
         JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

             var i;
             gap = '';
             indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

             if (typeof space == 'number') {
                 for (i = 0; i < space; i += 1) {
                     indent += ' ';
                 }

// If the space parameter is a string, it will be used as the indent string.

             } else if (typeof space == 'string') {
                 indent = space;
             }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

             rep = replacer;
             if (replacer && typeof replacer !== 'function' &&
                     (typeof replacer !== 'object' ||
                     typeof replacer.length !== 'number')) {
                 throw new Error('JSON.stringify');
             }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

             return str('', {'': value});
         };
     }


// If the JSON object does not yet have a parse method, give it one.

     if (typeof JSON.parse !== 'function') {
         JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

             var j;

             function walk(holder, key) {

// The walk method is used models recursively walk the resulting structure so
// that modifications can be made.

                 var k, v, value = holder[key];
                 if (value && typeof value == 'object') {
                     for (k in value) {
                         if (Object.prototype.hasOwnProperty.call(value, k)) {
                             v = walk(value, k);
                             if (v !== undefined) {
                                 value[k] = v;
                             } else {
                                 delete value[k];
                             }
                         }
                     }
                 }
                 return reviver.call(holder, key, value);
             }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

             text = String(text);
             cx.lastIndex = 0;
             if (cx.test(text)) {
                 text = text.replace(cx, function (a) {
                     return '\\u' +
                         ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                 });
             }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just models be safe, we want models reject all unexpected forms.

// We split the second stage into 4 regexp operations in order models work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look models see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

             if (/^[\],:{}\s]*$/
                     .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                         .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                         .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function models compile the text into a
// JavaScript structure. The '{' operator is subject models a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens models eliminate the ambiguity.

                 j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair models a reviver function for possible transformation.

                 return typeof reviver == 'function'
                     ? walk({'': j}, '')
                     : j;
             }

// If the text is not JSON parseable, then a SyntaxError is thrown.

             throw new SyntaxError('JSON.parse');
         };
     }
}());
/**
 * URL参数工具
 * 例：
 * http://foobar.net/foo.html?bar=1&foobar=xyz
 * 其中
 * params.base_path == 'http://foobar.net/'
 * params.bar == '1'
 * params.foobar == 'xyz'
 */
;(function() {
    var w = window,
        l = w.location,
        f;
    w.console || (w.console = {log: function(){}, error: function(msg){
        alert(JSON.stringify(msg));
    }});
    w.params = {
        base_path: window.__base_path__ = l.protocol + '//' + l.host + '/' + 
        l.pathname.split('/')[1] + '/' // 站点基址
    }; 
    // 提取出URL中的参数
    l.search.replace(/([^\?=\&]+)(=([^\&]*))?/g,
        function($0, $1, $2, $3){
            window.params[$1] = $3;
        }); // end of replace
    // 消息事件
    w.msg_listeners = {};
    // 消息函数，为兼容IE8，只接受JSON数据
    f = function(ev) {
        var me = this, msg = JSON.parse(ev.data);
        console.log ('rev msg: ');
        console.log (msg);
        // 指定监听对象
        if (msg.event_id && me.msg_listeners[msg.event_id]) {
            var l = me.msg_listeners[msg.event_id],
                p;
            // 多个回调
            if (Utils.is_array(l)) { // 函数组
                for (p = 0; p < l.length; ++p) {
                    if (Utils.is_function(l[p])) {
                        l[p](msg.data);
                    } else if (Utils.is_object(l[p])){
                        l[p].fn.call(l[p].scope, msg.data);
                    }
                }
            } else { // 函数
                if (Utils.is_function(l)) {
                    l(msg.data);
                } else if (Utils.is_object(l)){
                    l.fn.call(l.scope, msg.data);
                }
            }
        } else { // 广播监听
            var l, i, p; 
            for (i in me.msg_listeners) {
                l = me.msg_listeners[i];
                // 回调组
                if (Utils.is_array(l)) {
                    for (p = 0; p < l.length; ++p) {
                        if (Utils.is_function(l[p])) {
                            l[p](msg.data);
                        } else if (Utils.is_object(l[p])){
                            l[p].fn.call(l[p].scope, msg.data);
                        }
                    }
                } else {
                    if (Utils.is_function(l)) {
                        l(msg.data);
                    } else if (Utils.is_object(l)){
                        l.fn.call(l.scope, msg.data);
                    }
                }
            }
        }
    };
    if (w.addEventListener) {
        w.addEventListener('message', f, false);
    } else {
        w.attachEvent('onmessage', f);
    }
})(); // end

/**
 *  UUID生成器
 *  使用方法：
 *  UUID.get();
 */
var UUID = {
     get: function() {
       //
       // Loose interpretation of the specification DCE 1.1: Remote Procedure Call
       // since JavaScript doesn't allow access models internal systems, the last 48 bits
       // of the node section is made up using a series of random numbers (6 octets long).
       //  
       var me = this,
         dg = new Date(1582, 10, 15, 0, 0, 0, 0),
         dc = new Date(),
         t = dc.getTime() - dg.getTime(),
         tl = me.getIntegerBits(t,0,31),
         tm = me.getIntegerBits(t,32,47),
         thv = me.getIntegerBits(t,48,59) + '1', // version 1, security version is 2
         csar = me.getIntegerBits(me.rand(4095), 0, 7),
         csl = me.getIntegerBits(me.rand(4095), 0, 7),
         // since detection of anything about the machine/browser is far models buggy,
         // include some more random numbers here
         // if NIC or an IP can be obtained reliably, that should be put in
         // here instead.
         n = me.getIntegerBits(me.rand(8191),0,7) + 
               me.getIntegerBits(me.rand(8191),8,15) + 
               me.getIntegerBits(me.rand(8191),0,7) + 
               me.getIntegerBits(me.rand(8191),8,15) + 
               me.getIntegerBits(me.rand(8191),0,15); // this last number is two octets long
       return tl + tm  + thv  + csar + csl + n; 
     },
    //Pull out only certain bits from a very large integer, used models get the time
    //code information for the first part of a UUID. Will return zero's if there 
    //aren't enough bits models shift where it needs models.
    getIntegerBits: function(val,start,end){
      var base16 = this.returnBase(val,16),
        quadArray = new Array(),
        quadString = '',
        i;
      for(i = 0; i < base16.length; ++i) {
          quadArray.push(base16.substring(i, i+1));    
      }
      for(i = Math.floor(start / 4); i<=Math.floor(end / 4); ++i) {
          if(!quadArray[i] || quadArray[i] == '') quadString += '0';
          else quadString += quadArray[i];
      }
      return quadString;
    },
    //Replaced from the original function models leverage the built in methods in
    //JavaScript. Thanks models Robert Kieffer for pointing this one out
    returnBase: function(number, base){
     return number.toString(base).toUpperCase();
    },
    //pick a random number within a range of numbers
    //int b rand(int a); where 0 <= b <= a
    rand: function(max) {
     return Math.floor(Math.random() * (max + 1));
    }
},
/**
 * EXT对话框，单例
 */
Dialog = {
     /**
      * 提示消息
      */
    message: function(title, msg) {
     Message.alert(title, msg);
    },
    /**
    * 警告提示消息
    */
    warn_message: function(title, msg) {
     Message.warn(title, msg);
    },
    /**
    * 提示对话框，
    * @param {String} msg // 提示信息
    * @param {Function} fn  // 回调[可选]
    */
    alert : function(msg, fn) {
     Ext.MessageBox.show( {
       title : '提示',
       msg : msg,
       autoWidth : true,
       minWidth : 200,
       maxWidth : 500,
       buttons : Ext.MessageBox.OK,
       icon : Ext.MessageBox.INFO,
       fn: fn
     });
    },
    /**
    *  警告对话框
    * @param {String} msg // 警告消息
    * @param {Function} fn  // 回调[可选]
    */
    warn : function(msg, fn) {
     Ext.MessageBox.show( {
       title : '警告',
       msg : msg,
       autoWidth : true,
       minWidth : 200,
       maxWidth : 500,
       buttons : Ext.MessageBox.OK,
       icon : Ext.MessageBox.WARNING,
       fn: fn
     });
    },
    /**
    * 确认对话框
    * @param {String} msg // 提示消息
    * @param {Function} fn_ok // 确认回调
    * @param {Function} fn_no // 取消回调
    */
    confirm : function(msg, fn_ok, fn_no) {
     Ext.MessageBox.confirm('提示', msg || '你确定吗？', function(btn) {
       if (btn == 'yes') {
         fn_ok && fn_ok();
       } else {
         fn_no && fn_no();
       }
     });
    },
    /**
    * 提示输入对话框
    * @param {String} title // 标题
    * @param {String} msg // 消息
    * @param {Function} fn_ok // 确认回调
    * @param {Function} fn_no // 取消回调
    */
    prompt : function(title, msg, fn_ok, fn_no) {
     Ext.MessageBox.prompt(title, msg, function(btn, text) {
       if (btn == 'ok') {
         fn_ok && fn_ok(text);
       } else
         fn_no && fn_no();
     });
    },
    /**
    * 错误对话框
    * @param {String} msg // 错误消息，可选
    */
    error : function(msg) {
        Ext.MessageBox.show( {
            title : '错误',
            msg : msg || '操作错误！',
            autoWidth : true,
            minWidth : 200,
            maxWidth : 500,
            buttons : Ext.MessageBox.OK,
            icon : Ext.MessageBox.ERROR
        });
    },
    /**
    * 成功对话框
    * @param {String} msg // 可选
    */
    success : function(msg) {
        Ext.MessageBox.show( {
            title : '提示',
            msg : msg || '操作成功！',
            autoWidth : true,
            minWidth : 200,
            maxWidth : 500,
            buttons : Ext.MessageBox.OK,
            icon : Ext.MessageBox.INFO
        });
    },
    /**
    * 失败对话框， 
    * @param {String} msg
    */
    fail : function(msg) {
        Ext.MessageBox.show( {
            title : '错误',
            msg : msg || '操作失败！',
            autoWidth : true,
            minWidth : 200,
            maxWidth : 500,
            buttons : Ext.MessageBox.OK,
            icon : Ext.MessageBox.ERROR
        });
    },
    /**
    * 等待对话框, 关闭调用Dialog.hide();
    * @param {String} msg
    */
    waiting : function(msg) {
     Ext.MessageBox.show( {
       title : '等待...',
       msg : msg || '请等待...',
       width : 300,
       wait : true,
       waitConfig : {
         interval : 200
       },
       animEl : 'mb7'
     });
    },
    /**
    * 保存中...
    * @param {String} msg
    */
    saving : function(msg) {
     Ext.MessageBox.show( {
       title : '保存...',
       msg : msg || '保存数据，请等待...',
       width : 300,
       wait : true,
       waitConfig : {
         interval : 200
       },
       icon : 'ext-mb-download', //custom class in msg-box.html
       animEl : 'mb7'
     });
    },
    /**
    * 加载等待对话框， 关闭调用Dialog.hide();
    * @param {String} msg
    */
    loading : function(msg) {
     Ext.MessageBox.show( {
       title : '加载...',
       msg : msg || '加载数据，请等待...',
       width : 300,
       wait : true,
       icon : 'loading',
       waitConfig : {
         interval : 80
       },
       animEl : 'mb7'
     });
    },
    /**
    * 隐藏对话框
    */
    hide : function() {
     Ext.MessageBox.hide();
    }
},
/**
 * 消息提示
 */
Message = {
     /**
      * 提示消息
      */
    alert: function(title, msg) {
       if (!msg) {
         msg = title;
         title = '提示';
       }
     this._msg(title, msg, 'bg-alert');
    },
    /**
    * 创建消息提示框
    * 内部方法
    */
    _create_box: function(t, s, cls) { // 创建提示框内容box
        return '<div class="msg ' + cls + '"><h3>' +
         t + '</h3><p>' +
         s + '</p></div>';
     },
    /**
    * 显示消息提示框，内部方法
    */
    _msg: function(t, msg, type) {
       var me = this;
       !Ext.get('message-div') && Ext.DomHelper.insertFirst(document.body, {id:'message-div'});
       Ext.DomHelper.append('message-div',
         me._create_box(t, msg, type), true)
         .slideIn('t').ghost('t', {delay: 1500, remove: true});
    },
    /**
    * 警告提示消息
    */
    warn: function(title, msg) {
     if (!msg) {
       msg = title;
       title = '警告';
     }
     this._msg(title, msg, 'bg-warn');
    },
    /**
    * 错误对话框
    * @param {String} msg // 错误消息，可选
    */
    error: function(msg) {
         this._msg('错误', msg, 'bg-warn');
    },
    /**
    * 成功对话框
    * @param {String} msg // 可选
    */
    success: function(msg) {
         this._msg('成功', msg, 'bg-warn');
    },
    /**
    * 失败对话框，
    * @param {String} msg
    */
    fail: function(msg) {
         this._msg('失败', msg, 'bg-warn');
    }
},
/**
 * Ajax操作，单例
 * 例：
 * Ajax.get('this/is/a/url', function(data){
 *  console.log(data.users);
 * });
 * Ajax.get('this/is/a/url', {
 *    user_id: '2008110101'
 *  },function(user){
 *    console.log(user.name);
 * });
 * POST提交
 * Ajax.post('this/is/a/url', {
 *    user: {
 *        name: 'chyxion',
 *        id: '2008110101'
 *      };
 *  },function(){
 *    Dialog.alert('保存成功!');
 * });
 * Ajax.save('this/is/a/url', {
 *    user: {
 *        name: 'chyxion',
 *        id: '2008110101'
 *      };
 *  });
 */
Ajax = {
    /**
    * 私有内部方法，Ajax请求
    */
    _request : function(p) {
        var lm;
     if (p.loading_mask) {
        lm = Utils.loading_mask(p.loading_mask);
        lm.show();
     };
     p.before_load && p.before_load(); // 请求前回调
     // 处理参数，非String类型，转换成JSON
     if (p.params && !Ext.isFunction(p.params)) {
       var a, v;
       for (a in p.params) {
         v = p.params[a];
         if (!Ext.isString(v))
           p.params[a] = JSON.stringify(v);
       }
     } else if (p.params && Ext.isFunction(p.params)) {
        p.params = p.params();
     }
     // 添加上ajax请求标志
     if (p.method == 'POST') {
        p.params || (p.params = {});
        p.params.__ajax = 1;
     };
     // 发起请求
     Ext.Ajax.request({
       method: p.method,
       url: p.url,
       timeout: 600000, // 60秒超时
       params: p.params,
       // 禁用缓存附加参数
       disableCachingParam: '__ajax',
       disableCaching: true, // 默认禁用GET缓存，如果传入启用
       success : function(r, opt) {
         p.loading_mask && top.Ext.destroy(lm);
         p.end_load && p.end_load(r); // 请求结束回调
         try {
           r = JSON.parse(r.responseText); // 解析JSON可能出错
         } catch (e) {
           Dialog.warn('[' + r.responseText + ']不是正确的JSON数据格式！');   // 出异常直接显示响应内容
           return false;
         }
         if (r.success) {
           if (p.fn_s === false) return; // 成功回调为false，不进行操作
           Ext.isFunction(p.fn_s) ? p.fn_s(r.data, r) : Dialog.alert(r.data, r);
         } else if (r.login) {
             alert('登陆超时，请重新登陆！');
         } else {
           p.fn_f ? p.fn_f(r.message, r) : Dialog.alert('操作失败: [' + r.message + ']');
         }
       },
       failure : function(r, p) {
         p.loading_mask && top.Ext.desroy(lm);
         p.end_load && p.end_load(r); // 请求结束回调
         console.log ('error: 网络连接失败！');
       }
     });
    },
    /**
    * 私有方法，处理参数
    * @return {Object} 
    */
    _deal_args: function() {
     var args = Array.prototype.slice.call(arguments),
         lm,
         url,
         p,
         fn_s,
         fn_f;
     // 加载mask
     lm = args.shift();
     // 取消加载mask
     if (Ext.isBoolean(lm)) {
       url = args.shift();  // 第一个参数提供boolean，取第二个参数作为url
     } else {
       url = lm;
       lm = '加载...'; // 默认有加载mask
     }
     // 请求参数
     p = args.shift();
     if (Ext.isFunction(p)) { // 请求参数位为Function，忽略请求参数
       fn_s = p; // 请求参数位被成功回调占用
       p = null;
     } else { // 获取后一位参数，成功回调
       fn_s = args.shift();
     }
     // 失败回调
     fn_f = args.shift();

     return {
       loading_mask: lm,
       method: 'GET',
       url: url, 
       params: p, 
       fn_s: fn_s, 
       fn_f: fn_f};
    },
    /**
    *  Ajax.get('url.get', // 请求URL
    *     {id: 001, name: 'foo'}, // 传递参数
    *     function(data){
    *       // 请求成功
    *     }, function(msg){
    *       // 服务器端操作错误
    *     });
    *   或
    *  Ajax.get('url.get', // 请求URL, 无参数
    *     function(data){
    *       // 请求成功
    *     }, function(msg){
    *       // 服务器端操作错误
    *     });
    * @param {Boolean} loading_mask, 显示加载mask
    * @param {String} url // 请求URL
    * @param {Object} p // 请求参数【可选】
    * @param {Function} fn_s // 成功回调【可选】
    * @param {Function} fn_f // 失败回调【可选】
    * @memberOf {TypeName} 
    */
    get: function() {
        this._request(this._deal_args.apply(this, arguments));
    },
    /**
    *  Ajax.post('url.post', // 提交URL
    *     {id: 001, name: 'foo'}, // 提交参数
    *     function(data){
    *       // 提交成功
    *     }, function(msg){
    *       // 服务器端操作错误
    *     });
    *   或
    *  Ajax.post('url.post', // 提交URL, 无参数
    *     function(data){
    *       // 提交成功
    *     }, function(msg){
    *       // 服务器端操作错误
    *     });
    * @param {Boolean} loading_mask, 显示加载mask
    * @param {String} url // 请求URL
    * @param {Object} p // 请求参数【可选】
    * @param {Function} fn_s // 成功回调
    * @param {Function} fn_f // 失败回调
    * @memberOf {TypeName} 
    */
    post: function() {
        this._request(Ext.merge(this._deal_args.apply(this, arguments), 
            {method: 'POST'}));
    },
    /**
    * 加载JavaScript
    */
    load_script: function(url, fn_s, fn_f) {
        Ext.Loader.loadScript({
            url: url,
            onLoad: fn_s,
            onError: fn_f || function() {Dialog.warn('加载Script失败！')}
        });
    },
    /**
    * 保存，请求前显示进度条，结束后隐藏
    * @param {String} url
    * @param {Object} p
    * @param {Function} fn_s
    * @param {Function} fn_f
    * @memberOf {TypeName} 
    */
    save: function() {
        this._request(Ext.merge(this._deal_args.apply(this, arguments), 
            {method: 'POST', loading_mask: '保存...'}));
    },
    /**
    * 加载数据,显示加载对话框
    */
    load: function() {
        this._request(this._deal_args.apply(this, arguments));
    }
},
Utils = {
    /**
    * 重新排序grid，
    * @param g 要排序的grid
    * @param f store中的属性
    * @param v 匹配的值
    */
    reorder_grid: function(g, f, v) {
     var s = g.getStore(), // grid store
         p = new RegExp(v.toLowerCase()),  // 传入匹配正则表达式
       fn_search = function() { // 搜索函数
         var i = 0; // 计数器
         s.each(function(rec) { // 遍历store
           if (i == 0) { // 不处理第一个
             ++i;
             return true;
           }
           var e = rec.get(f).split(''), // 切分属性值
           j, 
           array_py = []; // 拼音组合
           for (j = 0; j < e.length; ++j) { // 遍历属性值的切分，获取每一个元素的拼音，加入记录
             var py = PinYin.get(e[j]),  // 获取拼音
             splits; // 记录切分拼音组合
             if (py.s && py.f) { // 有简拼，全拼
               splits = [].concat(py.s).concat(py.f); // 添加简拼，全拼
               splits.push(e[j]);
             } else { // 直接记录元素
               splits = [e[j]];
             }
             array_py.push(splits); // 增加记录
           }
           array_py.length > 0 && PinYin.product(array_py, function() { // 对拼音组合进行笛卡尔积运算
             // 将拼音组合笛卡尔积连接，匹配传入值
             if (p.test(Array.prototype.slice.call(arguments).join(''))) {
               s.move(i, 0); // 移动记录到0
               return false; // 找到匹配，停止计算笛卡尔积
             }
           });
           ++i;
       });
     };
     s.move = function(from, to) { // 移动store中数据行
         var r = this.getAt(from);
         this.data.removeAt(from);
         this.data.insert(to, r);
         this.fireEvent('move', this, from, to);
     };
     window.PinYin ? fn_search() :
       Ajax.load_script('assets/commons/js/PinYin.js',
       function(){
         fn_search();
       });
     g.getView().refresh();
    },
    units : '个十百千万@#%亿^&~',
    chars : '零一二三四五六七八九',
    num_to_cn : function(number) { // 数值转中文
     var a = (number + '').split(''), s = [], t = this;
     if (a.length > 12) {
       throw new Error('too big');
     } else {
       for ( var i = 0, j = a.length - 1; i <= j; i++) {
         if (j == 1 || j == 5 || j == 9) {//2位数 处理特殊的 1*
           if (i == 0) {
             if (a[i] != '1')
               s.push(t.chars.charAt(a[i]));
           } else {
             s.push(t.chars.charAt(a[i]));
           }
         } else {
           s.push(t.chars.charAt(a[i]));
         }
         if (i != j) {
           s.push(t.units.charAt(j - i));
         }
       }
     }
     return s.join('').replace(/零([十百千万亿@#%^&~])/g, function(m, d, b) {//优先处理 零百 零千 等
           b = t.units.indexOf(d);
           if (b != -1) {
             if (d == '亿')
               return d;
             if (d == '万')
               return d;
             if (a[j - b] == '0')
               return '零'
           }
           return '';
         }).replace(/零+/g, '零').replace(/零([万亿])/g, function(m, b) {// 零百 零千处理后 可能出现 零零相连的 再处理结尾为零的
           return b;
         }).replace(/亿[万千百]/g, '亿').replace(/[零]$/, '').replace(
         /[@#%^&~]/g, function(m) {
           return {
             '@' : '十',
             '#' : '百',
             '%' : '千',
             '^' : '十',
             '&' : '百',
             '~' : '千'
           }[m];
         }).replace(/([亿万])([一-九])/g, function(m, d, b, c) {
           c = t.units.indexOf(d);
           if (c != -1 && a[j - c] == '0')
             return d + '零' + b
           return m;
       });
    },
    cn_to_num: function(w) { // 中文数字转阿拉伯数字
     var e = '零一二三四五六七八九';
     var ew = ['十', '百', '千'];
     var ej = ['万', '亿'];
     var m = new RegExp('^([' + e + ew.join('') + ']+' + ej[1] + ')?([' + e
         + ew.join('') + ']+' + ej[0] + ')?([' + e + ew.join('') + ']+)?$')
         .exec(w);
     function foh(str) {
       if (!str)
         return 0;
       var a = 0;
       if (str.indexOf(ew[0]) == 0)
         a = 10;
       str = str.replace(new RegExp(e.charAt(0), 'g'), '');
       if (new RegExp('([' + e + '])$').test(str))
         a += e.indexOf(RegExp.$1);
       if (new RegExp('([' + e + '])' + ew[0]).test(str))
         a += e.indexOf(RegExp.$1) * 10;
       if (new RegExp('([' + e + '])' + ew[1]).test(str))
         a += e.indexOf(RegExp.$1) * 100;
       if (new RegExp('([' + e + '])' + ew[2]).test(str))
         a += e.indexOf(RegExp.$1) * 1000;
       return a;
     }
     return foh(m[1]) * 100000000 + foh(m[2]) * 10000 + foh(m[3]);
    },
    is_array: function(o) {return Object.prototype.toString.call(o) == '[object Array]'},
    is_object: function(o) {return Object.prototype.toString.call(o) == '[object Object]'},
    is_function: function(o) {return Object.prototype.toString.call(o) == '[object Function]'},
    is_string: function(o) {return Object.prototype.toString.call(o) == '[object String]'},
    date_renderer: function(fmt) {
     return Ext.util.Format.dateRenderer(fmt || 'Y-m-d H:i:s');
    },
    file_size: function(s) { // 将文件大小转换成可读格式
     if (s < 1024) {
       s += ' B';
     } else if (s < 1048576) {
       s =  (s / 1024).toFixed(2) + ' K';
     } else if (s < 1073741824) {
        s = (s / 1048576).toFixed(2) + ' M';
     } else {
       s = (s / 1073741824).toFixed(2) + ' G';
     }
     return s;
    },
    require: '<span style="color:#c00;font-weight:bold">*</span>',
    status_renderer: function (v) {
        return { 
            'N':'新建',
            'R':'运行中',
            'S':'完成',
            'C':'取消'}[v] || v;
    },
    cell_qt_renderer: function (v, md) {
        var e = Ext.String.htmlEncode;
        md.tdAttr = 'data-qtip="' + e(e(v)) + '"';
        return e(v);
    },
    page_size: 15,
    date_column_width: 136,
    loading_mask: function (msg) { // 返回loading mask
        return new top.Ext.LoadMask(top.Ext.getBody(), {msg: msg || '加载...'});
    },
    outer_html: function(node) { // 获取外部html
     return node.outerHTML || (
       function(n){
           var div = document.createElement('div'), 
               h;
           div.appendChild(n.cloneNode(true));
           h = div.innerHTML;
           div = null;
           return h;
       })(node);
    },
    /**
    * 导出内容
    * @param type, 类型【pdf，word，excel】
    * @param view，要导出的页面
    * @param file_name，文件名，可选，不提供则为UUID
    */
    export_content: function (type, view, file_name) { 
     var me = this, 
         f = Ext.get('__export_form__'), // 提交 form
         c; // 内容
     if (view.getXType()== 'uxiframe') { // 导出iframe
       // 获取iframe全部内容
       c = me.outer_html(view.getDoc().getElementsByTagName('html')[0]);
       // PDF格式去掉meta
       type == 'pdf' && (c = c.replace(/(<meta [^>]*>)/ig, ''));
     } else { // 导出内容
       c = ['<!DOCTYPE html><head>'];
       // PDF没有meta
       type != 'pdf' && c.push('<meta charset="UTF-8">');
       c = c.concat([
       '<title>',
       'shenghang soft export',
       '</title>',
       '</head>',
         '<body>',
         view.getEl().dom.innerHTML,
         '</body></html>']).join('');
     }
     console.log(c);
     f.set({action: {
       pdf: 'file/pdfExport',
       word: 'file/wordExport',
       excel: 'file/excelExport'
     }[type]})
     // 文件名
     f.down('[name=FILE_NAME]').dom.value = 
       '高校实训管理平台文件导出_' + file_name;
     // 内容
     f.down('[name=CONTENT]').dom.value = c;
     // 提交
     f.dom.submit();
    },
    /**
    * 打印视图
    */
    print_content: function (view) {
     var me = this, 
         w, 
         dh, 
         f, 
         doc;
     if (view.getXType() == 'uxiframe') { // 打印iframe
       w = view.getWin();
       if (w.do_print) {
         w.do_print();
       } else {
         w.focus();
         w.print();
       }
     } else { // 打印内容
       dh = Ext.DomHelper;
       // 创建打印iframe
       f = dh.append(document.body, {
           tag: 'iframe',
           src: '',
           border: 0,
           width: 0,
           height: 0
       });
       doc = f.contentDocument;
       // 写入内容
       doc.open();
       doc.write(['<!DOCTYPE html>',
      '<head>',
       '<meta charset="UTF-8">',
       '<link rel="stylesheet" type="text/css" href="assets/commons/css/styles.css" media="print" />',
       '</head>',
       '<body onload="focus(); print();">',
         view.getEl().dom.innerHTML,
         '</body></html>'].join(''));
       doc.close();         
       // 移除临时iframe
       f.remove();
     }
    },
    print_setting: function (fn) {
     if (Ext.isIE) { // IE，调用打印设置
       try {
         document.getElementById('__ie_print_setting__').execwb(8, 1);
       } catch (e) {
         Message.warn('打印设置错误，请确保已将系统站点设置为可信任站点，并允许浏览器运行ActiveX！');
       }
     } else { // 调用打印
         Utils.is_function(fn) ? fn() : 
            Message.warn('对不起，打印设置只支持IE浏览器！');
     }
    },
    is_ext_view: function (view) {
        return /^(\w+\.)+\w+$/.test(view);
    },
    /**
     * 向窗口发送消息
     * @param wnd，要发送的窗口
     * @param data 消息数据
     * @param event_id 事件ID
     */
    post_msg: function (wnd, data, event_id) {
        if (window.postMessage) {
            wnd.postMessage(JSON.stringify({
                data: data,
                event_id: event_id
            }), '*');
        } else {
            alert('对不起，你的浏览器版本过低，不支持发送消息功能，请升级(IE8以上)或使用其他浏览器！');
        }
    },
    /**
     * 添加消息事件
     * @param wnd 要添加的window对象
     * @param event_id 事件ID
     * @param 事件回调函数
     * @param 回调作用域
     */
    add_msg_event: function (wnd, event_id, fn, scope) {
        var me = this, l, e = {
                    fn: fn,
                    scope: scope || null
                };
        wnd.msg_listeners || (wnd.msg_listeners = {});
        if (l = wnd.msg_listeners[event_id]) {
            if (me.is_array(l)) {
                l.push(e);
            } else {
                wnd.msg_listeners[event_id] = [l, e];
            }
        } else {
            wnd.msg_listeners[event_id] = e;
        }
    },
    /**
     * 返回消息事件
     * @param wnd 消息窗口
     * @param event_id 事件ID
     */
    get_msg_event: function (wnd, event_id) {
        return wnd.msg_listeners[event_id];
    },
    /**
     * 删除消息事件
     */
    remove_msg_event: function (wnd, event_id) {
        wnd.msg_listeners[event_id] = null;
    },
    /**
     * 解析参数
     * a=1,b=2 --> {a: 1, b: 2}
     */
    parse_args: function (args) {
        var r;
        if (Ext.isString(args)) { // 字符串，解析，逗号分隔
            r = {};
            // 去除所有空白字符
            args = args.replace(/\s+/g, '');
            args.replace(/([^,=]+)(=([^,]+))?/g, function($0, $1, $2, $3) {
                    r[$1] = $3;
                }); // end of replace
        } else if (Ext.isObject(args)) { // 对象，直接赋值
            r = args;  
        } 
        return r;
    }
},
Store = {
    create: function (s) {
        var me = this,
        s_config = { // store配置
            autoLoad: true,
            store: 'json',
            pageSize: 50,
            proxy: me.ajax_proxy(s),
            listeners: me.listeners()
        };
        return Ext.create('Ext.data.Store', Ext.merge(s_config, s));
    },
    ajax_proxy: function (s) {
        return {
            type: 'ajax',
            cacheString: '__ajax',
            url: s.url,
            extraParams: s.params || s.extraParams,
            actionMethods: {
                read: 'POST'
            },
            reader: {
                type: 'json',
                root: 'data',
                idProperty: s.id_property || s.idProperty
            },
            listeners: {
                exception: function (proxy, op) { // 网络连接异常
                    console.log ('store load exception!!!');
                    console.log (op.responseText);
                    console.log (proxy);
                    console.log (op);
                    try {
                        op.responseText &&
                            Dialog.alert(JSON.parse(op.responseText).message || 
                                'Store加载异常！');
                    } catch (e) {
                       op.responseText && 
                        Dialog.alert(op.responseText || 'Store加载异常！');
                    }
                }
            }
        };
    },
    listeners: function () {
        return {
            beforeload: function (s) {
                var p = s.getProxy().extraParams, i;
                if (p) {
                    for (i in p) {
                        p[i] != null && 
                            !Ext.isString(p[i]) && 
                            (p[i] = JSON.stringify(p[i]));
                    }
                }
            }
        };
    },
    tree: function (s) { // 生成tree store
        var me = this, 
        ts = {
            store: 'tree',
            proxy: me.ajax_proxy(s),
            listeners: me.listeners(),
            root: {
                id: s.root_id || 'root',
                text: s.root_text || 'root'
            }
        };
        return Ext.merge(ts, s);
    }
};
function Mp3Player(name) {
    var me = this;
    name = name || 'mp3player';
    me.obj = document[name] || window[name];

    if (this.obj.PercentLoaded() != 100) return;

    me.play = function (url) {
        if (url) {
            this.load(url);
            this.play();
        } else {
            this.obj.TCallLabel('/','play');
        }
    };
    me.stop = function () {
        this.obj.TCallLabel('/','stop');
    };

    me.pause = function () {
        this.obj.TCallLabel('/','pause');
    };
    // 切换
    me.toggle = function () {
        this.obj.TCallLabel('/','playToggle');
    };

    me.reset = function () {
        this.obj.TCallLabel('/','reset');
    };

    me.load = function (url) {
        this.obj.SetVariable('currentSong', url);
        this.obj.TCallLabel('/','load');
    };

    me.state = function () {
        var ps = this.obj.GetVariable('playingState'),
        ls = this.obj.GetVariable('loadingState');

        if (ps == 'playing')
            if (ls == 'loaded') return ps;
            else return ls;

        if (ps == 'stopped')
            if (ls == 'empty') return ls;
            if (ls == 'error') return ls;
            else return ps;

        return ps;
    };

    me.playing_state = function () {
        // returns 'playing', 'paused', 'stopped' or 'finished'
        return this.obj.GetVariable('playingState');
    };

    me.loading_state = function () {
        // returns 'empty', 'loading', 'loaded' or 'error'
        return this.obj.GetVariable('loadingState');
    };

    me.on = function (evt, action) {
        // eventName is a string with one of the following values: onPlay, onStop, onPause, onError, onSongOver, onBufferingComplete, onBufferingStarted
        // action is a string with the javascript code to run.
        //
        // example: p.on('play', 'alert("playing!")');
        this.obj.SetVariable({
            play: 'onPlay',
            stop: 'onStop',
            pause: 'onPause',
            error: 'onError',
            over: 'onSongOver',
            bufferingcomplete: 'onBufferingComplete',
            bufferringstarted: 'onBufferingStarted'
        }[evt], action);
    };
    return me;
}
/**
 * 返回已登录用户信息
 */
function get_user() {
    return top.current_user;
}
function close_tab(id) {
     return top.close_tab(id);
}
