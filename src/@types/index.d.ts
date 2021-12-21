declare module '*.module';
declare module '*.css';
declare module '*.less';
declare module '*.scss';
declare module '*.png';
declare module '*.jpg';
declare module '*.json';
declare module '*.svg' {
  const content: any;
  export default content;
}


