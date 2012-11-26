
/// support magic - Tangram 1.x Code Start


// Copyright (c) 2009-2012, Baidu Inc. All rights reserved.
//
// Licensed under the BSD License
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//      http://tangram.baidu.com/license.html
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


















var T,
    baidu = T = baidu || function(q, c) {
        return baidu.dom ? baidu.dom(q, c) : null;
    };

// 版本号
baidu.version = "2.0.0.3";

// baidu 对象的唯一标识（身份证号）
baidu.guid = "$BAIDU$";

// 对象唯一标识属性名
baidu.key = "tangram_guid";

// Tangram可能被放在闭包中
// 一些页面级别唯一的属性，需要挂载在window[baidu.guid]上
var _ = window[baidu.guid] = window[baidu.guid] || {};
(_.versions || (_.versions = [])).push(baidu.version);

// 20120709 mz 添加参数类型检查器，对参数做类型检测保护
baidu.check = baidu.check || function(){};



 
baidu.lang = baidu.lang || {};

/// support magic - Tangram 1.x Code Start









 
baidu.forEach = function( enumerable, iterator, context ) {
    var i, n, t;

    if ( typeof iterator == "function" && enumerable) {

        // Array or ArrayLike or NodeList or String or ArrayBuffer
        n = typeof enumerable.length == "number" ? enumerable.length : enumerable.byteLength;
        if ( typeof n == "number" ) {

            // 20121030 function.length
            //safari5.1.7 can not use typeof to check nodeList - linlingyu
            if (Object.prototype.toString.call(enumerable) === "[object Function]") {
                return enumerable;
            }

            for ( i=0; i<n; i++ ) {

                t = enumerable[ i ] || (enumerable.charAt && enumerable.charAt( i ));

                // 被循环执行的函数，默认会传入三个参数(array[i], i, array)
                iterator.call( context || null, t, i, enumerable );
            }
        
        // enumerable is number
        } else if (typeof enumerable == "number") {

            for (i=0; i<enumerable; i++) {
                iterator.call( context || null, i, i, i);
            }
        
        // enumerable is json
        } else if (typeof enumerable == "object") {

            for (i in enumerable) {
                if ( enumerable.hasOwnProperty(i) ) {
                    iterator.call( context || null, enumerable[ i ], i, enumerable );
                }
            }
        }
    }

    return enumerable;
};




baidu.type = (function() {
    var objectType = {},
        nodeType = [, "HTMLElement", "Attribute", "Text", , , , , "Comment", "Document", , "DocumentFragment", ],
        str = "Array Boolean Date Error Function Number RegExp String",
        retryType = {'object': 1, 'function': '1'},//解决safari对于childNodes算为function的问题
        toString = objectType.toString;

    // 给 objectType 集合赋值，建立映射
    baidu.forEach(str.split(" "), function(name) {
        objectType[ "[object " + name + "]" ] = name.toLowerCase();

        baidu[ "is" + name ] = function ( unknow ) {
            return baidu.type(unknow) == name.toLowerCase();
        }
    });

    // 方法主体
    return function ( unknow ) {
        var s = typeof unknow;
        return !retryType[s] ? s
            : unknow == null ? "null"
            : unknow._type_
                || objectType[ toString.call( unknow ) ]
                || nodeType[ unknow.nodeType ]
                || ( unknow == unknow.window ? "Window" : "" )
                || "object";
    };
})();

// extend
baidu.isDate = function( unknow ) {
    return baidu.type(unknow) == "date" && unknow.toString() != 'Invalid Date' && !isNaN(unknow);
};

baidu.isElement = function( unknow ) {
    return baidu.type(unknow) == "HTMLElement";
};

// 20120818 mz 检查对象是否可被枚举，对象可以是：Array NodeList HTMLCollection $DOM
baidu.isEnumerable = function( unknow ){
    return unknow != null
        && typeof unknow == "object"
        &&(typeof unknow.length == "number"
        || typeof unknow[0] != "undefined");
};

baidu.isNumber = function( unknow ) {
    return baidu.type(unknow) == "number" && isFinite( unknow );
};

// 20120903 mz 检查对象是否为一个简单对象 {}
baidu.isPlainObject = function(unknow) {
    var key,
        hasOwnProperty = Object.prototype.hasOwnProperty;

    if ( baidu.type(unknow) != "object" ) {
        return false;
    }

    //判断new fn()自定义对象的情况
    //constructor不是继承自原型链的
    //并且原型中有isPrototypeOf方法才是Object
    if ( unknow.constructor &&
        !hasOwnProperty.call(unknow, "constructor") &&
        !hasOwnProperty.call(unknow.constructor.prototype, "isPrototypeOf") ) {
        return false;
    }
    //判断有继承的情况
    //如果有一项是继承过来的，那么一定不是字面量Object
    //OwnProperty会首先被遍历，为了加速遍历过程，直接看最后一项
    for ( key in unknow ) {}
    return key === undefined || hasOwnProperty.call( unknow, key );
};

baidu.isObject = function( unknow ) {
    return typeof unknow === "function" || ( typeof unknow === "object" && unknow != null );
};






baidu.global = baidu.global || (function() {
    baidu._global_ = window[ baidu.guid ];
    var global = baidu._global_._ = {};

    return function( key, value, overwrite ) {
        if ( typeof value != "undefined" ) {
            if(!overwrite) {
                value = typeof global[ key ] == "undefined" ? value : global[ key ];
            }
            global[ key ] =  value;

        } else if (key && typeof global[ key ] == "undefined" ) {
            global[ key ] = {};
        }

        return global[ key ];
    }
})();










baidu.extend = function(depthClone, object) {
    var second, options, key, src, copy,
        i = 1,
        n = arguments.length,
        result = depthClone || {},
        copyIsArray, clone;
    
    baidu.isBoolean( depthClone ) && (i = 2) && (result = object || {});
    !baidu.isObject( result ) && (result = {});

    for (; i<n; i++) {
        options = arguments[i];
        if( baidu.isObject(options) ) {
            for( key in options ) {
                src = result[key];
                copy = options[key];
                // Prevent never-ending loop
                if ( src === copy ) {
                    continue;
                }
                
                if(baidu.isBoolean(depthClone) && depthClone && copy
                    && (baidu.isPlainObject(copy) || (copyIsArray = baidu.isArray(copy)))){
                        if(copyIsArray){
                            copyIsArray = false;
                            clone = src && baidu.isArray(src) ? src : [];
                        }else{
                            clone = src && baidu.isPlainObject(src) ? src : {};
                        }
                        result[key] = baidu.extend(depthClone, clone, copy);
                }else if(copy !== undefined){
                    result[key] = copy;
                }
            }
        }
    }
    return result;
};





baidu.browser = baidu.browser || function(){
    var ua = navigator.userAgent;
    
    var result = {
        isStrict : document.compatMode == "CSS1Compat"
        ,isGecko : /gecko/i.test(ua) && !/like gecko/i.test(ua)
        ,isWebkit: /webkit/i.test(ua)
    };

    try{/(\d+\.\d+)/.test(external.max_version) && (result.maxthon = + RegExp['\x241'])} catch (e){};

    // 蛋疼 你懂的
    switch (true) {
        case /msie (\d+\.\d+)/i.test(ua) :
            result.ie = document.documentMode || + RegExp['\x241'];
            break;
        case /chrome\/(\d+\.\d+)/i.test(ua) :
            result.chrome = + RegExp['\x241'];
            break;
        case /(\d+\.\d)?(?:\.\d)?\s+safari\/?(\d+\.\d+)?/i.test(ua) && !/chrome/i.test(ua) :
            result.safari = + (RegExp['\x241'] || RegExp['\x242']);
            break;
        case /firefox\/(\d+\.\d+)/i.test(ua) : 
            result.firefox = + RegExp['\x241'];
            break;
        
        case /opera(?:\/| )(\d+(?:\.\d+)?)(.+?(version\/(\d+(?:\.\d+)?)))?/i.test(ua) :
            result.opera = + ( RegExp["\x244"] || RegExp["\x241"] );
            break;
    }
           
    baidu.extend(baidu, result);

    return result;
}();




baidu.id = function() {
    var maps = baidu.global("_maps_id")
        ,key = baidu.key;

    baidu.global("_counter", 1, true);

    return function( object, command ) {
        var e
            ,str_1= baidu.isString( object )
            ,obj_1= baidu.isObject( object )
            ,id = obj_1 ? object[ key ] : str_1 ? object : "";

        // 第二个参数为 String
        if ( baidu.isString( command ) ) {
            switch ( command ) {
            case "get" :
                return obj_1 ? id : maps[id];
            break;
            case "remove" :
            case "delete" :
                if ( e = maps[id] ) {
                    // 20120827 mz IE低版本给 element[key] 赋值时会写入DOM树，因此在移除的时候需要使用remove
                    if (baidu.isElement(e) && baidu.browser.ie < 7) {
                        e.removeAttribute(key);
                    } else {
                        delete e[ key ];
                    }
                    delete maps[ id ];
                }
                return id;
            break;
            case "decontrol" : 
                !(e = maps[id]) && obj_1 && ( object[ key ] = id = baidu.id() );
                id && delete maps[ id ];
                return id;
            break;
            default :
                if ( str_1 ) {
                    (e = maps[ id ]) && delete maps[ id ];
                    e && ( maps[ e[ key ] = command ] = e );
                } else if ( obj_1 ) {
                    id && delete maps[ id ];
                    maps[ object[ key ] = command ] = object;
                }
                return command;
            }
        }

        // 第一个参数不为空
        if ( obj_1 ) {
            !id && (maps[ object[ key ] = id = baidu.id() ] = object);
            return id;
        } else if ( str_1 ) {
            return maps[ object ];
        }

        return "TANGRAM__" + baidu._global_._._counter ++;
    };
}();

