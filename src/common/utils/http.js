import axios from 'axios';
// import cookie from 'js-cookie';
import { message } from 'antd';

const http = axios.create({
  baseURL: '/admin/api',
  timeout: 1000 * 60 * 5,
  headers: {
    csrftoken: '',
    username: 'admin',
    nodecsrftoken: '',
    modelname: 'undefined',
  }
});

http.interceptors.response.use(
  res => {
    if (res.data) {
      if (res.data.errMsg) {
        message.error(res.data.errMsg);
        return Promise.reject(res.data);
      }
      if (res.data.data) {
        if (res.data.data.baseResp.statusCode !== 0) {
          message.error(res.data.data.baseResp.statusMessage || `Error Code: ${res.data.data.baseResp.statusCode}`);
          return Promise.reject(res.data.data);
        }
        return res.data.data;
      }
      return res.data;
    }
    return res;
  },
  err => Promise.reject(err)
);

export default http;
