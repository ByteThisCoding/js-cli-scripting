import { iCliCommand } from "../models/cli-command";
import { iCliOutputter } from "../models/cli-outputter";

export class ConsoleOutputter implements iCliOutputter {

    private cf = {
        _: "\x1b[0m",
        y: "\x1b[33m",
        r: "\x1b[31m",
        cy: "\x1b[36m",
    };

    pushDebug(level: number, ...params: any[]): void {
        this.log("log", ...params.map(this.mapParam.bind(this, this.cf.cy)));
    }

    pushMessage(...params: any[]): void {
        this.log("log", ...params);
    }

    pushWarning(...params: any[]): void {
        this.log("warn", ...params.map(this.mapParam.bind(this, this.cf.y)));
    }

    pushError(...params: any[]): void {
        this.log("error", ...params.map(this.mapParam.bind(this, this.cf.r)));
    }

    pushCommandsDescriptionsOutput(cliCommands: iCliCommand[]): void {
        const getLongestLength = (ar: string[]) => {
            return ar.reduce((len, name) => {
                return Math.max(len, name.length);
            }, 0);
        };

        const names = cliCommands.map((cmd) => cmd.name);
        const longestNameLen = getLongestLength(names);

        const desc = cliCommands.map((cmd) => cmd.displayText);
        const longestDescLen = getLongestLength(desc);

        const tokens = cliCommands.map((cmd) => cmd.tokens.join(", "));
        const longestTokenLen = getLongestLength(tokens);

        this.pushMessage(
            "Name:".padEnd(longestNameLen) +
            " | " +
            "Tokens:".padEnd(longestTokenLen) +
            " | " +
            "Description:".padEnd(longestDescLen)
        );

        for (let i = 0; i < cliCommands.length; i++) {
            const cmd = cliCommands[i];
            this.pushMessage(
                cmd.name.padEnd(longestNameLen) +
                " | " +
                cmd.tokens.join(", ").padEnd(longestTokenLen) +
                " | " +
                cmd.displayText.padEnd(longestDescLen)
            );
        }
    }

    private log(type: string, ...params: any[]): void {
        params = [...params];
        //@ts-ignore
        console[type](...params);
    }

    private mapParam(clr: string, p: any): any {
        if (["string", "number"].indexOf(typeof p) > -1) {
            return `${clr}${p}${this.cf._}`;
        }
        return p;
    }
}
