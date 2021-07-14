/**
 * Example application
 */

import { CliApplication } from "./src/cli-application/cli-application";
import { ArrayCliCommandsCollection } from "./src/cli-commands-collection/cli-commands-collection";
import { ConsoleUserInputRequestor } from "./src/input-requestor/console-input-requestor";
import { iCliCommand } from "./src/models/cli-command";
import { iCliOutputter } from "./src/models/cli-outputter";
import { ConsoleOutputter } from "./src/outputter/console-outputter";

const commands: iCliCommand[] = [
    {
        name: "date",
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
        name: "print",
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
        name: "print-sentence",
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
        name: "boolean-test",
        displayText: "Ask for a boolean yes/no",
        tokens: ["b-t"],
        async getRequiredParams() {
            return [
                {
                    name: "booleanValue",
                    displayText:
                        "Enter a boolean value",
                    type: "boolean"
                },
            ];
        },
        execute: async (params: {booleanValue: boolean;}, cliOutputter: iCliOutputter) => {
            cliOutputter.pushMessage("Boolean result", params.booleanValue);
        }
    },
    {
        name: "add-numbers",
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

new CliApplication().startApp(
    {
        startup: {
            initialOutput: "Welcome to the example application",
        },
    },
    new ArrayCliCommandsCollection(commands),
    [...process.argv].slice(2),
    new ConsoleOutputter(),
    new ConsoleUserInputRequestor(
        new ConsoleOutputter()
    )
);
