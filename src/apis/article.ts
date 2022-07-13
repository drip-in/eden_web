import {baseReqInstance} from ".";
import { BaseResp } from "./interfaces";
import { baseResponseStruct } from "./base";


export enum ArticleType {
  Original = 1,   // 原创
  Reprinted = 2,  // 转载
  Translated = 3, // 翻译
}