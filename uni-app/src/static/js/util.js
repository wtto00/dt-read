export const getPlatform = () => {
  // #ifdef APP-PLUS
  return 'APP-PLUS'
  // #endif
  // #ifdef H5
  return 'H5'
  // #endif
  // #ifdef MP-WEIXIN
  return 'MP-WEIXIN'
  // #endif
  // #ifdef MP-ALIPAY
  return 'MP-ALIPAY'
  // #endif
  // #ifdef MP-BAIDU
  return 'MP-BAIDU'
  // #endif
  // #ifdef MP-TOUTIAO
  return 'MP-TOUTIAO'
  // #endif
  // #ifdef MP-QQ
  return 'MP-QQ'
  // #endif
  // #ifdef MP-360
  return 'MP-360'
  // #endif
  // #ifdef QUICKAPP-WEBVIEW-HUAWEI
  return 'QUICKAPP-WEBVIEW-HUAWEI'
  // #endif
  // #ifdef QUICKAPP-WEBVIEW-UNION
  return 'QUICKAPP-WEBVIEW-UNION'
  // #endif
  // #ifdef QUICKAPP-WEBVIEW
  return 'QUICKAPP-WEBVIEW'
  // #endif
  // #ifdef MP
  return 'MP'
  // #endif
  // #ifdef APP-PLUS-NVUE || APP-NVUE
  return 'APP-NVUE'
  // #endif
};
