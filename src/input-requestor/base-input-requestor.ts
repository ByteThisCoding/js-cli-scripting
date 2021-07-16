import {
    iCliCommandParam,
    iCliCommandParamChoice,
} from "../models/cli-command-param";
import { iCliOutputter } from "../models/cli-outputter";
import { iCliUserInputRequestor } from "../models/cli-user-input-requestor";

export abstract class BaseUserInputRequestor implements iCliUserInputRequestor {
    constructor(protected cliOutputter: iCliOutputter) { }

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

    protected async awaitSingleInput(
        param: iCliCommandParam,
        numAttempts = 0
    ): Promise<any> {
        let input: string | boolean;
        if (param.type && param.type === 'boolean') {
            input = await this.getBoolean(
                param.displayText,
                this.parseBoolean(param.defaultValue || false)
            );
            return input;
        } else {
            input = await this.getInput(
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
    }

    protected parseValidateInput(
        param: iCliCommandParam,
        input: string,
        numAttempts: number
    ): any {
        let parsed;

        const isValidDecorator = (err: any, callback?: (parsed: any, numAttempts: number) => { isValid: boolean; message?: string; tryAgain?: boolean; }): ((parsed: any, numAttempts: number) => { isValid: boolean; message?: string; tryAgain?: boolean; }) => {
            if (err) {
                return (parsed: any, numAttempts: number) => ({
                    isValid: false,
                    message: 'Error processing user input: ' + err.toString(),
                    tryAgain: true
                });
            } else if (callback) {
                return (parsed: any, numAttempts: number) => {
                    try {
                        return callback(parsed, numAttempts);
                    } catch (err) {
                        return {
                            isValid: false,
                            message: err.toString(),
                            tryAgain: true
                        };
                    }
                }
            } else {
                return (parsed: any, numAttempts: number) => ({
                    isValid: true
                });
            }
        }

        let error = null;
        try {
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
        } catch (err) {
            error = err;
        }
        const decorated = isValidDecorator(error, param.isValid);
        const validation = decorated(parsed, numAttempts);
        if (validation.isValid) {
            return parsed;
        } else {
            const message =
                validation.message || `Input is invalid, please try again.`;
            this.cliOutputter.pushWarning(message);
            if (
                typeof validation.tryAgain === "undefined" ||
                !validation.tryAgain
            ) {
                throw new Error(`Input failed`);
            }
            return this.awaitSingleInput(param, numAttempts + 1);
        }
    }

    protected abstract getInput(
        displayText: string,
        defaultValue?: string,
        choices?: iCliCommandParamChoice[]
    ): Promise<string>;

    protected abstract getBoolean(
        displayText: string,
        defaultValue?: boolean
    ): Promise<boolean>;

    private parseNumber(input: string): number {
        const result = parseFloat(input);
        if (isNaN(result)) {
            throw new Error(
                `UserInputRequestor.parseNumber: input evaluates to NaN`
            );
        }
        return result;
    }

    private parseBoolean(input: string | boolean): boolean {
        if (typeof input === 'boolean') {
            return input;
        }

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