baidu.id.key = "tangram_guid";

//TODO: mz 20120827 在低版本IE做delete操作时直接 delete e[key] 可能出错，这里需要重新评估，重写




baidu.lang.Class = function() {
    this.guid = baidu.id( this );
};


baidu.lang.Class.prototype.dispose = function(){
    baidu.id( this.guid, "delete" );

    // this.__listeners && (for (var i in this.__listeners) delete this.__listeners[i]);

    for(var property in this){
        typeof this[property] != "function" && delete this[property];
    }
    this.disposed = true;   // 20100716
};


baidu.lang.Class.prototype.toString = function(){
    return "[object " + (this._type_ || this.__type || this._className || "Object") + "]";
};


 window["baiduInstance"] = function(guid) {
     return baidu.id( guid );
 }

//  2011.11.23  meizz   添加 baiduInstance 这个全局方法，可以快速地通过guid得到实例对象
//  2011.11.22  meizz   废除创建类时指定guid的模式，guid只作为只读属性
//  2011.11.22  meizz   废除 baidu.lang._instances 模块，由统一的global机制完成；

/// support magic - Tangram 1.x Code End

/// support magic - Tangram 1.x Code Start



/// support magic - Tangram 1.x Code Start






baidu.lang.guid = function() {
    return baidu.id();
};

//不直接使用window，可以提高3倍左右性能
//baidu.$$._counter = baidu.$$._counter || 1;


// 20111129    meizz    去除 _counter.toString(36) 这步运算，节约计算量
/// support magic - Tangram 1.x Code End





//baidu.lang.isString = function (source) {
//    return '[object String]' == Object.prototype.toString.call(source);
//};
baidu.lang.isString = baidu.isString;



baidu.lang.Event = function (type, target) {
    this.type = type;
    this.returnValue = true;
    this.target = target || null;
    this.currentTarget = null;
};
 

baidu.lang.Class.prototype.fire =
baidu.lang.Class.prototype.dispatchEvent = function (event, options) {
    baidu.lang.isString(event) && (event = new baidu.lang.Event(event));

    !this.__listeners && (this.__listeners = {});

    // 20100603 添加本方法的第二个参数，将 options extend到event中去传递
    options = options || {};
    for (var i in options) {
        event[i] = options[i];
    }

    var i, n, me = this, t = me.__listeners, p = event.type;
    event.target = event.target || (event.currentTarget = me);

    // 支持非 on 开头的事件名
    p.indexOf("on") && (p = "on" + p);

    typeof me[p] == "function" && me[p].apply(me, arguments);

    if (typeof t[p] == "object") {
        for (i=0, n=t[p].length; i<n; i++) {
            t[p][i] && t[p][i].apply(me, arguments);
        }
    }
    return event.returnValue;
};


baidu.lang.Class.prototype.on =
baidu.lang.Class.prototype.addEventListener = function (type, handler, key) {
    if (typeof handler != "function") {
        return;
    }

    !this.__listeners && (this.__listeners = {});

    var i, t = this.__listeners;

    type.indexOf("on") && (type = "on" + type);

    typeof t[type] != "object" && (t[type] = []);

    // 避免函数重复注册
    for (i = t[type].length - 1; i >= 0; i--) {
        if (t[type][i] === handler) return handler;
    };

    t[type].push(handler);

    // [TODO delete 2013] 2011.12.19 兼容老版本，2013删除此行
    key && typeof key == "string" && (t[type][key] = handler);

    return handler;
};

//  2011.12.19  meizz   很悲剧，第三个参数 key 还需要支持一段时间，以兼容老版本脚本
//  2011.11.24  meizz   事件添加监听方法 addEventListener 移除第三个参数 key，添加返回值 handler
//  2011.11.23  meizz   事件handler的存储对象由json改成array，以保证注册函数的执行顺序
//  2011.11.22  meizz   将 removeEventListener 方法分拆到 baidu.lang.Class.removeEventListener 中，以节约主程序代码

/// support magic - Tangram 1.x Code End




baidu.lang.createClass = function(constructor, options) {
    options = options || {};
    var superClass = options.superClass || baidu.lang.Class;

    // 创建新类的真构造器函数
    var fn = function(){
        var me = this;

        // 20101030 某类在添加该属性控制时，guid将不在全局instances里控制
        options.decontrolled && (me.__decontrolled = true);

        // 继承父类的构造器
        superClass.apply(me, arguments);

        // 全局配置
        for (i in fn.options) me[i] = fn.options[i];

        constructor.apply(me, arguments);

        for (var i=0, reg=fn["\x06r"]; reg && i<reg.length; i++) {
            reg[i].apply(me, arguments);
        }
    };

    // [TODO delete 2013] 放置全局配置，这个全局配置可以直接写到类里面
    fn.options = options.options || {};

    var C = function(){},
        cp = constructor.prototype;
    C.prototype = superClass.prototype;

    // 继承父类的原型（prototype)链
    var fp = fn.prototype = new C();

    // 继承传参进来的构造器的 prototype 不会丢
    for (var i in cp) fp[i] = cp[i];

    // 20111122 原className参数改名为type
    var type = options.className || options.type;
    typeof type == "string" && (fp.__type = type);

    // 修正这种继承方式带来的 constructor 混乱的问题
    fp.constructor = cp.constructor;

    // 给类扩展出一个静态方法，以代替 baidu.object.extend()
    fn.extend = function(json){
        for (var i in json) {
            fn.prototype[i] = json[i];
        }
        return fn;  // 这个静态方法也返回类对象本身
    };

    return fn;
};

// 20111221 meizz   修改插件函数的存放地，重新放回类构造器静态属性上

/// support magic - Tangram 1.x Code End









baidu.createChain = function(chainName, fn, constructor) {
    // 创建一个内部类名
    var className = chainName=="dom"?"$DOM":"$"+chainName.charAt(0).toUpperCase()+chainName.substr(1);
    var slice = Array.prototype.slice;

    // 构建链头执行方法
    var chain = baidu[chainName] = baidu[chainName] || fn || function(object) {
        return baidu.extend(object, baidu[chainName].fn);
    };

    // 扩展 .extend 静态方法，通过本方法给链头对象添加原型方法
    chain.extend = function(extended) {
        var method;

        // 直接构建静态接口方法，如 baidu.array.each() 指向到 baidu.array().each()
        for (method in extended) {
            chain[method] = function() {
                var id = arguments[0];

                // 在新版接口中，ID选择器必须用 # 开头
                chainName=="dom" && baidu.type(id)=="string" && (id = "#"+ id);

                var object = chain(id);
                var result = object[method].apply(object, slice.call(arguments, 1));

                // 老版接口返回实体对象 getFirst
                return baidu.type(result) == "$DOM" ? result.get(0) : result;
            }
        }
        return baidu.extend(baidu[chainName].fn, extended);
    };

    // 创建 链头对象 构造器
    baidu[chainName][className] = baidu[chainName][className] || constructor || function() {};

    // 给 链头对象 原型链做一个短名映射
    chain.fn = baidu[chainName][className].prototype;

    return chain;
};


baidu.overwrite = function(Class, list, fn) {
    for (var i = list.length - 1; i > -1; i--) {
        Class.prototype[list[i]] = fn(list[i]);
    }

    return Class;
};





baidu.createChain("array", function(array){
    var pro = baidu.array.$Array.prototype
        ,ap = Array.prototype
        ,key;

    baidu.type( array ) != "array" && ( array = [] );

    for ( key in pro ) {
        ap[key] || (array[key] = pro[key]);
    }

    return array;
});

// 对系统方法新产生的 array 对象注入自定义方法，支持完美的链式语法
baidu.overwrite(baidu.array.$Array, "concat slice".split(" "), function(key) {
    return function() {
        return baidu.array( Array.prototype[key].apply(this, arguments) );
    }
});








baidu.array.extend({
    indexOf : function (match, fromIndex) {
        baidu.check(".+(,number)?","baidu.array.indexOf");
        var len = this.length;

        // 小于 0
        (fromIndex = fromIndex | 0) < 0 && (fromIndex = Math.max(0, len + fromIndex));

        for ( ; fromIndex < len; fromIndex++) {
            if(fromIndex in this && this[fromIndex] === match) {
                return fromIndex;
            }
        }
        
        return -1;
    }
});







baidu.merge = function(first, second) {
    var i = first.length,
        j = 0;

    if ( typeof second.length === "number" ) {
        for ( var l = second.length; j < l; j++ ) {
            first[ i++ ] = second[ j ];
        }

    } else {
        while ( second[j] !== undefined ) {
            first[ i++ ] = second[ j++ ];
        }
    }

    first.length = i;

    return first;
};











baidu.array.extend({
    unique : function (fn) {
        var len = this.length,
            result = this.slice(0),
            i, datum;
            
        if ('function' != typeof fn) {
            fn = function (item1, item2) {
                return item1 === item2;
            };
        }
        
        // 从后往前双重循环比较
        // 如果两个元素相同，删除后一个
        while (--len > 0) {
            datum = result[len];
            i = len;
            while (i--) {
                if (fn(datum, result[i])) {
                    result.splice(len, 1);
                    break;
                }
            }
        }

        len = this.length = result.length;
        for ( i=0; i<len; i++ ) {
            this[ i ] = result[ i ];
        }

        return this;
    }
});




