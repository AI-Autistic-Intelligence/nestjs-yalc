export type EventType = 'EventType';
export declare const EventType: "EventType";
export interface IUtilsProperties {
    base: string;
    all: string;
}
type ActionValues = {
    [key: string]: 'EventType' | Record<string, 'EventType'>;
};
export type Events<Actions extends ActionValues | unknown> = {
    [K in keyof Actions]: {
        [L in keyof Actions[K]]: Actions[K][L] extends 'EventType' ? string : never;
    } & IUtilsProperties;
} & IUtilsProperties;
export declare abstract class EventNameBuilder {
    static version: IUtilsProperties;
    static $: Events<unknown>;
    static events<Actions extends ActionValues>(domain: string, actions: Actions): Events<Actions>;
}
export {};
