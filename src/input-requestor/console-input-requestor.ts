import {
    iCliCommandParam,
    iCliCommandParamChoice,
} from "../models/cli-command-param";
import { BaseUserInputRequestor } from "./base-input-requestor";
const { prompt } = require("enquirer");

export class ConsoleUserInputRequestor extends BaseUserInputRequestor {
    protected getInput(
        displayText: string,
        defaultValue?: string,
        choices?: iCliCommandParamChoice[]
    ): Promise<string> {
        if (choices && choices.length > 0) {
            return this.awaitSelectOption(displayText, choices, defaultValue);
        } else {
            return this.awaitString(displayText, defaultValue);
        }
    }

    private async awaitString(
        message: string,
        initialValue: string = ""
    ): Promise<string> {
        return prompt({
            type: "input",
            name: "value",
            message,
            initial: initialValue,
            answer: initialValue,
        }).then((response: any) => response.value);
    }

    async awaitSelectOption(
        question: string,
        options: iCliCommandParamChoice[],
        initialValue: string = ""
    ): Promise<string> {
        let promptOptions: any = {
            type: "select",
            name: "value",
            message: question,
            choices: this.mapChoices(options),
            answer: initialValue,
        };

        return prompt(promptOptions).then((response: any) => response.value);
    }

    private mapChoices(
        choices: iCliCommandParamChoice[]
    ): { name: string; message: string; value: string }[] {
        return choices.map((item) => {
            return {
                name: item.name,
                message: item.displayText || item.displayText,
                value: item.name,
            };
        });
    }
}
