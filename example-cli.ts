/**
 * Example application
 */

import { CliApplication } from "./src/cli-application/cli-application";
import { iCliCommand } from "./src/models/cli-command";
import { iCliOutputter } from "./src/models/cli-outputter";

const commands: iCliCommand[] = [{
    name: 'date',
    displayText: 'Print the current date',
    tokens: ["print-date", "p-d"],
    execute: async (params: {}, cliOutputter: iCliOutputter): Promise<void> => {
        cliOutputter.pushMessage("Date ==> ", new Date());
    }
},{
    name: 'print',
    displayText: "Print some text from the user input",
    tokens: ["print", "p"],
    requiredParams: [{
        name: "txt",
        displayText: "Text to print"
    }],
    execute: async (params: {txt: string;}, cliOutputter: iCliOutputter): Promise<void> => {
        cliOutputter.pushMessage("Txt from user ==>", params.txt);
    }
}];

new CliApplication().startApp(
    {
        startup: {
            initialOutput: "Welcome to the example application"
        }
    },
    commands,
    [...process.argv].slice(2)
);