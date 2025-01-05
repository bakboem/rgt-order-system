class TimerService {
    private timerId: number | null = null; // Holds the ID of the periodic timer
    private task: (() => void) | null = null; // Stores the periodic task
    private oneTimeTasks: Map<number, (() => void)> = new Map(); // Manages one-time tasks with their IDs
  
    /**
     * Starts the periodic timer with a specified task and interval.
     * 
     * @param task - The task to be executed periodically
     * @param interval - The time interval in milliseconds
     */
    public start(task: () => void, interval: number): void {
      if (this.timerId !== null) {
        this.clear(); // Clear any existing timer before starting a new one
      }
      this.task = task; // Assign the task to be executed
      this.timerId = window.setInterval(() => {
        if (this.task) {
          this.task(); // Execute the task periodically
        }
      }, interval);
      console.log("Periodic timer started");
    }
  
    /**
     * Runs a task once after a specified delay.
     * 
     * @param task - The task to be executed once
     * @param delay - The delay in milliseconds before the task executes
     * @returns The task ID, which can be used to cancel the task
     */
    public runOnce(task: () => void, delay: number): number {
      const timeoutId = window.setTimeout(() => {
        task(); // Execute the task
        this.oneTimeTasks.delete(timeoutId); // Remove the task from the map after execution
        console.log("One-time task executed and cleared");
      }, delay);
  
      this.oneTimeTasks.set(timeoutId, task); // Store the task for cancellation
      console.log(`Scheduled a one-time task to run after ${delay}ms, ID: ${timeoutId}`);
      return timeoutId;
    }
  
    /**
     * Cancels a one-time task by its ID.
     * 
     * @param taskId - The ID of the task to cancel
     * @returns True if the task was canceled successfully, false otherwise
     */
    public cancelRunOnce(taskId: number): boolean {
      if (this.oneTimeTasks.has(taskId)) {
        clearTimeout(taskId); // Clear the timeout
        this.oneTimeTasks.delete(taskId); // Remove the task from the map
        console.log(`One-time task with ID ${taskId} canceled`);
        return true;
      }
      console.warn(`No one-time task found with ID ${taskId}`);
      return false;
    }
  
    /**
     * Clears the periodic timer and resets its state.
     */
    public clear(): void {
      if (this.timerId !== null) {
        clearInterval(this.timerId); // Clear the interval
        this.timerId = null; // Reset the timer ID
        this.task = null; // Clear the stored task
        console.log("Periodic timer cleared");
      }
      if (this.oneTimeTasks.size>0) {
        this.oneTimeTasks.forEach((task, taskId) => {
            clearTimeout(taskId); // Clear the timeout
            this.oneTimeTasks.delete(taskId); // Remove the task from the map
        });
      }
    }
  }
  
  const timerService = new TimerService(); // Create an instance of TimerService
  export default timerService; // Export the TimerService instance
  