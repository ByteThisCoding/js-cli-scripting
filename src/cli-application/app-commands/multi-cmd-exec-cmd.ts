import { iCliCommand } from "../../models/cli-command";
import { iCliCommandExecutor } from "../../models/cli-command-executor";
import { iCliCommandParam } from "../../models/cli-command-param";
import { iCliOutputter } from "../../models/cli-outputter";
import { iCliUserInputRequestor } from "../../models/cli-user-input-requestor";
import * as EventEmitter from "events";
import { EVENTS } from "../../events/events";

/**
 * This is an internal command to be used by the application to execute other commands
 */
export class MultiCommandExecutorCommand implements iCliCommand {
    name: string = "Multi-Cmd";

    displayText: string = "Execute multiple commands in sequence";

    tokens: string[] = ["multi-cmd", "m-c"];

    constructor(
        private commands: iCliCommand[],
        private cliUserInputRequestor: iCliUserInputRequestor,
        private eventEmitter: EventEmitter
    ) {}

    async getRequiredParams(): Promise<iCliCommandParam[] | null> {
        return null;
    }

    //we need to manually do the work of getting the commands + params
    async execute(
        userParamsInput: {},
        cliOutputter: iCliOutputter
    ): Promise<void> {
        let isGettingInput = true;
        const cmdNameParams: {
            cmd: iCliCommand;
            params: { [key: string]: any };
        }[] = [];
        while (isGettingInput) {
            const cmd = await this.getCmd(cliOutputter);
            if (!cmd) {
                isGettingInput = false;
            } else {
                try {
                    const params = await this.getParamsForCmd(cmd);
                    cmdNameParams.push({ cmd, params });
                } catch (err) {
                    cliOutputter.pushError(`Error:`, err.toString());
                    cliOutputter.pushWarning(
                        `Could not get command params, so skipping`
                    );
                    isGettingInput = false;
                }
            }
        }

        //execute all
        for (let i = 0; i < cmdNameParams.length; i++) {
            const cmdNameParam = cmdNameParams[i];
            await cmdNameParam.cmd.execute(cmdNameParam.params, cliOutputter);
            this.eventEmitter.emit(EVENTS.cmdExecuted, cmdNameParam.cmd);
        }
    }

    private async getCmd(
        cliOutputter: iCliOutputter
    ): Promise<iCliCommand | undefined> {
        let cmd: iCliCommand | undefined;
        //set the value within the closure
        await this.cliUserInputRequestor
            .awaitInput({
                name: "cmdToken",
                displayText: "Multi-Cmd: Enter the next command to execute",
                isValid: (cmdNameToken: string) => {
                    if (!cmdNameToken) {
                        return { isValid: true };
                    }
                    cmd = this.commands.find((cmd) => {
                        return (
                            cmd.name === cmdNameToken ||
                            !!cmd.tokens.find((tkn) => tkn === cmdNameToken)
                        );
                    })!;
                    if (!cmd) {
                        return {
                            isValid: false,
                            message: `There is no command with the name or token ${cmdNameToken}`,
                            tryAgain: true,
                        };
                    } else {
                        return { isValid: true };
                    }
                },
            })
            .catch((err) => {
                cliOutputter.pushError(
                    `Error in getting command:`,
                    err.toString()
                );
                cliOutputter.pushWarning(`Could not get command, so skipping.`);
            });
        return cmd;
    }

    private async getParamsForCmd(
        cliCmd: iCliCommand
    ): Promise<{ [key: string]: any }> {
        const paramsInput: any = {};
        const params = (await cliCmd.getRequiredParams()) || [];
        for (let i = 0; i < params.length; i++) {
            const param = params[i];
            const input = await this.cliUserInputRequestor.awaitInput(param);
            if (paramsInput[param.name]) {
                throw new Error(
                    `CliCommandExecutor: multiple input params have the same name.`
                );
            }
            paramsInput[param.name] = input;
        }

        return paramsInput;
    }
}
