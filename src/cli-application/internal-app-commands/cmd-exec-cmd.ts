import { iCliCommand } from "../../models/cli-command";
import { iCliCommandExecutor } from "../../models/cli-command-executor";
import { iCliCommandParam } from "../../models/cli-command-param";
import { iCliOutputter } from "../../models/cli-outputter";

/**
 * This is an internal command to be used by the application to execute other commands
 */
export class CommandExecutorCommand implements iCliCommand {
    name: string = "_cmd";

    displayText: string = "";

    tokens: string[] = [];

    async getRequiredParams(): Promise<iCliCommandParam[] | null> {
        return [
            {
                name: "cmdNameToken",
                displayText: "Enter the next command to execute",
            },
        ];
    }

    constructor(
        private commands: iCliCommand[],
        private cmdExecutor: iCliCommandExecutor
    ) {}

    async execute(
        userParamsInput: { [key: string]: any },
        cliOutputter: iCliOutputter
    ): Promise<void> {
        const cmdNameToken = userParamsInput.cmdNameToken.toLowerCase();
        const cmd = this.commands.find((cmd) => {
            return (
                cmd.name === cmdNameToken ||
                !!cmd.tokens.find((tkn) => tkn === cmdNameToken)
            );
        });
        if (!cmd) {
            cliOutputter.pushError(
                `There is no command with the name or token ${cmdNameToken}`
            );
            return;
        }

        await this.cmdExecutor.execute(cmd!);
    }
}
