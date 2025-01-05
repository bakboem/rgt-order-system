class TabVisibilityService {
  private handleVisible: () => void;
  private handleHidden: () => void;
  private handleUserActive: () => void;
  private handleUserInactive: () => void;
  private isTabVisible: boolean = false;
  private isWindowFocused: boolean = false;
  private activityTimeout: ReturnType<typeof setTimeout> | null = null;
  private readonly INACTIVITY_THRESHOLD: number = 1800000; // 3分钟无操作视为非活动

  constructor(
    handleVisible: () => void,
    handleHidden: () => void,
    handleUserActive: () => void,
    handleUserInactive: () => void
  ) {
    this.handleVisible = handleVisible;
    this.handleHidden = handleHidden;
    this.handleUserActive = handleUserActive;
    this.handleUserInactive = handleUserInactive;
  }

  // 注册事件
  public register(): void {
    const visibilityChangeHandler = () => {
      if (document.visibilityState === "visible") {
        this.isTabVisible = true;
        this.handleVisible();
      } else if (document.visibilityState === "hidden") {
        this.isTabVisible = false;
        this.handleHidden();
      }
    };

    const focusHandler = () => {
      this.isWindowFocused = true;
      this.handleVisible(); // 当窗口获取焦点时也触发可见逻辑
    };

    const blurHandler = () => {
      this.isWindowFocused = false;
      this.handleHidden(); // 当窗口失去焦点时也触发隐藏逻辑
    };

    const activityHandler = () => {
      if (this.activityTimeout) {
        clearTimeout(this.activityTimeout);
      }
      this.handleUserActive();
      this.activityTimeout = setTimeout(() => {
        this.handleUserInactive(); // 一段时间无操作，视为非活动
      }, this.INACTIVITY_THRESHOLD);
    };

    // 事件绑定
    (this as any)._visibilityChangeHandler = visibilityChangeHandler;
    (this as any)._focusHandler = focusHandler;
    (this as any)._blurHandler = blurHandler;
    (this as any)._activityHandler = activityHandler;

    document.addEventListener("visibilitychange", visibilityChangeHandler);
    window.addEventListener("focus", focusHandler);
    window.addEventListener("blur", blurHandler);
    window.addEventListener("mousemove", activityHandler);
    window.addEventListener("keydown", activityHandler);
  }

  // 注销事件
  public unregister(): void {
    const visibilityChangeHandler = (this as any)._visibilityChangeHandler;
    const focusHandler = (this as any)._focusHandler;
    const blurHandler = (this as any)._blurHandler;
    const activityHandler = (this as any)._activityHandler;

    if (visibilityChangeHandler) {
      document.removeEventListener("visibilitychange", visibilityChangeHandler);
    }
    if (focusHandler) {
      window.removeEventListener("focus", focusHandler);
    }
    if (blurHandler) {
      window.removeEventListener("blur", blurHandler);
    }
    if (activityHandler) {
      window.removeEventListener("mousemove", activityHandler);
      window.removeEventListener("keydown", activityHandler);
    }

    if (this.activityTimeout) {
      clearTimeout(this.activityTimeout);
    }
  }
}

export default TabVisibilityService;
