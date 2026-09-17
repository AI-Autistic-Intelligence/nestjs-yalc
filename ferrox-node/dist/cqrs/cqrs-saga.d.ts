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
export declare class CqrsEngine {
    private commandHandlers;
    private queryHandlers;
    registerCommandHandler(commandType: string, handler: CommandHandler): void;
    registerQueryHandler(queryType: string, handler: QueryHandler): void;
    executeCommand<T = any>(command: ICommand): Promise<T>;
    executeQuery<T = any>(query: IQuery): Promise<T>;
}
export interface SagaStep {
    name: string;
    action: () => Promise<any>;
    compensation: () => Promise<void>;
}
export declare class SagaOrchestrator {
    private steps;
    addStep(step: SagaStep): this;
    execute(): Promise<{
        success: boolean;
        executedSteps: string[];
        error?: string;
    }>;
    private rollback;
}
