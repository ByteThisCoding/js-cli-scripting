import { iCliCommand } from "../../models/cli-command";
import { iCliCommandExecutor } from "../../models/cli-command-executor";
import { iCliCommandParam } from "../../models/cli-command-param";
import { iCliOutputter } from "../../models/cli-outputter";

/**
 * This is an internal command to be used by the application to execute other commands
 */
export class ArgvCommandExecutorCommand implements iCliCommand {
    name: string = "_argv_cmd";

    displayText: string = "";
    
    tokens: string[] = [];

    constructor(
        private commands: iCliCommand[],
        private args: string[]
    ) {}
    
    async execute(userParamsInput: {}, cliOutputter: iCliOutputter): Promise<void> {
        const cmdNameToken = this.args[0].toLowerCase();
        const cmd = this.commands.find(cmd => {
            return cmd.name === cmdNameToken || !!cmd.tokens.find(tkn => tkn === cmdNameToken)
        });
        
        if (!cmd) {
            cliOutputter.pushError(`There is no command with the name or token ${cmdNameToken}`);
            return;
        }

        const userInput = this.args.reduce((obj, arg, index) => {
            if (index === 0) {
                return obj;
            }

            if (arg.substring(0, 2) === "--") {
                arg = arg.substring(2);
            }
            const eqInd = arg.indexOf("=");
            if (eqInd === -1) {
                obj[arg] = "";
            } else {
                obj[arg.substring(0, eqInd)] = arg.substring(eqInd + 1);
            }

            return obj;

        }, {} as any);

        await cmd.execute(userInput, cliOutputter);
    }
    
}