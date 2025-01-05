import timerService from "./timerService";

class TabVisibilityService {
    private handleVisible: () => void;
    private handleHidden: () => void;
    private onTaskID: number | null= null;
  
    constructor(handleVisible: () => void, handleHidden: () => void) {
      this.handleVisible = handleVisible;
      this.handleHidden = handleHidden;
    }
  
    // 注册事件
    public register(): void {
      const visibilityChangeHandler = () => {
        const interval = 120000;
        if (document.visibilityState === "visible" && this.onTaskID!=null) {
          timerService.cancelRunOnce(this.onTaskID);
          this.handleVisible();
          
        } else if (document.visibilityState === "hidden") {
          if (this.onTaskID != null) {
              timerService.cancelRunOnce(this.onTaskID);
          }
          this.onTaskID =   timerService.runOnce(()=>{
              this.handleHidden();
          },interval)
        }
      };
      (this as any)._visibilityChangeHandler = visibilityChangeHandler;
      document.addEventListener("visibilitychange", visibilityChangeHandler);
    }
  
    // 注销事件
    public unregister(): void {
      const visibilityChangeHandler = (this as any)._visibilityChangeHandler;
      if (visibilityChangeHandler) {
        document.removeEventListener("visibilitychange", visibilityChangeHandler);
      }
      if (this.onTaskID != null) {
        timerService.cancelRunOnce(this.onTaskID);
        this.onTaskID = null; // 清理任务 ID
      }
    }
  }
  
  export default TabVisibilityService