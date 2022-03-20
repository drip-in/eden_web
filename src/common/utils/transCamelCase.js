/* eslint-disable*/
/**
 * 返回一个由一个小驼峰的json对象递归地转换成大驼峰的新json对象
 * @param {需要转换的对象} obj 
 */
export default function transCamelCase(obj) {
  let newObj = null;
  let regx = /^[a-z]/;
  if (typeof obj === 'object') {
    if (!obj) {
      return obj;
    }
    newObj = Object.prototype.toString.call(obj).slice(8, -1).toLowerCase().indexOf('array') > -1 ? [] : {};
    for (let keyName in obj) {
      let key = keyName.toString().replace(regx, function (word) {
        return `${word.toUpperCase()}`;
      });
      if (typeof obj[keyName] === 'object') {
        newObj[key] = transCamelCase(obj[keyName]);
      } else {
        newObj[key] = obj[keyName];
      }
    }
  }
  return newObj;
}
