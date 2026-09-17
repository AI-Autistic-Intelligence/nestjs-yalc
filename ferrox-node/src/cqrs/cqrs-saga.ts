export interface ICommand {
  type: string;
  payload: any;
}

export interface IQuery {
  type: string;
  params: any;
}

export type CommandHandler<T = any> = (command: ICommand) => Promise<T>;
export type QueryHandler<T = any> = (query: IQuery) => Promise<T>;

export class CqrsEngine {
  private commandHandlers: Map<string, CommandHandler> = new Map();
  private queryHandlers: Map<string, QueryHandler> = new Map();

  public registerCommandHandler(commandType: string, handler: CommandHandler): void {
    this.commandHandlers.set(commandType, handler);
  }

  public registerQueryHandler(queryType: string, handler: QueryHandler): void {
    this.queryHandlers.set(queryType, handler);
  }

  public async executeCommand<T = any>(command: ICommand): Promise<T> {
    const handler = this.commandHandlers.get(command.type);
    if (!handler) {
      throw new Error(`No CommandHandler registered for command type: ${command.type}`);
    }
    return await handler(command);
  }

  public async executeQuery<T = any>(query: IQuery): Promise<T> {
    const handler = this.queryHandlers.get(query.type);
    if (!handler) {
      throw new Error(`No QueryHandler registered for query type: ${query.type}`);
    }
    return await handler(query);
  }
}

export interface SagaStep {
  name: string;
  action: () => Promise<any>;
  compensation: () => Promise<void>;
}

export class SagaOrchestrator {
  private steps: SagaStep[] = [];

  public addStep(step: SagaStep): this {
    this.steps.push(step);
    return this;
  }

  public async execute(): Promise<{ success: boolean; executedSteps: string[]; error?: string }> {
    const executedSteps: string[] = [];

    for (let i = 0; i < this.steps.length; i++) {
      const step = this.steps[i];
      try {
        await step.action();
        executedSteps.push(step.name);
      } catch (err: any) {
        console.error(`Saga step [${step.name}] failed. Triggering compensation rollback...`, err.message);
        await this.rollback(i - 1);
        return {
          success: false,
          executedSteps,
          error: `Saga step [${step.name}] failed: ${err.message}`,
        };
      }
    }

    return { success: true, executedSteps };
  }

  private async rollback(fromIndex: number): Promise<void> {
    for (let i = fromIndex; i >= 0; i--) {
      const step = this.steps[i];
      try {
        await step.compensation();
      } catch (compErr: any) {
        console.error(`Compensation for step [${step.name}] failed:`, compErr.message);
      }
    }
  }
}