baidu.query = baidu.query || (function(){
    var rId = /^(\w*)#([\w\-\$]+)$/,
        rId0= /^#([\w\-\$]+)$/
        rTag = /^\w+$/,
        rClass = /^(\w*)\.([\w\-\$]+)$/,
        rComboClass = /^(\.[\w\-\$]+)+$/;
        rDivider = /\s*,\s*/,
        rSpace = /\s+/g,
        slice = Array.prototype.slice;

    // selector: #id, .className, tagName, *
    function query(selector, context) {
        var t, x, id, dom, tagName, className, arr, list, array = [];

        // tag#id
        if (rId.test(selector)) {
            id = RegExp.$2;
            tagName = RegExp.$1 || "*";

            // 本段代码效率很差，不过极少流程会走到这段
            baidu.forEach(context.getElementsByTagName(tagName), function(dom) {
                dom.id == id && array.push(dom);
            });

        // tagName or *
        } else if (rTag.test(selector) || selector == "*") {
            baidu.merge(array, context.getElementsByTagName(selector));

        // .className
        } else if (rClass.test(selector)) {
            arr = [];
            tagName = RegExp.$1;
            className = RegExp.$2;
            t = " " + className + " ";
            // bug: className: .a.b

            if (context.getElementsByClassName) {
                arr = context.getElementsByClassName(className);
            } else {
                baidu.forEach(context.getElementsByTagName("*"), function(dom) {
                    dom.className && (" " + dom.className + " ").indexOf(t) > -1 && (arr.push(dom));
                });
            }

            if (tagName && (tagName = tagName.toUpperCase())) {
                baidu.forEach(arr, function(dom) {
                    dom.tagName.toUpperCase() === tagName && array.push(dom);
                });
            } else {
                baidu.merge(array, arr);
            }
        
        // IE 6 7 8 里组合样式名(.a.b)
        } else if (rComboClass.test(selector)) {
            list = selector.substr(1).split(".");

            baidu.forEach(context.getElementsByTagName("*"), function(dom) {
                if (dom.className) {
                    t = " " + dom.className + " ";
                    x = true;

                    baidu.forEach(list, function(item){
                        t.indexOf(" "+ item +" ") == -1 && (x = false);
                    });

                    x && array.push(dom);
                }
            });
        }

        return array;
    }

    // selector 还可以是上述四种情况的组合，以空格分隔
    // @return ArrayLike
    function queryCombo(selector, context) {
        var a, s = selector, id = "__tangram__", array = [];

        // 在 #id 且没有 context 时取 getSingle，其它时 getAll
        if (!context && rId0.test(s) && (a=document.getElementById(s.substr(1)))) {
            return [a];
        }

        context = context || document;

        // 用 querySelectorAll 时若取 #id 这种唯一值时会多选
        if (context.querySelectorAll) {
            // 在使用 querySelectorAll 时，若 context 无id将貌似 document 而出错
            if (context.nodeType == 1 && !context.id) {
                context.id = id;
                a = context.querySelectorAll("#" + id + " " + s);
                context.id = "";
            } else {
                a = context.querySelectorAll(s);
            }
            return a;
        } else {
            if (s.indexOf(" ") == -1) {
                return query(s, context);
            }

            baidu.forEach(query(s.substr(0, s.indexOf(" ")), context), function(dom) { // 递归
                baidu.merge(array, queryCombo(s.substr(s.indexOf(" ") + 1), dom));
            });
        }

        return array;
    }

    return function(selector, context, results) {
        if (!selector || typeof selector != "string") {
            return results || [];
        }

        var arr = [];
        selector = selector.replace(rSpace, " ");
        results && baidu.merge(arr, results) && (results.length = 0);

        baidu.forEach(selector.indexOf(",") > 0 ? selector.split(rDivider) : [selector], function(item) {
            baidu.merge(arr, queryCombo(item, context));
        });

        return baidu.merge(results || [], baidu.array(arr).unique());
    };
})();














baidu.createChain("dom",

// method function


function(selector, context) {
    var e, me = new baidu.dom.$DOM(context);

    // Handle $(""), $(null), or $(undefined)
    if (!selector) {
        return me;
    }

    // Handle $($DOM)
    if (selector._type_ == "$DOM") {
        return selector;

    // Handle $(DOMElement)
    } else if (selector.nodeType || selector == selector.window) {
        me[0] = selector;
        me.length = 1;
        return me;

    // Handle $(Array) or $(Collection) or $(NodeList)
    } else if (selector.length && me.toString.call(selector) != "[object String]") {
        return baidu.merge(me, selector);

    } else if (typeof selector == "string") {
        // HTMLString
        if (selector.charAt(0) == "<" && selector.charAt(selector.length - 1) == ">" && selector.length > 2) {
            if ( baidu.dom.createElements ) {
                baidu.merge( me, baidu.dom.createElements( selector ) );
            }

        // baidu.query
        } else {
            baidu.query(selector, context, me);
        }
    
    // document.ready
    } else if (typeof selector == "function") {
        return me.ready ? me.ready(selector) : me;
    }

    return me;
},

// constructor
function(context) {
    this.length = 0;
    this._type_ = "$DOM";
    this.context = context || document;
}

).extend({


    
    size: function() {
        return this.length;
    }

    ,splice : function(){}

    
    ,
    get: function(index) {

        if ( typeof index == "number" ) {
            return index < 0 ? this[this.length + index] : this[index];
        }

        return Array.prototype.slice.call(this, 0);
    }

    ,toArray: function(){
        return this.get();
    }

});





baidu.dom.extend({
    removeClass: function(value){
        if(arguments.length <= 0 ){
            baidu.forEach(this, function(item){
                item.className = '';
            });
        };
        switch(typeof value){
            case 'string':
                //对输入进行处理
                value = String(value).replace(/^\s+/g,'').replace(/\s+$/g,'').replace(/\s+/g,' ');
                var arr = value.split(' ');
                baidu.forEach(this, function(item){
                    var str = item.className ;
                    for(var i = 0;i<arr.length;i++){
                        while((' '+str+' ').indexOf(' '+arr[i]+' ') >= 0){
                           str = (' '+str+' ').replace(' '+arr[i]+' ',' ');
                        };
                    };
                    item.className = str.replace(/^\s+/g,'').replace(/\s+$/g,'');
                });
            break;
            case 'function':
                baidu.forEach(this, function(item, index ,className){
                    baidu.dom(item).removeClass(value.call(item, index, item.className));
                });
            break;
        };

        return this;
    }
});





baidu.dom.extend({
    addClass: function(value){
        
        //异常处理
        if(arguments.length <= 0 ){
            return this;
        };

        switch(typeof value){
            case 'string':

                //对输入进行处理
                value = value.replace(/^\s+/g,'').replace(/\s+$/g,'').replace(/\s+/g,' ');
                
                var arr = value.split(' ');
                baidu.forEach(this, function(item, index){
                    var str = '';
                    if(item.className){
                        str = item.className;
                    };
                    for(var i = 0; i<arr.length; i++){
                        if((' '+str+' ').indexOf(' '+arr[i]+' ') == -1){
                            str += (' '+arr[i]);
                        };
                    };
                    item.className = str.replace(/^\s+/g,'') ;
                });

            break;
            case 'function':
                baidu.forEach(this, function(item, index){
                    baidu.dom(item).addClass(value.call(item, index, item.className));
                });

            break;
        };

        return this;
    }
});




 
baidu.dom.extend({
    contains : function(contained) {
        contained = baidu.dom(contained);
        if(this.size() <= 0
            || contained.size() <= 0){
            return false;
        }
        var container = this[0];
        contained = contained[0];
        //fixme: 无法处理文本节点的情况(IE)
        return container.contains
            ? container != contained && container.contains(contained)
            : !!(container.compareDocumentPosition(contained) & 16);
    }    
});
/// Tangram 1.x Code Start
/// Tangram 1.x Code Start




baidu.dom._g = function(id){
    return baidu.type(id) === 'string' ? document.getElementById(id) : id;
}
/// Tangram 1.x Code End

baidu.dom.contains = function (container, contained) {
    var g = baidu.dom._g;
    container = g(container);
    contained = g(contained);

    //fixme: 无法处理文本节点的情况(IE)
    return container.contains
        ? container != contained && container.contains(contained)
        : !!(container.compareDocumentPosition(contained) & 16);
};
/// Tangram 1.x Code End







//baidu.browser.opera = /opera(\/| )(\d+(\.\d+)?)(.+?(version\/(\d+(\.\d+)?)))?/i.test(navigator.userAgent) ?  + ( RegExp["\x246"] || RegExp["\x242"] ) : undefined;







baidu.dom.extend({
    insertHTML: function ( position, html) {
        element = this[0];
        var range,begin;
    
        //在opera中insertAdjacentHTML方法实现不标准，如果DOMNodeInserted方法被监听则无法一次插入多element
        //by lixiaopeng @ 2011-8-19
        if (element.insertAdjacentHTML && !baidu.browser.opera) {
            element.insertAdjacentHTML(position, html);
        } else {
            // 这里不做"undefined" != typeof(HTMLElement) && !window.opera判断，其它浏览器将出错？！
            // 但是其实做了判断，其它浏览器下等于这个函数就不能执行了
            range = element.ownerDocument.createRange();
            // FF下range的位置设置错误可能导致创建出来的fragment在插入dom树之后html结构乱掉
            // 改用range.insertNode来插入html, by wenyuxiang @ 2010-12-14.
            position = position.toUpperCase();
            if (position == 'AFTERBEGIN' || position == 'BEFOREEND') {
                range.selectNodeContents(element);
                range.collapse(position == 'AFTERBEGIN');
            } else {
                begin = position == 'BEFOREBEGIN';
                range[begin ? 'setStartBefore' : 'setEndAfter'](element);
                range.collapse(begin);
            }
            range.insertNode(range.createContextualFragment(html));
        }
        return element;
    }
});







