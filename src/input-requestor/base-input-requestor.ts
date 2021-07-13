import {
    iCliCommandParam,
    iCliCommandParamChoice,
} from "../models/cli-command-param";
import { iCliUserInputRequestor } from "../models/cli-user-input-requestor";

export abstract class BaseUserInputRequestor implements iCliUserInputRequestor {
    async awaitInput(param: iCliCommandParam): Promise<any> {
        const input = await this.getInput(
            param.displayText,
            param.defaultValue,
            param.choices
        );
        switch (param.type || "string") {
            case "number":
                return this.parseNumber(input);
            case "boolean":
                return this.parseBoolean(input);
            default:
                return input.trim();
        }
    }

    protected abstract getInput(
        displayText: string,
        defaultValue?: string,
        choices?: iCliCommandParamChoice[]
    ): Promise<string>;

    private parseNumber(input: string): number {
        const result = parseFloat(input);
        if (isNaN(result)) {
            throw new Error(
                `UserInputRequestor.parseNumber: input evaluates to NaN`
            );
        }
        return result;
    }

    private parseBoolean(input: string): boolean {
        switch (input.toLowerCase().trim()) {
            case "y":
            case "yes":
            case "true":
            case "t":
            case "1":
                return true;
            case "n":
            case "no":
            case "false":
            case "f":
            case "0":
                return false;
            default:
                throw new Error(
                    `UserInputRequestor.parseBoolean: could not determine truthyness from input`
                );
        }
    }
}
