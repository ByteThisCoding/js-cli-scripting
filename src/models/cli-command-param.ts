export interface iCliCommandParamChoice {
    displayText: string;
    name: string;
}

export interface iCliCommandParam {
    name: string;
    displayText: string;
    type?: "string" | "number" | "boolean";
    choices?: iCliCommandParamChoice[];
    defaultValue?: string;
}
