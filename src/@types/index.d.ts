declare module '*.module';
declare module '*.css';
declare module '*.less';
declare module '*.scss';
declare module '*.png';
declare module '*.jpg';
declare module '*.json';
declare module '*.ts';
declare module '*.svg' {
  const content: any;
  export default content;
}

declare module "js-cookie";
declare module 'ua-parser-js';

declare interface Window {
  initGeetest4: Function
  // JSBridge: {
  //     call(eventName: string, params?: any, callback?: (data: any) => void)
  //     on(eventName: string, callback?: () => void)
  // }
}

