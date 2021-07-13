# js-cli-scripting

Streamline the process of creating a CLI using javascript / typescript.

## Getting Started
This readme will outline how to use this project. If you'd like to view an example, or just jump in, the **example-cli.ts** script contains
a basic cli application with a few sample commands.

## How To Use
1. Create one or more **commands** for the program to use.
1. Setup the application to use these commands with optional arguments for logging and requesting user input.
1. Let the CliApplication class orchestrate the rest.

```typescript
const TestCommand: iCliCommand = {
    name: 'Test Command', //name for internal use
    displayText: "Print some test text to the console",
    tokens: ["test-print", "t-p"],
    requiredParams: [{
        name: "txt",
        displayText: "Text to print"
    }],
    execute: async (params: {txt: string;}, cliOutputter: iCliOutputter): Promise<void> => {
        cliOutputter.pushMessage("Txt from user ==>", params.txt);
    }
}
```

With this kind of definition, the program will request everything under **requiredParams** from the user, then execute the command and pass in those required commands.

Then, we setup our application runner
```typescript
new CliApplication().startApp(
    {
        startup: {
            initialOutput: "Welcome to the example application"
        }
    },
    commands
);
```