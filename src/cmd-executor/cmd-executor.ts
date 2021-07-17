import { iCliOutputter, iCliUserInputRequestor } from "../../public-api";
import { iCliCommand } from "../models/cli-command";
import { iCliCommandExecutor } from "../models/cli-command-executor";

export class CliCommandExecutor implements iCliCommandExecutor {
    constructor(
        private cliOutputter: iCliOutputter,
        private cliUserInputRequestor: iCliUserInputRequestor
    ) {}

    async execute(cliCmd: iCliCommand): Promise<void> {
        try {
            const paramsInput = await this.getParams(cliCmd);
            await cliCmd.execute(paramsInput, this.cliOutputter);
        } catch (err) {
            this.cliOutputter.pushError(
                `Could not execute command:`,
                err.toString()
            );
        }
    }

    private async getParams(
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
