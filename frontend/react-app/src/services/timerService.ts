class TimerService {
  private timerId: number | null = null; // Holds the ID of the timer / 타이머 ID를 저장
  private task: (() => void) | null = null; // Stores the task to be executed / 실행할 작업을 저장

  /**
   * Starts the timer with a specified task and interval.
   * 지정된 작업과 간격으로 타이머를 시작합니다.
   * 
   * @param task - The task to be executed at each interval / 각 간격마다 실행할 작업
   * @param interval - The time interval in milliseconds / 밀리초 단위의 간격
   */
  public start(task: () => void, interval: number): void {
      if (this.timerId !== null) {
          this.clear(); // Clear any existing timer before starting a new one / 새로운 타이머를 시작하기 전에 기존 타이머를 정리합니다.
      }
      this.task = task; // Assign the task to be executed / 실행할 작업을 할당합니다.
      this.timerId = window.setInterval(() => {
          if (this.task) {
              this.task(); // Execute the task at each interval / 각 간격마다 작업을 실행합니다.
          }
      }, interval);
      console.log("Timer started"); // Log timer start / 타이머 시작 로그
  }

  /**
   * Clears the active timer and resets its state.
   * 활성 타이머를 정리하고 상태를 초기화합니다.
   */
  public clear(): void {
      if (this.timerId !== null) {
          clearInterval(this.timerId); // Clear the interval / 간격을 정리합니다.
          this.timerId = null; // Reset the timer ID / 타이머 ID를 초기화합니다.
          this.task = null; // Clear the stored task / 저장된 작업을 제거합니다.
          console.log("Timer cleared"); // Log timer clear / 타이머 정리 로그
      }
  }
}

const timerService = new TimerService(); // Create an instance of TimerService / TimerService 인스턴스 생성
export default timerService; // Export the TimerService instance / TimerService 인스턴스를 내보냅니다.
