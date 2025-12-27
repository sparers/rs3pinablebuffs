export class AsyncLoop {
  private isRunning: boolean = false;
  private timeoutId: ReturnType<typeof setTimeout> | null = null;
  private workload: () => Promise<void>;
  private intervalMs: number;

  constructor(workload: () => Promise<void>, intervalMs: number = 1000) {
    this.workload = workload;
    this.intervalMs = intervalMs;
  }

  public start(): void {
    if (this.isRunning) return;

    this.isRunning = true;
    console.log("Loop execution started.");
    this.run();
  }

  public pause(): void {
    this.isRunning = false;
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    console.log("Loop execution paused.");
  }


  private async run(): Promise<void> {
    if (!this.isRunning) return;

    try {
      await this.workload();
    } catch (error) {
      console.error("AsyncLoop Error:", error);
    } finally {
      if (this.isRunning) {
        this.timeoutId = setTimeout(() => this.run(), this.intervalMs);
      }
    }
  }

  public setInterval(ms: number): void {
    this.intervalMs = ms;
  }

  public get active(): boolean {
    return this.isRunning;
  }
}