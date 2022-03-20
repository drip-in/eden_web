
/* eslint-disable */
export function formatDate(date, fmt = 'yyyy-MM-dd') {
  if (typeof date === 'number' && date < 10000000000) {
      date *= 1000;
  }
  if (!(date instanceof Date)) {
      date = new Date(date);
  }
  if (isNaN(date.getTime())) {
      return '';
  }
  let o = {
      'M+': date.getMonth() + 1,
      'd+': date.getDate(), // 日
      'h+': date.getHours(), // 小时
      'm+': date.getMinutes(), // 分
      's+': date.getSeconds(), // 秒
      'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
      'S': date.getMilliseconds() // 毫秒
  };
  if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length)); // eslint-disable-line
  }
  for (let k of Object.keys(o)) {
      if (new RegExp('(' + k + ')').test(fmt)) {
          fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
      }
  }
  return fmt;
}
/* eslint-disable */

