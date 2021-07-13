import { iCliCommandParam } from "./cli-command-param";

export interface iCliUserInputRequestor {
    awaitInput(param: iCliCommandParam): Promise<any>;   
}
