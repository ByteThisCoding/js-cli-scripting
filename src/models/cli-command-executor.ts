import { iCliCommand } from "./cli-command";

export interface iCliCommandExecutor {
    execute(cliCmd: iCliCommand): Promise<void>;
}
