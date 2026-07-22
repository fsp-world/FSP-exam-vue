/**
 * 浏览器兼容性检测
 * 检测浏览器类型和版本，不满足最低要求则跳转到错误页面
 */

interface BrowserInfo {
  name: string;
  version: number;
  fullVersion: string;
  isQQBrowser: boolean;
  isWeChat: boolean;
  isUCBrowser: boolean;
}

/** 最低版本要求 */
const MIN_VERSIONS: Record<string, number> = {
  Chrome: 80,
  Firefox: 80,
  Safari: 14,
  Edge: 80,
  Opera: 67,
};

/** 不受支持的浏览器列表 */
const BLOCKED_BROWSERS = ['QQBrowser', 'UCBrowser', 'WeChat'];

function parseUA(ua: string): BrowserInfo {
  const info: BrowserInfo = {
    name: 'Unknown',
    version: 0,
    fullVersion: '0',
    isQQBrowser: false,
    isWeChat: false,
    isUCBrowser: false,
  };

  // QQ 内置浏览器 (必须最先检测，因为它的 UA 可能也包含 Chrome/Chromium 关键字)
  // 手机版: MQQBrowser/... 或 MQQBrowser/Mini/...
  // 桌面版: QQBrowser/...
  const qqMatch = ua.match(/(?:MQQBrowser(?:\/Mini)?|QQBrowser)\/([\d.]+)/);
  if (qqMatch) {
    info.name = 'QQBrowser';
    info.fullVersion = qqMatch[1];
    info.version = parseFloat(qqMatch[1]);
    info.isQQBrowser = true;
    return info;
  }

  // 微信内置浏览器
  if (/MicroMessenger/i.test(ua)) {
    info.name = 'WeChat';
    info.isWeChat = true;
    const wxMatch = ua.match(/MicroMessenger\/([\d.]+)/);
    if (wxMatch) {
      info.fullVersion = wxMatch[1];
      info.version = parseFloat(wxMatch[1]);
    }
    return info;
  }

  // UC 浏览器
  const ucMatch = ua.match(/UCBrowser\/([\d.]+)/);
  if (ucMatch) {
    info.name = 'UCBrowser';
    info.fullVersion = ucMatch[1];
    info.version = parseFloat(ucMatch[1]);
    info.isUCBrowser = true;
    return info;
  }

  // Edge (基于 Chromium 的新 Edge)
  const edgeMatch = ua.match(/Edg\/([\d.]+)/);
  if (edgeMatch) {
    info.name = 'Edge';
    info.fullVersion = edgeMatch[1];
    info.version = parseFloat(edgeMatch[1]);
    return info;
  }

  // Firefox
  const firefoxMatch = ua.match(/Firefox\/([\d.]+)/);
  if (firefoxMatch) {
    info.name = 'Firefox';
    info.fullVersion = firefoxMatch[1];
    info.version = parseFloat(firefoxMatch[1]);
    return info;
  }

  // Safari — Safari 的 UA 通常包含 "Safari" 但不包含 "Chrome"，且包含 "Version/xxx"
  // 注意：Chrome 的 UA 也包含 "Safari"，所以要先排除 Chrome
  if (ua.includes('Safari') && !ua.includes('Chrome')) {
    const safariMatch = ua.match(/Version\/([\d.]+)/);
    if (safariMatch) {
      info.name = 'Safari';
      info.fullVersion = safariMatch[1];
      info.version = parseFloat(safariMatch[1]);
      return info;
    }
  }

  // Opera
  const operaMatch = ua.match(/(?:OPR|Opera)\/([\d.]+)/);
  if (operaMatch) {
    info.name = 'Opera';
    info.fullVersion = operaMatch[1];
    info.version = parseFloat(operaMatch[1]);
    return info;
  }

  // Chrome / Chromium
  const chromeMatch = ua.match(/Chrome\/([\d.]+)/);
  if (chromeMatch) {
    info.name = 'Chrome';
    info.fullVersion = chromeMatch[1];
    info.version = parseFloat(chromeMatch[1]);
    return info;
  }

  return info;
}

export interface BrowserCheckResult {
  /** 是否通过检测 */
  pass: boolean;
  /** 浏览器信息 */
  browser: BrowserInfo;
  /** 错误消息（不通过时提供） */
  message: string;
}

/**
 * 执行浏览器兼容性检查
 */
export function checkBrowser(): BrowserCheckResult {
  const ua = navigator.userAgent;
  const browser = parseUA(ua);

  // 1. 检查是否被封锁（QQ 内置浏览器等）
  if (BLOCKED_BROWSERS.includes(browser.name)) {
    const blockedMessages: Record<string, string> = {
      QQBrowser:
        '您正在使用的 QQ 内置浏览器不兼容本站点，请使用 Chrome、Edge 或 Firefox 等现代浏览器访问。',
      UCBrowser:
        '您正在使用的 UC 浏览器可能存在兼容性问题，请使用 Chrome、Edge 或 Firefox 等现代浏览器访问。',
      WeChat:
        '微信内置浏览器不支持访问本站点，请使用 Chrome、Edge 或 Firefox 等现代浏览器访问。',
    };
    return {
      pass: false,
      browser,
      message:
        blockedMessages[browser.name] || `不支持的浏览器: ${browser.name}`,
    };
  }

  // 2. 检查版本是否满足最低要求
  const minVersion = MIN_VERSIONS[browser.name];
  if (minVersion && browser.version < minVersion) {
    return {
      pass: false,
      browser,
      message: `您的 ${browser.name} 浏览器版本过低（${browser.fullVersion}），请升级至 ${browser.name} ${minVersion}+ 或使用其他现代浏览器访问。`,
    };
  }

  // 3. 未知浏览器 - 提示但不阻止
  if (browser.name === 'Unknown') {
    return {
      pass: true,
      browser,
      message: '',
    };
  }

  return {
    pass: true,
    browser,
    message: '',
  };
}

/**
 * 在应用挂载前执行检查，不通过则跳转错误页
 * @returns true=通过, false=不通过
 */
export function checkBrowserBeforeMount(): boolean {
  // 如果已经在 error 页面，不再重定向，避免死循环
  if (window.location.pathname === '/error') {
    return true;
  }

  const result = checkBrowser();
  if (!result.pass) {
    const errorUrl = `/error?message=${encodeURIComponent(result.message)}&code=BROWSER`;
    window.location.href = errorUrl;
    return false;
  }
  return true;
}
