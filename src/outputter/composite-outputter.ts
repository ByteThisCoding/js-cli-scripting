import { iCliCommand } from "../models/cli-command";
import { iCliOutputter } from "../models/cli-outputter";

export class CompositeCliOutputter implements iCliOutputter {

    constructor(
        private cliOutputters: iCliOutputter[]
    ) {}

    pushDebug(level: number, ...params: any[]): void {
        this.cliOutputters.forEach(co => co.pushDebug(level, ...params));
    }
    pushMessage(...params: any[]): void {
        this.cliOutputters.forEach(co => co.pushMessage(params));
    }
    pushWarning(...params: any[]): void {
        this.cliOutputters.forEach(co => co.pushWarning(params));
    }
    pushError(...params: any[]): void {
        this.cliOutputters.forEach(co => co.pushError(params));
    }
    pushCommandsDescriptionsOutput(commands: iCliCommand[]): void {
        this.cliOutputters.forEach(co => co.pushCommandsDescriptionsOutput(commands));
    }
    clearVisibleOutput(): void {
        this.cliOutputters.forEach(co => co.clearVisibleOutput());
    }
    
} 