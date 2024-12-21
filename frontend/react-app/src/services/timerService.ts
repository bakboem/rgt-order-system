class TimerService {
    private timerId: number | null = null;
    private task: (() => void) | null = null;

    public start(task: () => void, interval: number): void {
      if (this.timerId !== null) {
        this.clear(); // 清理现有定时器
      }
      this.task =task;
      this.timerId = window.setInterval(() => {
        if (this.task) {
          this.task();
        }
      }, interval);
      console.log("Timer started");
    }
  
   
    public clear(): void {
      if (this.timerId !== null) {
        clearInterval(this.timerId);
        this.timerId = null;
        this.task = null;
        console.log("Timer cleared");
      }
    }
  }
  
  const timerService = new TimerService();
  export default timerService;
  