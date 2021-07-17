import { iCliCommandParam } from "./cli-command-param";
import { iCliOutputter } from "./cli-outputter";

/**
 * An encapsulation of some action to execute and its required parameters
 */
export interface iCliCommand {
    //simple name for the command
    name: string;

    //nice description of the command to display
    displayText: string;

    //list of tokens which the user can type to invoke this command
    tokens: string[];

    /**
     * Assemble the required parameters for this command
     */
    getRequiredParams(): Promise<iCliCommandParam[] | null>;

    /**
     * Execute the command
     * @param userParamsInput : dictionary of input params with values provided by the user
     * @param cliOutputter : object to invoke when outputting data to the console/interface
     */
    execute(
        userParamsInput: { [key: string]: any },
        cliOutputter: iCliOutputter
    ): Promise<void>;
}
