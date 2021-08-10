import { iCliCommandParamChoice } from "../models/cli-command-param";
import { iCliOutputter } from "../models/cli-outputter";
import { BaseUserInputRequestor } from "./base-input-requestor";

/**
 * This subclass provides functionality specific to getting user input from a command line terminal
 * This implementation lets us integrate in a decoupled manner
 * : a callback for each event is registered in the constructor and invoked when the input requestor is invoked
 * : the callback will return a promise which resolves to the user input
 */
export class CallbackInputRequestor extends BaseUserInputRequestor {
    static events: {
        getInput: "getInput";
        getBoolean: "getBoolean";
    };

    constructor(
        cliOutputter: iCliOutputter,
        private callback: (
            eventType: string,
            displayText: string,
            defalutValue?: string | boolean,
            choices?: iCliCommandParamChoice[]
        ) => Promise<string | boolean>
    ) {
        super(cliOutputter);
    }

    /**
     * Implementing the abstract method based on what we need for this specific context
     */
    protected async getInput(
        displayText: string,
        defaultValue?: string,
        choices?: iCliCommandParamChoice[]
    ): Promise<string> {
        return this.callback(
            CallbackInputRequestor.events.getInput,
            displayText,
            defaultValue,
            choices
        ) as Promise<string>;
    }

    /**
     * Implementing the abstract method based on what we need for this specific context
     */
    protected async getBoolean(
        displayText: string,
        defaultValue?: boolean
    ): Promise<boolean> {
        return this.callback(
            CallbackInputRequestor.events.getInput,
            displayText,
            defaultValue
        ) as Promise<boolean>;
    }
}
