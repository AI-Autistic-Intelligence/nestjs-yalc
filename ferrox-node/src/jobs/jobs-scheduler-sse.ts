import * as http from 'http';

export interface FerroxJob<T = any> {
  id: string;
  name: string;
  payload: T;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  error?: string;
}

export class FerroxJobQueue {
  private queue: FerroxJob[] = [];
  private handlers: Map<string, (payload: any) => Promise<any>> = new Map();

  public registerWorker(jobName: string, handler: (payload: any) => Promise<any>): void {
    this.handlers.set(jobName, handler);
  }

  public enqueue<T>(jobName: string, payload: T): FerroxJob<T> {
    const job: FerroxJob<T> = {
      id: `job_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      name: jobName,
      payload,
      status: 'PENDING',
    };
    this.queue.push(job);
    setImmediate(() => this.processNext());
    return job;
  }

  private async processNext(): Promise<void> {
    const pendingJob = this.queue.find((j) => j.status === 'PENDING');
    if (!pendingJob) return;

    const handler = this.handlers.get(pendingJob.name);
    if (!handler) {
      pendingJob.status = 'FAILED';
      pendingJob.error = `No worker registered for job name: ${pendingJob.name}`;
      return;
    }

    pendingJob.status = 'PROCESSING';
    try {
      await handler(pendingJob.payload);
      pendingJob.status = 'COMPLETED';
    } catch (err: any) {
      pendingJob.status = 'FAILED';
      pendingJob.error = err.message;
    }
  }
}

export class FerroxCronScheduler {
  private tasks: Map<string, NodeJS.Timeout> = new Map();

  public scheduleTask(name: string, intervalMs: number, task: () => Promise<void> | void): void {
    if (this.tasks.has(name)) {
      clearInterval(this.tasks.get(name)!);
    }

    const timer = setInterval(async () => {
      try {
        await task();
      } catch (err: any) {
        console.error(`Cron task [${name}] error:`, err.message);
      }
    }, intervalMs);

    this.tasks.set(name, timer);
  }

  public stopTask(name: string): void {
    if (this.tasks.has(name)) {
      clearInterval(this.tasks.get(name)!);
      this.tasks.delete(name);
    }
  }
}

export class FerroxSseStream {
  public static initSseResponse(res: http.ServerResponse): void {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    });
  }

  public static sendEvent(res: http.ServerResponse, event: string, data: any): void {
    res.write(`event: ${event}\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  }
}
