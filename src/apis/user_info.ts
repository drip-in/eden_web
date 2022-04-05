import {baseReqInstance, BaseResp} from ".";

export const urlMap = {
  userLogout: '/eden/v1/bluev/logout',
  fetchContactConfig: '/eden/v1/profile/module/detail/',
  updateContactInfo: '/eden/v1/profile/module/update/',
  fetchVerifyCode: '/eden/v1/notify/verify/',
  getGroupList: '/eden/v1/coupon/activity/list/',
};

export enum PermissionKeys {
  UserManage = "UserManage", //"用户管理"
  IMManage = "IMManage", // "消息管理"
  ContentManage = "ContentManage", // "内容管理"
  PoiManage = "PoiManage", // "店铺管理"
  BuildWebsite = "BuildWebsite", // "个人建站/产品转化页"
  CouponManage = "CouponManage", // 卡券中心
  PermissionManage = "PermissionManage", // 授权管理
  DataManage = "DataManage", //"数据分析"
  ProfileManage = "ProfileManage", // "个人主页设置"
  ProfileTab = "ProfileTab", // "商家页面设置"
  OperationTutorial = "OperationTutorial", // 运营学堂
  SideConsultation = "SideConsultation" // 右侧反馈
}

export interface PermissionStruct {
  id: number; // 权限的Id
  key: PermissionKeys; // 权限的Key
  name: string; // 权限的名称
  extra?: string; // 权限的标注
  customization?: string; // 权限定制化信息
}

export interface UserInfo {
  avatar_url: string;
  level: number;
  eden_uid: string;
  nick_name: string;
  role_infos?: Array<{ id: number; key: string; name: string }>;
  permission_map?: { [key in PermissionKeys]: PermissionStruct };
}

export enum ContactType {
  WebsiteLink = 1,
  DownloadLink = 2,
  Phone = 3,
  Shop = 4,
  MicroApp = 5,
}

export enum StatusType {
  Disabled = 0,
  Effective = 1,
  Auditing = 3,
  Failed = 4
}

export enum ModuleStaus {
  INVALID,
  VALID,
  AUDITING = 3,
  AUDIT_FAIL = 4,
  AUDIT_FAIL_WITH_NO_RECORD = 5
}

export enum VerifyType {
  SMS_CODE = 1,
  CAPTCHA = 2,
  VOICDE_CODE = 3
}
interface baseResponseStruct {
  status_code: number;
  status_msg?: string;
  status_message?: string;
}

export interface ContactItemStruct {
  module_type: ContactType;
  title: string;
  content: string;
  status?: number;
  reject_reason?: string;
  extra_map?: {
    smart?: string;
    website_type_id?: string;
  };
  audit_status?: number;
  verify_info?: {
    verify_type: number;
  }
}

export interface WebsiteOptionStruct {
  id: string;
  type_name: string;
  title: string[];
  prompt: string;
  valid_domains: string[];
}

export interface downloadLinkStruct {
  ios: string[];
  android: string[];
}

export interface GroupActivity {
  activityId: number;
  title: string;
  startTime: number;
  endTime: number;
  poiIdList: Array<string>;
  resType: number;
  amount: number;
  minAmount: number;
  validDays: number;
  validStart: number;
  validEnd: number;
  createTime: number;
  updatetime: number;
  status: number;
  statusDesc: string;
  count: number;
  assignCount: number;
  consumedCount: number;
  coverImgUrl: string;
  buyQrCodeUrl: string;
  auditMsg: string;
  resourceTitle: string;
  merchantName: string;
  condition: string;
  notification: string;
  payItems: Object;
  Platform: number;
  uCount: number
}

export type PropName = string | number

interface ContactConfig {
  module_map: {
    [propName in PropName]: ContactItemStruct
  };
  title_options_map: {
    [propName in PropName]: string[];
  };
  website_type_options: WebsiteOptionStruct[];
  mobile_verify_info?: {
    verify_type: number;
  },
  version: number;
  download_link_regex: downloadLinkStruct;
  is_ad_profile: boolean; // 是否为广告账号
  has_ad_campaign: boolean; // 是否有广告在投计划
}

interface GroupListResponse extends BaseResp {
  activityList: GroupActivity[]
}

export default {
  async userLogout() {
    return baseReqInstance<baseResponseStruct>({
      url: `${urlMap.userLogout}`,
      method: 'get',
      // data: params
    });
  },
  async updateContactInfo(params) {
    return baseReqInstance<baseResponseStruct>({
      url: `${urlMap.updateContactInfo}`,
      method: 'post',
      data: params
    });
  },
  async sendMobileCode(params) {
    return baseReqInstance<baseResponseStruct>({
      url: `${urlMap.fetchVerifyCode}`,
      method: 'post',
      data: params
    });
  },
  // 获取当前用户团购活动列表
  async getGroupList(params) {
    return baseReqInstance<GroupListResponse>({
      url: `${urlMap.getGroupList}`,
      method: 'get',
      data: params,
    })
  }
};
