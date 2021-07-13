import { iCliCommand } from "../models/cli-command";
import { iCliCommandsCollection } from "../models/cli-commands-collection";

/**
 * Simple version which returns an input array with no further action
 */
export class ArrayCliCommandsCollection implements iCliCommandsCollection {

    constructor(
        private cliCommands: iCliCommand[]
    ) {}

    async getCommands(): Promise<iCliCommand[]> {
        return this.cliCommands;
    }
    
}