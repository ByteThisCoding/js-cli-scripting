import { iCliApplicationOptions } from "./cli-application-options";
import { iCliCommand } from "./cli-command";
import { iCliCommandsCollection } from "./cli-commands-collection";
import { iCliOutputter } from "./cli-outputter";
import { iCliUserInputRequestor } from "./cli-user-input-requestor";
import { RecursivePartial } from "./recursive-partial";

/**
 * This is the main app runner class
 * Inject the options, commands, params, and i/o, and the app will take care of the rest
 */
export interface iCliApplication {
    /**
     * Inject the dependencies and start the app
     * @param options: specify the options in which to run the app
     * @param cliCommandsCollection: provide the collection of commands
     * @param argV: provide an array of input params, such as: Array.from(process.argV).splice(2)
     * @param cliOutputter: inject the cliOutputter for outputting strings and data
     * @param cliUserInputRequestor: inject the cliUserInputRequestor for getting input from the user
     */
    startApp(
        options: RecursivePartial<iCliApplicationOptions>,
        cliCommandsCollection: iCliCommandsCollection,
        argV: string[],
        cliOutputter: iCliOutputter,
        cliUserInputRequestor: iCliUserInputRequestor
    ): Promise<void>;

    /**
     * If the quit is triggered, handle the event
     * Most likely, you will run: program.exit(0)
     * @param callback
     */
    onQuit(callback: () => any): void;

    /**
     * If needed, react to an event that a command is executed
     * @param callback
     */
    onCommand(callback: (cmd: iCliCommand) => any): void;
}
