export const replaceKey = (data, callback) =>
  Object.keys(data).reduce((v, k) => Object.assign(v, { [k.replace(/^[a-zA-Z]/, callback)]: data[k] }), {});

export const replaceCamaltoUpperCase = val => replaceKey(val, m => m.toUpperCase());
export const replaceCamaltoLowerCase = val => replaceKey(val, m => m.toLowerCase());

export const insertValue = (temp, data) => Object.keys(temp).reduce((val, k) => ({ ...val, [k]: data[k] }), {});
