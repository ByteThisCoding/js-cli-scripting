import {
    iCliCommandParam,
    iCliCommandParamChoice,
} from "../models/cli-command-param";
import { iCliOutputter } from "../models/cli-outputter";
import { iCliUserInputRequestor } from "../models/cli-user-input-requestor";

export abstract class BaseUserInputRequestor implements iCliUserInputRequestor {

    constructor(
        private cliOutputter: iCliOutputter
    ) {}

    async awaitInput(param: iCliCommandParam): Promise<any> {
        if (param.doRepeat) {
            const results: any = [];
            let isQuerying = true;
            do {
                const thisResult = await this.awaitSingleInput(param);
                if (thisResult) {
                    results.push(thisResult);
                } else {
                    isQuerying = false;
                }
            } while (isQuerying && param.doRepeat(results));
            return results;
        } else {
            return this.awaitSingleInput(param);
        }
    }

    private async awaitSingleInput(param: iCliCommandParam, numAttempts = 0): Promise<any> {
        const input = await this.getInput(
            param.displayText,
            param.defaultValue,
            param.choices
        );
        if (input) {
            return this.parseValidateInput(param, input, numAttempts);
        } else {
            return void 0;
        }
    }

    private parseValidateInput(param: iCliCommandParam, input: string, numAttempts:  number): any {
        let parsed;
        switch (param.type || "string") {
            case "number":
                parsed = this.parseNumber(input);
                break;
            case "boolean":
                parsed = this.parseBoolean(input);
                break;
            default:
                parsed = input.trim();
                break;
        }
        if (param.isValid) {
            const validation = param.isValid(parsed, numAttempts);
            if (validation.isValid) {
                return parsed;
            } else {
                const message = validation.message || `Input is invalid, please try again.`;
                this.cliOutputter.pushWarning(message);
                if (typeof validation.tryAgain === 'undefined' || !validation.tryAgain) {
                    throw new Error(`Input failed`)
                };
                return this.awaitSingleInput(param, numAttempts + 1);
            }
        } else {
            return parsed;
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
