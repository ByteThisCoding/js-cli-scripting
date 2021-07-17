/**
 * Options for running the application
 */
export interface iCliApplicationOptions {
    /**
     * If true, the system will append default commands, such as:
     * clear output, quit app, multi command
     */
    appendDefaultCommands: boolean;

    startup: {
        /**
         * Set some message to display at the beginning of the application
         */
        initialOutput: string;
        /**
         * If true, output the list of commands at the start of the application
         */
        outputCommandsTexts: boolean;
        /**
         * If true, and if the app is provided args, run those args, then terminate
         * Useful for scripting with the CLI and providing input args
         */
        acceptArgv: boolean;
    };
    loop: {
        /**
         * If set to false, invoking the app without args will not enter the loop
         * Thus, the user will only be able to run commands via argv
         */
        enabled: boolean;
        /**
         * If true, re-output the list of commands after each command is run
         */
        outputCommandsTexts: boolean;
    };
}
