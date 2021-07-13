import { iCliCommand } from "./cli-command";

export interface iCliCommandsCollection {

    getCommands(): Promise<iCliCommand[]>;

}