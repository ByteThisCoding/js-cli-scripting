import { iCliCommand } from "./cli-command";
import { iCliCommandExecutor } from "./cli-command-executor";
import { iCliCommandsCollection } from "./cli-commands-collection";
import { iCliOutputter } from "./cli-outputter";
import { iCliUserInputRequestor } from "./cli-user-input-requestor";
import { RecursivePartial } from "./recursive-partial";

export interface iCliApplicationOptions {
    appendDefaultCommands: boolean;
    startup: {
        initialOutput: string;
        outputCommandsTexts: boolean;
        acceptArgv: boolean;
    };
    loop: {
        outputCommandsTexts: boolean;
    };
}

export interface iCliApplication {
    startApp(
        options: RecursivePartial<iCliApplicationOptions>,
        cliCommandsCollection: iCliCommandsCollection,
        argV: string[],
        cliOutputter: iCliOutputter,
        cliUserInputRequestor: iCliUserInputRequestor
    ): Promise<void>;
}
