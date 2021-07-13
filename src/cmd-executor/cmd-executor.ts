import { iCliOutputter, iCliUserInputRequestor } from "../../public-api";
import { iCliCommand } from "../models/cli-command";
import { iCliCommandExecutor } from "../models/cli-command-executor";

export class CliCommandExecutor implements iCliCommandExecutor {
    constructor(
        private cliOutputter: iCliOutputter,
        private cliUserInputRequestor: iCliUserInputRequestor
    ) {}

    async execute(cliCmd: iCliCommand): Promise<void> {
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

        await cliCmd.execute(paramsInput, this.cliOutputter);
    }
}
