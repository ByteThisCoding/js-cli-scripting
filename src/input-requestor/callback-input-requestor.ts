import { iCliCommandParamChoice } from "../models/cli-command-param";
import { iCliOutputter } from "../models/cli-outputter";
import { BaseUserInputRequestor } from "./base-input-requestor";

export class CallbackInputRequestor extends BaseUserInputRequestor {

    static events: {
        getInput: "getInput",
        getBoolean: "getBoolean"
    }

    constructor(
        cliOutputter: iCliOutputter,
        private callback: (eventType: string, displayText: string, defalutValue?: string | boolean, choices?: iCliCommandParamChoice[]) => Promise<string | boolean>
    ) {
        super(cliOutputter);
    }

    protected async getInput(displayText: string, defaultValue?: string, choices?: iCliCommandParamChoice[]): Promise<string> {
        return this.callback(CallbackInputRequestor.events.getInput, displayText, defaultValue, choices) as Promise<string>;
    }
    
    protected async getBoolean(displayText: string, defaultValue?: boolean): Promise<boolean> {
        return this.callback(CallbackInputRequestor.events.getInput, displayText, defaultValue) as Promise<boolean>;
    }
    
}