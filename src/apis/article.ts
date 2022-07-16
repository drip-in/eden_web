import {baseReqInstance} from ".";
import { BaseResp } from "./interfaces";
import { baseResponseStruct } from "./base";


export enum ArticleType {
  Original = 1,   // 原创
  Reproduct = 2,  // 转载
  Translate = 3, // 翻译
}