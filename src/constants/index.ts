export const IS_DEV = process.env.NODE_ENV !== "production";

export const IS_SAFARI = !navigator.userAgent.match("Chrome") && navigator.userAgent.match("Safari");

export const FAKE_TOKEN_HEADER = "cflid";

export const FAKE_TOKEN_LOGIN_URL_PARAM_NAME = "fake_login_token";
export const SCM_PREVIEW_URL_PARAM_NAME = "scm_version";
export const TEST_BUSINESS_SWITCH_URL_PARAM_NAME = "fake_business";

export const PRODUCTION_DOMAIN = "https://deesta.cn";

