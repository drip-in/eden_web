import axios, { AxiosRequestConfig } from "axios";
// 这里注入附身token
// axios.defaults.headers.common['Authorization'] = 'AUTH_TOKEN';

import { notification } from "antd";
import { PRODUCTION_DOMAIN, IS_DEV } from "../constants";

// const searchParams = new URL(location.href).searchParams;
// const fakeLoginToken = searchParams.get(FAKE_TOKEN_LOGIN_URL_PARAM_NAME);
// const scmPreviewVersion = searchParams.get(SCM_PREVIEW_URL_PARAM_NAME)

const host = IS_DEV ? "" : PRODUCTION_DOMAIN;



const instance = axios.create({
  baseURL: host,
  timeout: 10000
});


// export default (params: AxiosRequestConfig & {notNotifyOnError?: boolean}) => {
//   if (params.method === "get" && params.data) {
//     params.url += `?${Object.entries(params.data)
//       .map(entry => entry.join("="))
//       .join("&")}`;
//   }
//   return instance
//     .request(params)
//     .then(resp => resp.data)
//     .then(resp => {
//       if (params.notNotifyOnError) {
//         return resp
//       }
//       if (resp.status_code && resp.status_code !== 0 && resp.status_msg) {
//         notification.warn({
//           message: resp.status_msg
//         });
//       }
//       return resp;
//     })
//     .catch(e =>
//       notification.warn({
//         message: `oops..好像出了点问题，请刷新下本页面。`
//       })
//     );
// };

export const baseReqInstance = <T>(config: AxiosRequestConfig): Promise<T> => {

  let sendData = {
      ...(config || {}),
  };
  if (config.method === 'get') {
      const { data = {}, params = {}, ...resetParams } = config;
      //  axios中接收到params参数时，会将params参数自动转化为url上的参数
      // 将外部传入的params或者data参数变为配置对象的params参数
      const dataF = {
          ...data,
          ...params,
      };

      const url = dataF && Object.keys(dataF).length ? `${config.url}?${Object.entries(dataF)
          .map(entry => entry.join('='))
          .join('&')}` : config.url;
      sendData = {
          ...resetParams,
          url,
      };
  }

  return instance
      .request(sendData)
      .then(resp => resp.data)
      .then(resp => {
          if (resp.status_code && resp.status_code !== 0 && resp.status_msg) {
            notification.warn({
              message: resp.status_msg
            });
          }
          return resp;
      })
      .catch(e => {
        notification.warn({
          message: `oops..好像出了点问题，请刷新下本页面。`
        })
      });
};