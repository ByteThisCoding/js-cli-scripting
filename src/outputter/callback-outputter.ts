import { iCliCommand } from "../models/cli-command";
import { iCliOutputter } from "../models/cli-outputter";

export class CallbackCliOutputter implements iCliOutputter {
    static events = {
        pushCommandsDescriptionsOutput: "pushCommandsDescriptionsOutput",
        pushDebug: "pushDebug",
        pushError: "pushError",
        pushMessage: "pushMessage",
        pushWarning: "pushWarning",
        clearVisibleOutput: "clearVisibleOutput",
    };

    constructor(private callback: (eventType: string, params: any[]) => void) {}

    pushDebug(level: number, ...params: any[]): void {
        this.callback(CallbackCliOutputter.events.pushDebug, [
            level,
            ...params,
        ]);
    }
    pushMessage(...params: any[]): void {
        this.callback(CallbackCliOutputter.events.pushMessage, [...params]);
    }
    pushWarning(...params: any[]): void {
        this.callback(CallbackCliOutputter.events.pushWarning, [...params]);
    }
    pushError(...params: any[]): void {
        this.callback(CallbackCliOutputter.events.pushError, [...params]);
    }
    pushCommandsDescriptionsOutput(commands: iCliCommand[]): void {
        this.callback(
            CallbackCliOutputter.events.pushCommandsDescriptionsOutput,
            [commands]
        );
    }
    clearVisibleOutput(): void {
        this.callback(CallbackCliOutputter.events.clearVisibleOutput, []);
    }
}