baidu.createChain('string',
    // 执行方法
    function(string){
        var type = baidu.type(string),
            str = new String(~'string|number'.indexOf(type) ? string : type),
            pro = String.prototype;
        baidu.forEach(baidu.string.$String.prototype, function(fn, key) {
            pro[key] || (str[key] = fn);
        });
        return str;
    }
);








//format(a,a,d,f,c,d,g,c);
baidu.string.extend({
    format : function (opts) {
        var source = this.valueOf(),
            data = Array.prototype.slice.call(arguments,0), toString = Object.prototype.toString;
        if(data.length){
            data = data.length == 1 ? 
                
                (opts !== null && (/\[object Array\]|\[object Object\]/.test(toString.call(opts))) ? opts : data) 
                : data;
            return source.replace(/#\{(.+?)\}/g, function (match, key){
                var replacer = data[key];
                // chrome 下 typeof /a/ == 'function'
                if('[object Function]' == toString.call(replacer)){
                    replacer = replacer(key);
                }
                return ('undefined' == typeof replacer ? '' : replacer);
            });
        }
        return source;
    }
});



baidu.object = baidu.object || {};




//baidu.object.extend = function (target, source) {
//    for (var p in source) {
//        if (source.hasOwnProperty(p)) {
//            target[p] = source[p];
//        }
//    }
//    
//    return target;
//};
baidu.object.extend = baidu.extend;

/// support magic - Tangram 1.x Code Start

/// support magic - Tangram 1.x Code Start

/// support magic - Tangram 1.x Code Start



baidu.i18n = baidu.i18n || {};
/// support magic - Tangram 1.x Code End

baidu.i18n.cultures = baidu.i18n.cultures || {};
/// support magic - Tangram 1.x Code End



baidu.i18n.cultures['zh-CN'] = baidu.object.extend(baidu.i18n.cultures['zh-CN'] || {}, {
    calendar: {
        dateFormat: 'yyyy-MM-dd',
        titleNames: '#{yyyy}年&nbsp;#{MM}月',
        monthNames: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'],
        monthNamesShort: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        dayNames: {mon: '一', tue: '二', wed: '三', thu: '四', fri: '五', sat: '六', sun: '日'}
    },
    
    timeZone: 8,
    whitespace: new RegExp("(^[\\s\\t\\xa0\\u3000]+)|([\\u3000\\xa0\\s\\t]+\x24)", "g"),
    
    number: {
        group: ",",
        groupLength: 3,
        decimal: ".",
        positive: "",
        negative: "-",

        _format: function(number, isNegative){
            return baidu.i18n.number._format(number, {
                group: this.group,
                groupLength: this.groupLength,
                decimal: this.decimal,
                symbol: isNegative ? this.negative : this.positive 
            });
        }
    },

    currency: {
        symbol: '￥'  
    },

    language: {
        ok: '确定',
        cancel: '取消',
        signin: '注册',
        signup: '登录'
    }
});

baidu.i18n.currentLocale = 'zh-CN';
/// support magic - Tangram 1.x Code End

/// support magic - Tangram 1.x Code Start




baidu.i18n.date = baidu.i18n.date || {

    
    getDaysInMonth: function(year, month) {
        var days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        if (month == 1 && baidu.i18n.date.isLeapYear(year)) {
            return 29;
        }
        return days[month];
    },

    
    isLeapYear: function(year) {
        return !(year % 400) || (!(year % 4) && !!(year % 100));
    },

    
    toLocaleDate: function(dateObject, sLocale, tLocale) {
        return this._basicDate(dateObject, sLocale, tLocale || baidu.i18n.currentLocale);
    },

    
    _basicDate: function(dateObject, sLocale, tLocale) {
        var tTimeZone = baidu.i18n.cultures[tLocale || baidu.i18n.currentLocale].timeZone,
            tTimeOffset = tTimeZone * 60,
            sTimeZone,sTimeOffset,
            millisecond = dateObject.getTime();

        if(sLocale){
            sTimeZone = baidu.i18n.cultures[sLocale].timeZone;
            sTimeOffset = sTimeZone * 60;
        }else{
            sTimeOffset = -1 * dateObject.getTimezoneOffset();
            sTimeZone = sTimeOffset / 60;
        }

        return new Date(sTimeZone != tTimeZone ? (millisecond  + (tTimeOffset - sTimeOffset) * 60000) : millisecond);
    },

    
    format: function(dateObject, tLocale) {
        // 拿到对应locale的format类型配置
        var c = baidu.i18n.cultrues[tLocale || baidu.i18n.currentLocale];
        return baidu.date.format(
            baidu.i18n.date.toLocaleDate(dateObject, "", tLocale),
            c.calendar.dateFormat);
    }
};
/// support magic -  Tangram 1.x Code End




baidu.date = baidu.date || {};





baidu.createChain('number', function(number){
    var nan = parseFloat(number),
        val = isNaN(nan) ? nan : number;
        clazz = typeof val === 'number' ? Number : String,
        pro = clazz.prototype;
    val = new clazz(val);
    baidu.forEach(baidu.number.$Number.prototype, function(value, key){
        pro[key] || (val[key] = value);
    });
    return val;
});








baidu.number.extend({
    pad : function (length) {
        var source = this;
        var pre = "",
            negative = (source < 0),
            string = String(Math.abs(source));
    
        if (string.length < length) {
            pre = (new Array(length - string.length + 1)).join('0');
        }
    
        return (negative ?  "-" : "") + pre + string;
    }
});





baidu.date.format = function (source, pattern) {
    if ('string' != typeof pattern) {
        return source.toString();
    }

    function replacer(patternPart, result) {
        pattern = pattern.replace(patternPart, result);
    }
    
    var pad     = baidu.number.pad,
        year    = source.getFullYear(),
        month   = source.getMonth() + 1,
        date2   = source.getDate(),
        hours   = source.getHours(),
        minutes = source.getMinutes(),
        seconds = source.getSeconds();

    replacer(/yyyy/g, pad(year, 4));
    replacer(/yy/g, pad(parseInt(year.toString().slice(2), 10), 2));
    replacer(/MM/g, pad(month, 2));
    replacer(/M/g, month);
    replacer(/dd/g, pad(date2, 2));
    replacer(/d/g, date2);

    replacer(/HH/g, pad(hours, 2));
    replacer(/H/g, hours);
    replacer(/hh/g, pad(hours % 12, 2));
    replacer(/h/g, hours % 12);
    replacer(/mm/g, pad(minutes, 2));
    replacer(/m/g, minutes);
    replacer(/ss/g, pad(seconds, 2));
    replacer(/s/g, seconds);

    return pattern;
};





























































baidu.createChain("event",

// 执行方法
function(){
    var lastEvt = {};
    return function( event, json ){
        switch( baidu.type( event ) ){
            // event
            case "object":
                return lastEvt.originalEvent === event ? lastEvt : ( lastEvt = new baidu.event.$Event( event ) );

            case "$Event":
                return event;

            // event type
            case "string" :
                var e = new baidu.event.$Event( event );
                typeof json == "object" && baidu.forEach( e, json );
                return e;
        }
    }
}(),

// constructor
function( event ){
    var e, t, f;
    var me = this;

    this._type_ = "$Event";

    if( typeof event == "object" && event.type ){
        me.originalEvent = e = event;

        baidu.forEach( "altKey bubbles button buttons cancelable clientX clientY ctrlKey commandKey currentTarget fromElement metaKey screenX screenY shiftKey toElement type view which triggerData".split(" "), function(item){
            me[ item ] = e[ item ];
        });

        me.target = me.srcElement = e.srcElement || (( t = e.target ) && ( t.nodeType == 3 ? t.parentNode : t ));
        me.relatedTarget = e.relatedTarget || (( t = e.fromElement ) && (t === me.target ? e.toElement : t ));

        me.keyCode = me.which = e.keyCode || e.which;

        // Add which for click: 1 === left; 2 === middle; 3 === right
        if( !me.which && e.button !== undefined )
            me.which = e.button & 1 ? 1 : ( e.button & 2 ? 3 : ( e.button & 4 ? 2 : 0 ) );

        var doc = document.documentElement, body = document.body;

        me.pageX = e.pageX || (e.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0));
        me.pageY = e.pageY || (e.clientY + (doc && doc.scrollTop  || body && body.scrollTop  || 0) - (doc && doc.clientTop  || body && body.clientTop  || 0));

        me.data;
    }

    // event.type
    typeof event == "string" && ( this.type = event );

    // event.timeStamp
    this.timeStamp = new Date().getTime();
}

// 扩展两个常用方法
).extend({
    // 阻止事件冒泡
    stopPropagation : function() {
        var e = this.originalEvent;

        e && (e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true);
    }

    // 阻止事件默认行为
    ,preventDefault : function() {
        var e = this.originalEvent;

        e && (e.preventDefault ? e.preventDefault() : e.returnValue = false);
    }
});







