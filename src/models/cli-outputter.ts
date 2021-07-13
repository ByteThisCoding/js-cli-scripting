import { iCliCommand } from "./cli-command";

export interface iCliOutputter {
    pushDebug(level: number, ...params: any[]): void;

    pushMessage(...params: any[]): void;

    pushWarning(...params: any[]): void;

    pushError(...params: any[]): void;

    pushCommandsDescriptionsOutput(commands: iCliCommand[]): void;

    clearVisibleOutput(): void;
}
