import { iCliCommand } from "../../models/cli-command";
import { iCliCommandParam } from "../../models/cli-command-param";
import { iCliOutputter } from "../../models/cli-outputter";

export class ClearScreenCmd implements iCliCommand {
    name: string = "Clear Output";
    displayText: string = "Clear the visible output";
    tokens: string[] = ["c-o", "cls", "clear"];

    async getRequiredParams(): Promise<iCliCommandParam[] | null> {
        return null;
    }
    async execute(userParamsInput: { [key: string]: any; }, cliOutputter: iCliOutputter): Promise<void> {
        cliOutputter.clearVisibleOutput();
    }
    
}