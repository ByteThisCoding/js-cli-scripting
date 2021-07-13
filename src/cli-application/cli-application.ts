import EventEmitter from "events";
import { argv } from "process";
import { CliCommandExecutor } from "../cmd-executor/cmd-executor";
import { EVENTS } from "../events/events";
import { ConsoleUserInputRequestor } from "../input-requestor/console-input-requestor";
import {
    iCliApplication,
    iCliApplicationOptions,
} from "../models/cli-application";
import { iCliCommand } from "../models/cli-command";
import { iCliCommandExecutor } from "../models/cli-command-executor";
import { iCliOutputter } from "../models/cli-outputter";
import { iCliUserInputRequestor } from "../models/cli-user-input-requestor";
import { RecursivePartial } from "../models/recursive-partial";
import { ConsoleOutputter } from "../outputter/console-outputter";
import { QuitCliCommand } from "./app-commands/quit-cmd";
import { ArgvCommandExecutorCommand } from "./internal-app-commands/argv-exec-cmd";
import { CommandExecutorCommand } from "./internal-app-commands/cmd-exec-cmd";
import { MultiCommandExecutorCommand } from "./app-commands/multi-cmd-exec-cmd";
import { iCliCommandsCollection } from "../models/cli-commands-collection";
import { ClearScreenCmd } from "./app-commands/clear-screen-cmd";

export class CliApplication implements iCliApplication {
    async startApp(
        inputOptions: RecursivePartial<iCliApplicationOptions>,
        cliCommandsCollection: iCliCommandsCollection,
        argV?: string[],
        cliOutputter?: iCliOutputter,
        cliUserInputRequestor?: iCliUserInputRequestor,
        cmdExecutor?: iCliCommandExecutor
    ): Promise<void> {
        const options: iCliApplicationOptions = {
            appendDefaultCommands: true,
            ...inputOptions,
            startup: {
                initialOutput: "",
                outputCommandsTexts: true,
                acceptArgv: true,
                ...(inputOptions.startup || {}),
            },
            loop: {
                outputCommandsTexts: true,
                ...(inputOptions.loop || {}),
            },
        };

        //instantiate defaults if necessary
        const eventEmitter = new EventEmitter();
        if (!cliOutputter) {
            cliOutputter = new ConsoleOutputter();
        }
        if (!cliUserInputRequestor) {
            cliUserInputRequestor = new ConsoleUserInputRequestor(cliOutputter);
        }
        if (!cmdExecutor) {
            cmdExecutor = new CliCommandExecutor(
                cliOutputter,
                cliUserInputRequestor
            );
        }

        //listen to events
        this.listenToEvents(eventEmitter);

        //if we have command line params, execute directly,
        //otherwise, run loop
        if (options.startup.acceptArgv && argV && argV.length > 0) {

            const {
                cliCommands,
                commandExecutorCommand
            } = await this.getCommands(
                options,
                cliCommandsCollection,
                eventEmitter,
                cliOutputter,
                cliUserInputRequestor
            );
            await this.runFromArgv(argV, cliCommands, cliOutputter);
        } else {
            //output initial commands and texts if options enable this
            this.loop(
                options,
                cliCommandsCollection,
                eventEmitter,
                cliOutputter,
                cliUserInputRequestor
            );
        }
    }

    private async runFromArgv(
        args: string[],
        commands: iCliCommand[],
        cliOutputter: iCliOutputter
    ): Promise<void> {
        const argvExecutor = new ArgvCommandExecutorCommand(commands, args);

        argvExecutor.execute({}, cliOutputter);
    }

    private async loop(
        options: iCliApplicationOptions,
        cliCommandsCollection: iCliCommandsCollection,
        eventEmitter: EventEmitter,
        cliOutputter: iCliOutputter,
        cliUserInputRequestor: iCliUserInputRequestor
    ): Promise<void> {
        let { cliCommands, commandExecutorCommand } = await this.getCommands(
            options,
            cliCommandsCollection,
            eventEmitter,
            cliOutputter,
            cliUserInputRequestor
        )

        this.outputInitial(options, cliCommands, cliOutputter);
        //start loop
        const cliCommandExecutor = new CliCommandExecutor(
            cliOutputter,
            cliUserInputRequestor
        );
        while (true) {
            await cliCommandExecutor.execute(commandExecutorCommand);
            if (options.loop.outputCommandsTexts) {
                cliOutputter.pushCommandsDescriptionsOutput(cliCommands);
            }
            const updates = await this.getCommands(
                options,
                cliCommandsCollection,
                eventEmitter,
                cliOutputter,
                cliUserInputRequestor
            )
            cliCommands = updates.cliCommands;
            commandExecutorCommand = updates.commandExecutorCommand;
        }
    }

    private outputInitial(
        options: iCliApplicationOptions,
        cliCommands: iCliCommand[],
        cliOutputter: iCliOutputter
    ): void {
        if (options.startup.initialOutput) {
            cliOutputter.pushMessage(options.startup.initialOutput);
        }
        if (options.startup.outputCommandsTexts) {
            cliOutputter.pushCommandsDescriptionsOutput(cliCommands);
        }
    }

    private listenToEvents(eventEmitter: EventEmitter): void {
        eventEmitter.on(EVENTS.quitApp, () => {
            process.exit(0);
        });
    }

    /**
     * Get the cli commands
     * @param options 
     * @param cliCommandsCollection 
     * @param eventEmitter 
     * @param cliUserInputRequestor 
     */
    private async getCommands(
        options: iCliApplicationOptions,
        cliCommandsCollection: iCliCommandsCollection,
        eventEmitter: EventEmitter,
        cliOutputter: iCliOutputter,
        cliUserInputRequestor: iCliUserInputRequestor,
    ): Promise<{
        cliCommands: iCliCommand[];
        commandExecutorCommand: CommandExecutorCommand
    }> {
        const cliCommands = [...(await cliCommandsCollection.getCommands())];
        //add default commands
        if (options.appendDefaultCommands) {
            cliCommands.push(
                new ClearScreenCmd(),
                new QuitCliCommand(eventEmitter),
                new MultiCommandExecutorCommand(
                    cliCommands,
                    cliUserInputRequestor
                )
            );
        }

        const commandExecutorCommand = new CommandExecutorCommand(
            cliCommands,
            new CliCommandExecutor(
                cliOutputter,
                cliUserInputRequestor
            )
        );

        return {
            cliCommands,
            commandExecutorCommand
        };
    }
}
