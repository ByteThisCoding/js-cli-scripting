import { iCliCommandParam } from "./cli-command-param";
import { iCliOutputter } from "./cli-outputter";

export interface iCliCommand {
    name: string;
    displayText: string;
    tokens: string[];

    requiredParams?: iCliCommandParam[];

    execute(
        userParamsInput: { [key: string]: any },
        cliOutputter: iCliOutputter
    ): Promise<void>;
}
