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
}, {
    name: 'print-sentence',
    displayText: "Print an entire sentence based on the user input",
    tokens: ["print-sentence", "p-s"],
    requiredParams: [{
        name: "txt",
        displayText: "Sentence to print",
        isValid: (input: string, numAttempts: number) => {
            if (input.indexOf(".") > -1) {
                return {isValid: true};
            } else {
            return {
                isValid: false,
                message: 'A sentence must contain a period.',
                tryAgain: numAttempts < 3
            };
        }
        }
    }],
    execute: async (params: {txt: string;}, cliOutputter: iCliOutputter): Promise<void> => {
        cliOutputter.pushMessage("Sentence from user ==>", params.txt);
    }
}, {
    name: 'add-numbers',
    displayText: "Add some numbers together",
    tokens: ["add-numbers", "a-n"],
    requiredParams: [{
        name: "number",
        displayText: "Enter the number to add, or empty to conclude",
        type: "number",
        doRepeat: () => true
    }],
    execute: async (params: {number: number[]}, cliOutputter: iCliOutputter): Promise<void> => {
        const sum: number = params.number.reduce((acc, n) => acc + n, 0);
        cliOutputter.pushMessage(`The sum is ${sum}`);
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