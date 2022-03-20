// import cookie from 'js-cookie';
import http from './http';

const username = "";

export default function (program, params) {
  return http.post(`/op/${program}/`, {
    ...params,
    Operator: {
      OperaterId: '0',
      OperaterName: username,
      OperaterEmail: `${username}@deesta.cn`,
      UserId: 0,
      Username: username,
      Email: `${username}@deesta.cn`,
    },
  });
}