baidu.dom.extend({
    each : function (iterator) {
        baidu.check("function", "baidu.dom.each");
        var i, result,
            n = this.length;

        for (i=0; i<n; i++) {
            result = iterator.call( this[i], i, this[i], this );

            if ( result === false || result == "break" ) { break;}
        }

        return this;
    }
});







baidu._util_ = baidu._util_ || {};














baidu.dom.match = function(){
    var reg = /^[\w\#\-\$\.\*]+$/,

        // 使用这个临时的 div 作为CSS选择器过滤
        div = document.createElement("DIV");
        div.id = "__tangram__";

    return function( array, selector, context ){
        var root, results = baidu.array();

        switch ( baidu.type(selector) ) {
            // 取两个 TangramDom 的交集
            case "$DOM" :
                for (var x=array.length-1; x>-1; x--) {
                    for (var y=selector.length-1; y>-1; y--) {
                        array[x] === selector[y] && results.push(array[x]);
                    }
                }
                break;

            // 使用过滤器函数，函数返回值是 Array
            case "function" :
                baidu.forEach(array, function(item, index){
                    selector.call(item, index) && results.push(item);
                });
                break;
            
            case "HTMLElement" :
                baidu.forEach(array, function(item){
                    item == selector && results.push(item);
                });
                break;

            // CSS 选择器
            case "string" :
                var da = baidu.query(selector, context || document);
                baidu.forEach(array, function(item){
                    if ( root = getRoot(item) ) {
                        var t = root.nodeType == 1
                            // in DocumentFragment
                            ? baidu.query(selector, root)
                            : da;

                        for (var i=0, n=t.length; i<n; i++) {
                            if (t[i] === item) {
                                results.push(item);
                                break;
                            }
                        }
                    }
                });
                results = results.unique();
                break;

            default :
                results = baidu.array( array ).unique();
                break;
        }
        return results;

    };

    function getRoot(dom) {
        var result = [], i;

        while(dom = dom.parentNode) {
            dom.nodeType && result.push(dom);
        }

        for (var i=result.length - 1; i>-1; i--) {
            // 1. in DocumentFragment
            // 9. Document
            if (result[i].nodeType == 1 || result[i].nodeType == 9) {
                return result[i];
            }
        }
        return null;
    }
}();




baidu.dom.extend({
    is : function (selector) {
        return baidu.dom.match(this, selector).length > 0;
    }
});






baidu.dom.extend({
    triggerHandler: function(type, triggerData){
        var eb = baidu._util_.eventBase;

        baidu.forEach(this, function(item){
            eb.fireHandler(item, type, triggerData);
        });

        return this;
    }
});









baidu.dom.extend({
    closest : function (selector, context) {
        var results = baidu.array();

        baidu.forEach ( this, function(dom) {
            var t = [dom];
            while ( dom = dom.parentNode ) {
                dom.nodeType && t.push( dom );
            }
            t = baidu.dom.match( t, selector, context );

            t.length && results.push(t[0]);
        });
        
        return baidu.dom( results.unique() );
    }
});


baidu._util_.eventBase = function(){
    var eventsCache = {
        
    };

    var proxyCache = {
        
    };

    var ae = 

    window.addEventListener ? 
    function( target, name, fn ){
        target.addEventListener( name, fn, false );
    } : 

    window.attachEvent ?
    function( target, name, fn ){
        target.attachEvent( "on" + name, fn );
    } :

    function(){};

    var proxy = function( target, name, fnAry ){
        var id = baidu.id( target );
        var c = proxyCache[ id ] = proxyCache[ id ] || {};
        if( c[ name ] )
            return;
        c[ name ] = 1;

        var call = function( e ){
            var args = Array.prototype.slice.call( arguments, 1 );
                args.unshift( e = baidu.event( e )  );            
            
            if( !e.currentTarget )
                e.currentTarget = target;

            for(var i = 0, l = fnAry.length; i < l; i += 2)
                fnAry[i].apply( this, args );
        };

        ae( target, name, call );
    };

    var addEvent = function( target, name, fn, selector, data ){
        var call = function( e ){
            var t = baidu.dom( e.target ), args = arguments;
            if( data && !e.data ) 
                e.data = data;
            if( e.triggerData ) 
                [].push.apply( args, e.triggerData );
            if( !proxyEl )
                return e.result = fn.apply( target, args );

            var found = false;

            var callWithProxyEl = function(){
                for(var i = 0, l = proxyEl.length; i < l; i ++)
                    if(proxyEl.get(i).contains( e.target ))
                        return found = true, e.result = fn.apply( proxyEl[i], args );
            };

            for(var i = 0, r; i < 2; i ++){
                r = callWithProxyEl();
                if(found)
                    return r;
                buildProxyEl();
            }
        };

        var tangId = baidu.id( target );
        var c = eventsCache[ tangId ] || ( eventsCache[ tangId ] = {});
        var eventArray = c[ name ] || ( c[ name ] = [] );

        eventArray.push( call, fn );
        proxy( target, name, eventArray );

        var proxyEl = null;

        var buildProxyEl = function(){
            proxyEl = baidu.dom( selector, target );  
        };

        if(selector)
            buildProxyEl();

        return call;
    };

    var removeEvent = function( target, name, fn, selector ){
        var tangId;
        if( !( tangId = baidu.id( target, "get" ) ) ) 
            return ;
        
        var c = eventsCache[ tangId ] || ( eventsCache[tangId] = {});

        //fix _getEventsLength bug
        var fix_event = {
            'mouseenter':'mouseover',
            'mouseleave':'mouseout',
            'focusin':'focus',
            'focusout':'blur'
        };
        
        var eventArray = c[ name ] || ( c[ name ] = [] ) ;
        if(fix_event[ name ]) {
            c[ fix_event[ name ] ] = [];
        }

        for( var i = eventArray.length - 1, f; i >= 0; i-- )
            if( f = eventArray[i], f === fn )
                eventArray.splice( i - 1, 2 );
    };

    var removeAllEvent = function( target, name ){
        var tangId;
        if( !( tangId = baidu.id( target, "get" ) ) )
            return ;

        var c = eventsCache[tangId] || ( eventsCache[tangId] = {} );

        var remove = function( name ){
            var eventArray = c[ name ] || ( c[ name ] = [] );
            for ( var i = eventArray.length - 1, fn; i >= 0; i -= 2 ) 
                fn = eventArray[i],
                removeEvent( target, name, fn );
        };

        if( name )
            remove( name );
        else for( var name in c ) 
            remove( name );
    };

    var fireHandler = function( target, name, triggerData ){
        var tangId;
        if( !( tangId = baidu.id( target, "get" ) ) )
            return ;

        var c = eventsCache[tangId] || ( eventsCache[tangId] = {} );
        var eventArray = c[name] || ( c[name] = [] );
        var event = baidu.event({ type: name });
        var args = [ event ];

        if( triggerData )
            event.triggerData = triggerData,
            args.push.apply( args, triggerData );

        for( var i = 0, l = eventArray.length; i < l; i += 2 ) 
            eventArray[i].apply( this, args );
    };

    var getHandler = function( target ){
        var tangId;
        if( !( tangId = baidu.id( target, "get" ) ) ) 
            return ;
        
        var c = eventsCache[tangId] || ( eventsCache[tangId] = {} );
        var ret = {}, arr;

        for( var event in c ){
            arr = ret[ event ] = [];
            ce = c[ event ];
            for( var i = 1, l = ce.length; i < l; i += 2 ) 
                arr.push( ce[i] );
        }

        return ret;
    };

    var special = function( name )  {
        switch ( name )  {
            case "focusin":
            case "focusout":
                if ( !/firefox/i.test( navigator.userAgent ) ) 
                    return false;

                var object = {},
                    fixName = name == "focusin" ? "focus" : "blur";

                object[name] = function( data, fn ){
                    if( typeof data == "function" )
                        fn = data, 
                        data = null;

                    var me = this;

                    if( !fn ){
                        return this.triggerHandler( name, data );
                    }else{
                        var call = function(){
                            me.triggerHandler( name );
                        };

                        baidu.forEach( this, function( item ){
                            baidu( "textarea,select,input,button,a", item ).on( fixName, call );
                        });

                        return this._on( name, data, fn ), this;
                    }
                };

                return baidu.dom.extend( object ), true;

            case "mouseenter":
            case "mouseleave":
                if( /msie/i.test( navigator.userAgent ) )
                    return false;

                var object = {},
                    fixName = name == "mouseenter" ? "mouseover" : "mouseout";

                var contains = baidu.dom.contains;

                object[name] = function( data, fn ){

                    if( arguments.length == 0 )
                        return this.trigger( name );

                    if( typeof data == "function" )
                        fn = data,
                        data = null;

                    var me = this;
                    var call = function( event ){
                        related = event.relatedTarget;
                        if( !related || (related !== this && !contains( this, related )) )
                            me.triggerHandler( name );
                    };

                    baidu.forEach( this, function( item ){
                        this.on( fixName, call );
                    }, this );

                    return this._on( name, data, fn ), this;
                };

                return baidu.dom.extend( object ), true;
        }
        
        return false;
    };

    return {
        add: function( dom, event, fn, selector, data ){
            return addEvent( dom, event, fn, selector, data );
        },

        get: function( dom ){
            return getHandler( dom );
        },

        remove: function( dom, event, fn, selector ){
            var id;
            if( ( id = baidu.id( dom, "get" ) ) && fn && fn[ "_" + id + "_" + event ] )
                fn = fn[ "_" + id + "_" + event ],
                delete fn[ "_" + id + "_" + event ];

            if( typeof fn == "function" )
                return removeEvent( dom, event, fn, selector );
            else
                return removeAllEvent( dom, event, selector );
        },

        removeAll: function( dom ){
            return removeAllEvent( dom );
        },

        fireHandler: function( dom, event, triggerData ){
            return fireHandler( dom, event, triggerData );
        },

        method: function( name ){
            if( arguments.length > 1 ){
                for( var i = 0, l = arguments.length; i < l; i ++ ) 
                    this.method( arguments[i] );
                return this;
            }

            if( !special( name ) ){
                var object = {};

                object[ name ] = function( data, fn ){

                    if( arguments.length == 0 )
                        return this.trigger( name );
                    else{
                        if( typeof data == "function" )
                            fn = data,
                            data = null;
                        return this._on( name, data, fn );
                    }
                };

                baidu.dom.extend( object );
            }
        },
        
        _getEventsLength: function( tang, evtName ){
            var len = 0, item;
            if( tang ){
                item = eventsCache[ baidu.id( tang[0] || tang, "get" ) ];
                if( evtName )
                    item[ evtName ] && ( len = item[ evtName ].length );
                else for( var i in item )
                    len += item[ i ].length;
            }else for( var i in eventsCache ){
                item = eventsCache[ i ];
                for( var j in item )
                    len += item[ j ].length;
            }

            return len / 2;
        }
    }
}();

baidu._util_.eventBase.method(





"blur",





"change",





 "click",





"dblclick",





"error",





"focus", 





"focusin",





"focusout",





"keydown", 





"keypress", 





"keyup",





 "mousedown",





"mouseenter", 





"mouseleave", 





"mousemove", 





"mouseout",





"mouseover",





"mouseup", 





"resize",





 "scroll", 





"select", 





"submit", 





"load",





"unload",





"contextmenu" );







baidu.dom.extend({
    on: function( events, selector, data, fn ){
        var eb = baidu._util_.eventBase;
        var specials = { mouseenter: 1, mouseleave: 1, focusin: 1, focusout: 1 };

        if( typeof selector == "object" && selector )
            fn = data,
            data = selector,
            selector = null;
        else if( typeof data == "function" )
            fn = data,
            data = null;
        else if( typeof selector == "function" )
            fn = selector,
            selector = data = null;

        if( typeof events == "string" ){
            events = events.split(/[ ,]+/);
            this.each(function(){
                baidu.forEach(events, function( event ){
                    if( specials[ event ] )
                        baidu( this )[ event ]( data, fn );
                    else
                        eb.add( this, event, fn, selector, data );
                }, this);
            });
        }else if( typeof events == "object" ){
            if( fn )
                fn = null;
            baidu.forEach(events, function( fn, eventName ){
                this.on( eventName, selector, data, fn );
            }, this);
        }

        return this;
    },

    _on: function( name, data, fn ){
        var eb = baidu._util_.eventBase;
        this.each(function(){
            eb.add( this, name, fn, undefined, data );
        });
        return this;
    }
});

/// support - magic Tangram 1.x Code Start
/// support magic - Tangram 1.x Code Start






baidu.dom.g = function(id) {
    if (!id) return null; //修改IE下baidu.dom.g(baidu.dom.g('dose_not_exist_id'))报错的bug，by Meizz, dengping
    if ('string' == typeof id || id instanceof String) {
        return document.getElementById(id);
    } else if (id.nodeName && (id.nodeType == 1 || id.nodeType == 9)) {
        return id;
    }
    return null;
};

/// support magic - Tangram 1.x Code End

baidu.event.on = baidu.on = function(element, evtName, handler){
    element = baidu.dom.g(element);
    baidu.dom(element).on(evtName.replace(/^\s*on/, ''), handler);
    return element;
};
/// support - magic Tangram 1.x Code End









baidu.dom.extend({
    off: function( events, selector, fn ){
        var eb = baidu._util_.eventBase, me = this;
        if( !events )
            baidu.forEach( this, function( item ){
                eb.removeAll( item );
            } );
        else if( typeof events == "string" ){
            if( typeof selector == "function" )
                fn = selector,
                selector = null;
            events = events.split(/[ ,]/);
            baidu.forEach( this, function( item ){
                baidu.forEach( events, function( event ){
                    eb.remove( item, event, fn, selector );
                });
            });
        }else if( typeof events == "object" )
            baidu.forEach( events, function(fn, event){
                me.off( event, selector, fn );
            } );

        return this;
    }
});

/// support - magic Tangram 1.x Code Start

baidu.event.un = baidu.un = function(element, evtName, handler){
    element = baidu.dom.g(element);
    baidu.dom(element).off(evtName.replace(/^\s*on/, ''), handler);
    return element;
 };
 /// support - magic Tangram 1.x Code End


if(typeof magic != "function"){
    var magic = function(){
        // TODO: 
    };
}

magic.resourcePath = "";
magic.skinName = "default";
magic.version = "1.0.2.0";

/msie 6/i.test(navigator.userAgent) && 
document.execCommand("BackgroundImageCache", false, true);



/// support magic - Tangram 1.x Code Start





baidu.lang.inherits = function (subClass, superClass, type) {
    var key, proto, 
        selfProps = subClass.prototype, 
        clazz = new Function();
        
    clazz.prototype = superClass.prototype;
    proto = subClass.prototype = new clazz();

    for (key in selfProps) {
        proto[key] = selfProps[key];
    }
    subClass.prototype.constructor = subClass;
    subClass.superClass = superClass.prototype;

    // 类名标识，兼容Class的toString，基本没用
    typeof type == "string" && (proto.__type = type);

    subClass.extend = function(json) {
        for (var i in json) proto[i] = json[i];
        return subClass;
    }
    
    return subClass;
};

//  2011.11.22  meizz   为类添加了一个静态方法extend()，方便代码书写
/// support magic - Tangram 1.x Code End


/// support magic - Tangram 1.x Code Start




 

baidu.lang.Class.prototype.un =
baidu.lang.Class.prototype.removeEventListener = function (type, handler) {
    var i,
        t = this.__listeners;
    if (!t) return;

    // remove all event listener
    if (typeof type == "undefined") {
        for (i in t) {
            delete t[i];
        }
        return;
    }

    type.indexOf("on") && (type = "on" + type);

    // 移除某类事件监听
    if (typeof handler == "undefined") {
        delete t[type];
    } else if (t[type]) {
        // [TODO delete 2013] 支持按 key 删除注册的函数
        typeof handler=="string" && (handler=t[type][handler]) && delete t[type][handler];

        for (i = t[type].length - 1; i >= 0; i--) {
            if (t[type][i] === handler) {
                t[type].splice(i, 1);
            }
        }
    }
};

// 2011.12.19 meizz 为兼容老版本的按 key 删除，添加了一行代码
/// support magic - Tangram 1.x Code End



magic.Base = function(){
    baidu.lang.Class.call(this);

    this._ids = {};
    this._eid = this.guid +"__";
}
baidu.lang.inherits(magic.Base, baidu.lang.Class, "magic.Base").extend(

{
    
    getElement : function(id) {
        return document.getElementById(this.$getId(id));
    },

    
    getElements: function(){
        var result = {};
        var _ids = this._ids;
        for(var key in _ids)
            result[key] = this.getElement(key);
        return result;
    },

    
    $getId : function(key) {
        key = baidu.lang.isString(key) ? key : "";
        // 2012-3-23: 使 _ids 存入所以可能被建立映射的 key
        return this._ids[key] || (this._ids[key] = this._eid + key);
    }

    
    ,$mappingDom : function(key, dom){
        if (baidu.lang.isString(dom)) {
            this._ids[key] = dom;
        } else if (dom && dom.nodeType) {
            dom.id ? this._ids[key] = dom.id : dom.id = this.$getId(key);
        }
        return this;
    }

    
    ,$dispose : function() {
        this.fire("ondispose") && baidu.lang.Class.prototype.dispose.call(this);
    }
});

//  20120110    meizz   简化eid去掉其中的__type部分；事件派发使用fire方法替换原来 dispatchEvent
//  20111129    meizz   实例化效率大比拼
//                      new ui.Base()           效率为 1
//                      new ui.control.Layer()  效率为 2
//                      new ui.Dialog()         效率为 3.5

/// support maigc - Tangram 1.x Code Start






//baidu.lang.isDate = function(o) {
//    // return o instanceof Date;
//    return {}.toString.call(o) === "[object Date]" && o.toString() !== 'Invalid Date' && !isNaN(o);
//};

baidu.lang.isDate = baidu.isDate;
/// support maigc Tangram 1.x Code End



magic.Calendar = baidu.lang.createClass(function(options){
    var me = this;
    me._options = baidu.object.extend({
        weekStart: 'sun',
        initDate: baidu.i18n.date.toLocaleDate(new Date()),
        highlightDates: [],
        disabledDates: [],
        disabledDayOfWeek: [],
        language: 'zh-CN'
    }, options || {});
    
    //当前日期表所显示的日期
    //使用new Date重新实例化，避免引用
    me.currentDate = new Date(me._options.initDate);

     //存储选中的日期
    me.selectedDate = new Date(me._options.initDate);

    //当前日历显示周一到周日的顺序
    me.dayNames = [];

}, { type: "magic.Calendar", superClass : magic.Base });

magic.Calendar.extend(

{
    
    tplSkeleton: '<div id="#{calendarId}" class="#{calendarClass}"><div id="#{titleId}" class="#{titleClass}"></div><div id="#{tableId}" class="#{tableClass}"></div></div>',
    
    
    tplDate: '<td id="#{id}" class="#{class}" onmouseover="#{mouseover}" onmouseout="#{mouseout}" onclick="#{click}">#{date}</td>',
    
    
    render: function(el){
        var me = this;
        
        if(baidu.type(el) === "string"){
            el = '#' + el;
        }
        me.container = baidu(el)[0];

        //渲染日历骨架
        me._renderSkeleton();

        //渲染标题（即年份月份）
        me._renderTitle();

        //渲染日期表格
        me._renderDateTable();

        //渲染月份跳转按钮
        me._renderNavBtn();

        //给表格绑定事件
        me._bindTable();

        //给跳转按钮绑定事件
        me._bindNavBtn();

        //快捷键
        me._addkeystrokesListener();
        
          
        me.fire("render");
    },

    
    _rerender: function(){
        var me = this;

        //渲染标题（即年份月份）
        me._renderTitle();

        //渲染日期表格
        me._renderDateTable();

        //重新绑定table上的事件代理
        me._bindTable();
    },
    
    
    _getId: function(name){
        return this.$getId() + (name === undefined ? 'tang_calendar' : 'tang_calendar_' + name);
    },
    
    
    _getClass: function(name){
        return name === undefined ? 'tang-calendar' : 'tang-calendar-' + name;
    },

    
    _renderSkeleton: function(){
        var me = this,
            container = me.container;
        
        baidu(container).insertHTML('beforeEnd', baidu.string.format(me.tplSkeleton, {
            calendarId: me._getId(),
            calendarClass: me._getClass(),
            titleId: me._getId('title'),
            titleClass: me._getClass('title'),
            tableId: me._getId('table'),
            tableClass: me._getClass('table')
        }));
        
        me.titleEl = baidu('#' + me._getId('title'))[0];
        me.tableEl = baidu('#' + me._getId('table'))[0];

        me.$mappingDom('calendar', baidu('#' + me._getId())[0]);
        me.$mappingDom('title', me.titleEl);
        me.$mappingDom('table', me.tableEl);
    },

    
    _renderTitle: function(){
        var me = this,
            date = me.currentDate,
            year = date.getFullYear(),
            month = date.getMonth() + 1;
            
        me.titleEl.innerHTML = baidu.string.format(baidu.i18n.cultures[me._options.language].calendar.titleNames, {
            "yyyy": year,
            'MM': baidu.i18n.cultures[me._options.language].calendar.monthNamesShort[month-1]
        });
    },

    
    _renderDateTable: function(){
        var thead = this._getTheadString(),
            tbody = this._getTbodyString();
        
        this.tableEl.innerHTML = '<table border="0" cellpadding="0" cellspacing="0">' + thead + tbody + '</table>';
    },
    
    
    _renderNavBtn: function(){
        var me = this,
            calendarEl = baidu('#' + me._getId())[0],
            doc = document,
            preBtn = doc.createElement("div"),
            nextBtn = doc.createElement("div"),
            preYear = doc.createElement("div"),
            nextYear = doc.createElement("div");
            
        preBtn.className = me._getClass('prebtn');
        nextBtn.className = me._getClass('nextbtn');
        preYear.className = me._getClass('yprebtn');
        nextYear.className = me._getClass('ynextbtn');

        calendarEl.appendChild(preBtn);
        calendarEl.appendChild(nextBtn);
        calendarEl.appendChild(preYear);
        calendarEl.appendChild(nextYear);

        me.preBtn = preBtn;
        me.nextBtn = nextBtn;
        me.ypreBtn = preYear;
        me.ynextBtn = nextYear;

        me.$mappingDom('premonthbtn', preBtn);
        me.$mappingDom('nextmonthbtn', nextBtn);
        me.$mappingDom('preyearbtn', preYear);
        me.$mappingDom('preyearhbtn', nextYear);
    },

    
    _bindNavBtn: function(){
        var me = this,
            preBtn = me.preBtn,
            nextBtn = me.nextBtn,
            ypreBtn = me.ypreBtn,
            ynextBtn = me.ynextBtn,
            mousedownrespond = false,
            preBtnClickHandler,
            nextBtnClickHandler,
            ypreBtnClickHandler,
            ynextBtnClickHandler,
            preBtnMouseHandler,
            nextBtnMouseHandler,
            ypreBtnMouseHandler,
            ynextBtnMouseHandler,
            documentHandler;

        baidu(preBtn).on('click', preBtnClickHandler = function(){
            !mousedownrespond && me.preMonth();
            mousedownrespond = false;
              
            me.fire("premonth");
        });
        baidu(nextBtn).on('click', nextBtnClickHandler = function(){
            !mousedownrespond && me.nextMonth();
            mousedownrespond = false;
              
            me.fire("nextmonth");
        });
        baidu(ypreBtn).on('click', ypreBtnClickHandler = function(){
            !mousedownrespond && me.preYear();
            mousedownrespond = false;
              
            me.fire("preyear");
        });
        baidu(ynextBtn).on('click', ynextBtnClickHandler = function(){
            !mousedownrespond && me.nextYear();
            mousedownrespond = false;
              
            me.fire("nextyear");
        });

        //响应鼠标一直按下的事件
        var timer = null;
        var mouseDownHandler = function(direction, isYear){
            if(timer){
                return;
            }
            function createTimer(){
                timer = setTimeout(function(){
                    isYear ? (direction == 'pre' ? me.preYear() : me.nextYear())
                            : (direction == 'pre' ? me.preMonth() : me.nextMonth());
                    mousedownrespond = true;
                    createTimer();
                }, 500);
            }
            createTimer();
        };
        var mouseUpHandler = function(){
            clearTimeout(timer);
            timer = null;
        };
        
        baidu(preBtn).on('mousedown', preBtnMouseHandler = function(){
            mouseDownHandler('pre');
        });

        baidu(nextBtn).on('mousedown', nextBtnMouseHandler = function(){
            mouseDownHandler('next');
        });
        
        baidu(ypreBtn).on('mousedown', ypreBtnMouseHandler = function(){
            mouseDownHandler('pre', true);
        });

        baidu(ynextBtn).on('mousedown', ynextBtnMouseHandler = function(){
            mouseDownHandler('next', true);
        });

        baidu(document).on('mouseup', documentHandler = function(){
            if(me.disposed) return;
            
            timer && mouseUpHandler();
        });
        
        me.on("dispose", function(){
            baidu(preBtn).off('click', preBtnClickHandler);
            baidu(nextBtn).off('click', nextBtnClickHandler);
            baidu(ypreBtn).off('click', ypreBtnClickHandler);
            baidu(ynextBtn).off('click', ynextBtnClickHandler);
            baidu(preBtn).off('mousedown', preBtnMouseHandler);
            baidu(nextBtn).off('mousedown', nextBtnMouseHandler);
            baidu(ypreBtn).off('mousedown', ypreBtnMouseHandler);
            baidu(ynextBtn).off('mousedown', ynextBtnMouseHandler);
            baidu(document).off('mouseup', documentHandler);
        });
          
    },

    
    _getTheadString: function(){
        var me = this,
            dayNames = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
            dayName,
            theadString = [],
            weekStart = me._options.weekStart.toLowerCase(),
            index = baidu.array.indexOf(dayNames, weekStart),
            i18nCalendar = baidu.i18n.cultures[me._options.language].calendar.dayNames,
            i = 0;

        theadString.push('<thead class="' + me._getClass("weekdays") + '"><tr>');
        for(; i<7; i++){
            index > 6 && (index = 0);
            me.dayNames.push(dayNames[index]);
            dayName = i18nCalendar[dayNames[index]];
            theadString.push('<th>' + dayName + '</th>');
            index++;
        }
        theadString.push('</tr></thead>');
        
        return theadString.join('');
    },
    
    
    _getTbodyString: function(){
        var me = this,
            dayNames = me.dayNames,
            defaultDayNames = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'],
            date = new Date(me.currentDate),    //使用new Date()来创建一个新的日期对象，否则可能会不小心改变me.currentDate的值
            day,
            predays = 0,    //当前日历表中上一个月份的天数
            tableString = [],
            dayOfFirstDay = 0,  //本月第一天是星期几
            daysInMonth = baidu.i18n.date.getDaysInMonth(date.getFullYear(), date.getMonth()),
            weeks = 5,  //每个日历表需要显示的星期个数，一般为5周，特殊情况时为6周
            selectedId = '',    //已选中日期对应的td的id
            dateStr = '';   //写在每个td自定义属性上的日期字符串

        date.setDate(1);//将当天日期设置到1号（即当月第一天）
        day = date.getDay();

        predays = baidu.array.indexOf(dayNames, defaultDayNames[day]);

        //如果上个月天数加上本月天数超过5*7，则日历表需要显示6周
        if(predays + daysInMonth > 35){
            weeks = 6;
        }
        date.setDate(date.getDate() - predays); //回退到当前日历表中的第一天

        var i = 0, j = 0, classname = '';
        for(; i < weeks; i++){
            tableString.push('<tr>');
            for(; j < 7; j++){
                classname = me._getClass("date");
                selectedId = '';
                //是否周末
                if(date.getDay() == 0 || date.getDay() == 6){
                    classname += ' ' + me._getClass("weekend");
                }
                //是否当天
                if(me._datesEqual(baidu.i18n.date.toLocaleDate(new Date()), date)){
                    classname += ' ' + me._getClass("today");
                }
                //是否是高亮日期
                if(me._datesContains(me._options.highlightDates, date)){
                    classname += ' ' + me._getClass("highlight");
                }
                //是否是不可用日期
                if(me._datesContains(me._options.disabledDates, date)){
                    classname += ' ' + me._getClass("disable");
                }
                //是否是不可用星期
                if(me._dayOfWeekInDisabled(date.getDay())){
                    classname += ' ' + me._getClass("disable");
                }
                //是否是已选择的日期
                if(me._datesEqual(me.selectedDate, date)){
                    classname += ' ' + me._getClass("selected");
                    selectedId = 'id="' + me._getId("selected") + '"';
                }
                //是否是其他月份日期
                if(date.getMonth() < me.currentDate.getMonth() || date.getFullYear() < me.currentDate.getFullYear()){
                    classname += ' ' + me._getClass("premonth");
                }else if(date.getMonth() > me.currentDate.getMonth() || date.getFullYear() > me.currentDate.getFullYear()){
                    classname += ' ' + me._getClass("nextmonth");
                }

                dateStr = me._formatDate(new Date(date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate()));
                tableString.push('<td ' + selectedId + ' class="' + classname + '" date="' + dateStr + '" onmouseover=baiduInstance("' + me.guid + '")._mouseoverHandler(event) onmouseout=baiduInstance("' + me.guid + '")._mouseoutHandler(event)>' + date.getDate() + '</td>');
                date.setDate(date.getDate() + 1);
            }
            tableString.push('</tr>');
            j = 0;
        }

        return '<tbody>' + tableString.join('') + '</tbody>';
    },

    
    _formatDate: function(d){
        var year = d.getFullYear(),
            month = d.getMonth() + 1,
            date = d.getDate();

        month = month >= 10 ? month : ('0' + month);
        date = date >= 10 ? date : ('0' + date);

        return year + '/' + month + '/' + date;
    },

    
    _mouseoverHandler: function(e){
        var me = this,
            target;

        target = baidu.event(e).target;
        baidu(target).addClass(me._getClass("hover"));

          
        me.fire("mouseover", {
            'target': target
        });
    },

    
    _mouseoutHandler: function(e){
        var me = this,
            target;

        target = baidu.event(e).target;
        baidu(target).removeClass(me._getClass("hover"));

          
        me.fire("mouseout", {
            'target': target
        });
    },
    
    
    _bindTable: function(){
        var me = this,
            tbodyEl = baidu('#' + me._getId("table"))[0].getElementsByTagName("tbody")[0],
            target,
            dateStr,
            date,
            _selectedEl,
            clickHandler;

        baidu(tbodyEl).on("click", clickHandler = function(e){
            target = e.target;
            if(target.tagName.toUpperCase() != "TD"){
                return;
            }

            dateStr = target.getAttribute('date');
            date = new Date(dateStr);

            var curDate = me.selectedDate;
            date.setHours(curDate.getHours());
            date.setMinutes(curDate.getMinutes());
            date.setSeconds(curDate.getSeconds());

            //判断日期是否处于不可用状态
            if(me._datesContains(me._options.disabledDates, date)){
                return;
            }
            //判断星期是否处于不可用状态
            if(me._dayOfWeekInDisabled(date.getDay())){
                return;
            }
            _selectedEl = baidu('#' + me._getId("selected"))[0];
            if(_selectedEl){
                _selectedEl.id = '';
                baidu(_selectedEl).removeClass(me._getClass("selected"));
            }
            
            target.id = me._getId("selected");
            baidu(target).addClass(me._getClass("selected"));

            dateStr = me._formatDate(date);
            me.selectedDate = new Date(dateStr);

              
            me.fire("selectdate", {
                'date': new Date(dateStr)
            });
        });
        
        me.on("dispose", function(){
            baidu(tbodyEl).off("click", clickHandler);
        });

    },

    
    _addkeystrokesListener: function(){
        var me = this,
            listenerAdded = false,
            calendarEl = baidu('#' + me._getId())[0],
            clickHandler;

        function keystrokesHandler(e){
            e = e || window.event;
            //e.preventDefault();
            var preventDefault =  true;
            switch (e.keyCode) {
                case 33:    //Page Up键
                    me.preMonth();
                    break;
                case 34:    //Page Down键
                    me.nextMonth();
                    break;
                case 37:    //左方向键
                    me._preDay();
                    break;
                case 38:    //上方向键
                    me._preDay();
                    break;
                case 39:    //右方向键
                    me._nextDay();
                    break;
                case 40:    //下方向键
                    me._nextDay();
                    break;
                default:
                    preventDefault =  false;
                    break;
            }
            preventDefault && e.preventDefault();
        }

        baidu(document).on("click", clickHandler = function(e){
            
            if(me.disposed) return;
            
            var target = e.target;
            
            if(!(baidu.dom.contains(calendarEl, target) || target == calendarEl)){
                baidu(document).off("keydown", keystrokesHandler);
                listenerAdded = false;
            }else{
                if(listenerAdded)
                    return;
                baidu(document).on("keydown", keystrokesHandler);
                listenerAdded = true;
            }
        });
        
        me.on("dispose", function(){
            baidu(document).off("click", clickHandler);
        });

    },

    
    _datesEqual: function(d1, d2){
        
        if(baidu.type(d1) != 'date' || baidu.type(d2) != 'date'){
            return;
        }
        
        var year1 = d1.getFullYear(),
            month1 = d1.getMonth(),
            date1 = d1.getDate(),

            year2 = d2.getFullYear(),
            month2 = d2.getMonth(),
            date2 = d2.getDate();

        return (year1 == year2) && (month1 == month2) && (date1 == date2);
    },

    _days: {'mon':1, 'tue':2, 'wed':3, 'thu':4, 'fri':5, 'sat':6, 'sun':0},
    
    _dayOfWeekInDisabled: function(day){
        var disabledDays = this._options.disabledDayOfWeek, 
            days = this._days,
            result = false,
            i = 0, 
            item;
        for(; i < disabledDays.length; i++){
                item = disabledDays[i];
                typeof item == 'object' ?
                    (days[item.start] || 0) <= day && day <= days[item.end] && (result = true)
                    : days[item] == day && (result = true);
                if(result){
                    break;
                }

        }
        return result;
    },

    
    _datesContains: function(dates, source){
        var me = this,
            i = 0,
            len = dates.length,
            item,
            flag = true;
            
        if(baidu.type(source) != 'date'){
            return;
        }

        for(; i<len; i++){
            item = dates[i];
            if(baidu.lang.isDate(item)){
                if(me._datesEqual(item, source)){
                    return true;
                }
            }else{
                if(item.end){
                   item.end = new Date(baidu.date.format(item.end, "yyyy/MM/dd") + " 23:59:59"); //将结束时间调整为该天的23点59分59秒
                }

                if((!item.start || source.getTime() >= item.start.getTime()) && (!item.end || source.getTime() <= item.end.getTime())){
                    return true;
                }
            }
        }

        return false;
    },

    
    go: function(year, month){
        var me = this;

        me.currentDate.setFullYear(year);

        me.currentDate.setDate(1);  //必须首先将日设置成1号，否则从1月30日或者3月30日向2月份跳转时会出错
        month = month === undefined ? me.currentDate.getMonth() : month - 1;
        me.currentDate.setMonth(month);

        me._rerender();
    },
    
    
    getDate: function(){
        return new Date(this.selectedDate);
    },
    
    
    setDate: function(date){
        var me = this,
            _date = new Date(date);
            
        if(baidu.type(date) != 'date'){
            return false;
        }

        //判断日期是否处于不可用状态
        if(me._datesContains(me._options.disabledDates, _date)){
            return;
        }
        //判断星期是否处理不可用状态
        if(me._dayOfWeekInDisabled(_date.getDay())){
            return;
        }

        me.currentDate = new Date(date);
        me.selectedDate = new Date(date);
        
        me._rerender();
        return true;
    },
    
    
    preMonth: function(){
        var me = this,
            currentDate = me.currentDate,
            currentMonth = currentDate.getMonth() + 1,
            currentYear = currentDate.getFullYear();
            
        me.go(currentYear, currentMonth - 1);
    },
    
    
    nextMonth: function(){
        var me = this,
            currentDate = me.currentDate,
            currentMonth = currentDate.getMonth() + 1,
            currentYear = currentDate.getFullYear();
            
        me.go(currentYear, currentMonth + 1);
    },

    
    preYear: function(){
        var me = this,
            currentDate = me.currentDate;
            
        me.go(currentDate.getFullYear() - 1, currentDate.getMonth() + 1);
    },
    
    
    nextYear: function(){
        var me = this,
            currentDate = me.currentDate;
            
        me.go(currentDate.getFullYear() + 1, currentDate.getMonth() + 1);
    },

    
    _preDay: function(){
        var me = this,
            _date = new Date(me.selectedDate);

        _date.setDate(_date.getDate() - 1);

        me.setDate(_date);
        
        me.fire("selectdate", {
            'date': _date
        });
    },

    
    _nextDay: function(){
            var me = this,
            _date = new Date(me.selectedDate);

        _date.setDate(_date.getDate() + 1);

        me.setDate(_date);
        
        me.fire("selectdate", {
            'date': _date
        });
    },
    
    
    $dispose: function(){
        var me = this;
        if(me.disposed){
            return;
        }
        me.container.removeChild(baidu('#' + me._getId())[0]);
        magic.Base.prototype.$dispose.call(me);
    }
    
    
});
