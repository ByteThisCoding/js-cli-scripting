import EventEmitter from "events";
import { EVENTS } from "../../events/events";
import { iCliCommand } from "../../models/cli-command";
import { iCliCommandExecutor } from "../../models/cli-command-executor";
import { iCliCommandParam } from "../../models/cli-command-param";
import { iCliOutputter } from "../../models/cli-outputter";

/**
 * This is an internal command to be used by the application to execute other commands
 */
export class QuitCliCommand implements iCliCommand {
    name: string = "quit";

    displayText: string = "Quit the application.";

    tokens: string[] = ["quit", "q"];

    async getRequiredParams(): Promise<iCliCommandParam[] | null> {
        return null;
    }

    constructor(private eventEmitter: EventEmitter) {}

    async execute(
        userParamsInput: {},
        cliOutputter: iCliOutputter
    ): Promise<void> {
        cliOutputter.pushMessage("Quitting application.");
        this.eventEmitter.emit(EVENTS.quitApp);
    }
}
