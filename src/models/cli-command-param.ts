/**
 * If the param is a selection between choices: this object holds the name vs display text
 */
export interface iCliCommandParamChoice {
    displayText: string;
    name: string;
}

/**
 * Encapsulation of a parameter for a command
 */
export interface iCliCommandParam {
    //simple param name
    name: string;

    //description of the parameter
    displayText: string;
    
    //type of the parameter
    //if not string, the system will parse to the appropriate type
    type?: "string" | "number" | "boolean";

    //if this param is a list of choices, specify with this property
    choices?: iCliCommandParamChoice[];

    //if needed, provide a default value
    defaultValue?: string;

    //if this command should get multiple inputs, declare this function
    //function will return false if we shouldn't repeat again
    doRepeat?: (valuesSoFar: any[]) => boolean;

    //if some validation is required, implement this function
    isValid?: (
        value: any,
        numAttempts: number
    ) => {
        isValid: boolean;
        message?: string;
        tryAgain?: boolean;
    };
}
