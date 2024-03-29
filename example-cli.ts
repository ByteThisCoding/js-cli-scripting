/**
 * Example application
 * This file defines some basic commands, then injects everything into the app runner
 */

import {
    ArrayCliCommandsCollection,
    CliApplication,
    ConsoleOutputter,
    ConsoleUserInputRequestor,
    iCliCommand,
    iCliOutputter,
} from "./public-api";

/**
 * Array of the commands which the program will allow the user to execute actions
 */
const commands: iCliCommand[] = [
    {
        name: "Print Date",
        displayText: "Print the current date",
        tokens: ["print-date", "p-d"],
        async getRequiredParams() {
            return null;
        },
        execute: async (
            params: {},
            cliOutputter: iCliOutputter
        ): Promise<void> => {
            cliOutputter.pushMessage("Date ==> ", new Date());
        },
    },
    {
        name: "Print",
        displayText: "Print some text from the user input",
        tokens: ["print", "p"],
        async getRequiredParams() {
            return [
                {
                    name: "txt",
                    displayText: "Text to print",
                },
            ];
        },
        execute: async (
            params: { txt: string },
            cliOutputter: iCliOutputter
        ): Promise<void> => {
            cliOutputter.pushMessage("Txt from user ==>", params.txt);
        },
    },
    {
        name: "Print Sentence",
        displayText: "Print an entire sentence based on the user input",
        tokens: ["print-sentence", "p-s"],
        async getRequiredParams() {
            return [
                {
                    name: "txt",
                    displayText: "Sentence to print",
                    isValid: (input: string, numAttempts: number) => {
                        if (input.indexOf(".") > -1) {
                            return { isValid: true };
                        } else {
                            return {
                                isValid: false,
                                message: "A sentence must contain a period.",
                                tryAgain: numAttempts < 3,
                            };
                        }
                    },
                },
            ];
        },
        execute: async (
            params: { txt: string },
            cliOutputter: iCliOutputter
        ): Promise<void> => {
            cliOutputter.pushMessage("Sentence from user ==>", params.txt);
        },
    },
    {
        name: "Boolean Test",
        displayText: "Ask for a boolean yes/no",
        tokens: ["b-t"],
        async getRequiredParams() {
            return [
                {
                    name: "booleanValue",
                    displayText: "Enter a boolean value",
                    type: "boolean",
                },
            ];
        },
        execute: async (
            params: { booleanValue: boolean },
            cliOutputter: iCliOutputter
        ) => {
            cliOutputter.pushMessage("Boolean result", params.booleanValue);
        },
    },
    {
        name: "Choose Something",
        displayText: "Choose from a list of options",
        tokens: ["ch-s"],
        async getRequiredParams() {
            return [
                {
                    name: "choice",
                    displayText: "Make a choice",
                    choices: [
                        {
                            name: "one",
                            displayText: "First choice",
                        },
                        {
                            name: "two",
                            displayText: "Second choice",
                        },
                        {
                            name: "three",
                            displayText: "Third choice",
                        },
                        {
                            name: "four",
                            displayText: "Fourth choice",
                        },
                    ],
                },
            ];
        },
        execute: async (
            params: { choice: string },
            cliOutputter: iCliOutputter
        ) => {
            cliOutputter.pushMessage("Choice result:", params.choice);
        },
    },
    {
        name: "Add Numbers",
        displayText: "Add some numbers together",
        tokens: ["add-numbers", "a-n"],
        async getRequiredParams() {
            return [
                {
                    name: "number",
                    displayText:
                        "Enter the number to add, or empty to conclude",
                    type: "number",
                    doRepeat: () => true,
                },
            ];
        },
        execute: async (
            params: { number: number[] },
            cliOutputter: iCliOutputter
        ): Promise<void> => {
            const sum: number = params.number.reduce((acc, n) => acc + n, 0);
            cliOutputter.pushMessage(`The sum is ${sum}`);
        },
    },
];

//create the app object
const app = new CliApplication();

//When quit is dispatched, trigger the process to exit
app.onQuit(() => {
    process.exit(0);
});

//create the i/o dependencies
const outputter = new ConsoleOutputter();
const inputRequestor = new ConsoleUserInputRequestor(outputter);

//create the app and inject dependencies
app.startApp(
    {
        startup: {
            initialOutput: "Welcome to the example application",
        },
        loop: {
            enabled: true,
        },
    },
    //Pass the args into a collection object
    new ArrayCliCommandsCollection(commands),
    //Pass in the process arguments
    [...process.argv].slice(2),
    //Use the default console outputter and input requestors
    outputter,
    inputRequestor
);
