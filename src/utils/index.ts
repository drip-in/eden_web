
const Util = {
  /**
   * 频率控制 返回函数连续调用时，func 执行频率限定为1次 / wait
   *
   * @param  {function}   func      传入函数
   * @param  {number}     wait      表示时间窗口的间隔
   * @param  {object}     options   如果想忽略开始边界上的调用，传入{leading: false}
   *                                如果想忽略结尾边界上的调用，传入{trailing: false}
   * @param  {Array}      args      其他传入的参数
   * @return {function}             返回客户调用函数
   */
   throttle: (func, wait, options, ...args) => {
    let context = this;
    let timeout;
    let now;
    let remaining;
    let result;
    // 上次执行时间点
    let previous = 0;
    if (!options) {
      options = {};
    }
    // 延迟执行函数
    const later = () => {
      // 若设定了开始边界不执行选项，上次执行时间始终为0
      previous = options.leading === false ? 0 : Date.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) {
        context = args = null;
      }
    };
    return () => {
      now = Date.now();
      // 首次执行时，如果设定了开始边界不执行选项，将上次执行时间设定为当前时间。
      if (!previous && options.leading === false) {
        previous = now;
      }
      // 延迟执行时间间隔
      remaining = wait - (now - previous);
      // 延迟时间间隔remaining小于等于0，表示上次执行至此所间隔时间已经超过一个时间窗口
      // remaining大于时间窗口wait，表示客户端系统时间被调整过
      if (remaining <= 0 || remaining > wait) {
        clearTimeout(timeout);
        timeout = null;
        previous = now;
        result = func.apply(context, args);
        if (!timeout) {
          context = args = null;
        }
        // 如果延迟执行不存在，且没有设定结尾边界不执行选项
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  },
  // 上面的 throttle 不能正确读取参数
  USthrottle: (func, wait, options) => {
    let timeout;
    let context;
    let args;
    let result;
    let previous = 0;
    if (!options) {
      options = {};
    }

    const later = () => {
      previous = options.leading === false ? 0 : Date.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) {
        context = args = null;
      }
    };

    const throttled = (...arg) => {
      const now = Date.now();
      if (!previous && options.leading === false) {
        previous = now;
      } // 默认leading 是true，直接执行
      const remaining = wait - (now - previous);
      context = this;
      args = arg;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
        if (!timeout) {
          // noinspection JSAnnotator
          context = args = null;
        }
      } else if (!timeout && options.trailing !== false) {
        // 如果没设置 timeout 而且需要执行后置调用
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
    throttled.cancel = () => {
      clearTimeout(timeout);
      previous = 0;
      timeout = context = args = null;
    };

    return throttled;
  },

  /**
   * 空闲控制 返回函数连续调用时，空闲时间必须大于或等于 wait，func 才会执行
   *
   * @param  {function} func        传入函数
   * @param  {number}   wait        表示时间窗口的间隔
   * @param  {boolean}  immediate   设置为ture时，调用触发于开始边界而不是结束边界
   * @param  {Array}      args      其他传入的参数
   * @return {function}             返回客户调用函数
   */
  debounce: (func, wait, immediate, ...args) => {
    let timeout;
    let context = this;
    let timestamp;
    let last;
    let callNow;
    let result;
    // 延迟执行函数
    const later = () => {
      // 据上一次触发时间间隔
      last = Date.now() - timestamp;
      // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
      if (last < wait && last > 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
        if (!immediate) {
          result = func.apply(context, args);
          if (!timeout) {
            context = args = null;
          }
        }
      }
    };
    return () => {
      timestamp = Date.now();
      callNow = immediate && !timeout;
      // 如果延时不存在，重新设定延时
      if (!timeout) {
        timeout = setTimeout(later, wait);
      }
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }
      return result;
    };
  },

  /**
   * 转化为货币展示格式，千万以下直接表示，超过千万用xxx万表示，超过亿用xxx.xx亿表示
   * @param  {Number} num 待转换的数
   * @return {String} 转换后的字符串
   */
   parseNumberToPrice: num => {
    /* 转化为数字文本形式*/
    const number = parseInt(num, 10).toString();
    const numArr = number.split("");
    const result = [];
    const len = numArr.length;
    /* 如果num是不可转化为数字的直接抛出*/
    if (isNaN(num)) {
      return num;
    }
    /* 如果小于8位数，则用逗号间隔*/
    if (num < 1000000) {
      /* numArr数组逢3位数字，中间间隔，*/
      for (let i = 0; i < len; i++) {
        if ((len - i) % 3 === 0 && i !== 0) {
          result.push(",");
        }
        result.push(numArr[i]);
      }
      return result.join("");
      /* 如果大于等于8位*/
    }
    if (num >= 1000000 && num < 100000000) {
      num = (num / 10000).toFixed(1);
      if (num[num.length - 1] === "0") {
        return `${num.slice(0, num.length - 2)}万`;
      }
      return `${num}万`;
    }
    if (num >= 100000000) {
      for (let i = 0; i < len; i++) {
        /* 没有到万的位置*/
        if (len - i > 8) {
          if ((len - 8 - i) % 3 === 0 && i !== 0) {
            result.push(",");
          }
          result.push(numArr[i]);
          /* 亿为单位的需要加小数点*/
        } else if (len - i === 8) {
          if (numArr[i] !== "0") {
            result.push(".");
            result.push(numArr[i]);
          }
          /* 亿为单位的需要加小数点第二位*/
        }
      }
      return `${result.join("")}亿`;
    }
    return "";
  },

  /**
   * 设置某个key的cookie值
   * @param  {string} key cookie名称
   * @param {object} options cookie的设置值
   */
   setCookie: (key, value, options) => {
    if (!value || !key) {
      return;
    }
    if (typeof options.expires === "number") {
      const days = options.expires;
      const t = (options.expires = new Date());
      t.setTime(+t + days * 864e5);
    }
    document.cookie = [
      encodeURIComponent(key),
      "=",
      String(value),
      options.expires ? `; expires=${options.expires.toUTCString()}` : "",
      options.path ? `; path=${options.path}` : "",
      options.domain ? `; domain=${options.domain}` : "",
      options.secure ? "; secure" : ""
    ].join("");
  },

  // 获取query中的键值对
  parseQueryString: str => {
    const reg = /(([^?&=]+)(?:=([^?&=]*))*)/g;
    const result = {};
    let match = reg.exec(str);
    let key;
    let value;
    while (match) {
      key = match[2];
      value = match[3] || "";
      result[key] = decodeURIComponent(value);
      match = reg.exec(str);
    }
    return result;
  },

  /**
   * @description 转义html字符串
   * @param {String} string 待转义的字符串 underscore的escape函数
   */
   escape: string => {
    const escapeMap = {
      "&amp;": "&",
      "&lt;": "<",
      "&gt;": ">",
      "&quot;": '"',
      "&#x27;": "'",
      "&#x60;": "`"
    };
    const escaper = function(match) {
      return escapeMap[match];
    };
    const source = `(?:${Object.keys(escapeMap).join("|")})`;
    const textRegexp = RegExp(source);
    const replaceRegexp = RegExp(source, "g");
    string = string == null ? "" : `${string}`;
    return textRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
  },

  flattenArray<T>(array: T[], res = []): T[] {
    if (!Array.isArray(array)) {
      return [];
    }
    array.forEach(item => {
      if (Array.isArray(item)) {
        Util.flattenArray(item, res);
      } else {
        res.push(item);
      }
    });
    return res;
  }
};

export default Util;