import { iCliCommand } from "../../models/cli-command";
import { iCliCommandExecutor } from "../../models/cli-command-executor";
import { iCliCommandParam } from "../../models/cli-command-param";
import { iCliOutputter } from "../../models/cli-outputter";
import { iCliUserInputRequestor } from "../../models/cli-user-input-requestor";

/**
 * This is an internal command to be used by the application to execute other commands
 */
export class MultiCommandExecutorCommand implements iCliCommand {
    name: string = "_multi_cmd";

    displayText: string = "";
    
    tokens: string[] = [];

    constructor(
        private commands: iCliCommand[],
        private cmdExecutor: iCliCommandExecutor,
        private cliUserInputRequestor: iCliUserInputRequestor
    ) {}
    
    //we need to manually do the work of getting the commands + params
    async execute(userParamsInput: {}, cliOutputter: iCliOutputter): Promise<void> {
        const cmdNameToken = userParamsInput.cmdNameToken.toLowerCase();
        const cmd = this.commands.find(cmd => {
            return cmd.name === cmdNameToken || !!cmd.tokens.find(tkn => tkn === cmdNameToken)
        });
        if (!cmd) {
            cliOutputter.pushError(`There is no command with the name or token ${cmdNameToken}`);
            return;
        }

        await this.cmdExecutor.execute(cmd!);
    }
    
    private async getCmdParams(cliCmd: iCliCommand): Promise<{[key: string]: any}> {
        const paramsInput: any = {};
        const params = cliCmd.requiredParams || [];
        for (let i = 0; i < params.length; i++) {
            const param = params[i];
            const input = await this.cliUserInputRequestor.awaitInput(param);
            if (input[param.name]) {
                throw new Error(
                    `CliCommandExecutor: multiple input params have the same name.`
                );
            }
            paramsInput[param.name] = input;
        }
        return paramsInput;
    }
    
}