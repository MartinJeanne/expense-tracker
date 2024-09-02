import { Command } from "commander";
import { commandCollection } from "./Command";

export default class Program {
    private program: Command;

    constructor() {
        const program = new Command();

        program
            .name('expense-tracker')
            .description('CLI to track expenses')
            .version('1.0.0');

        this.program = program;
    }

    setup() {
        commandCollection.forEach(command => {
            const currentCmd = this.program
                .command(command.name)
                .description(command.description)

            command.options.forEach(option => currentCmd.option(option));
            currentCmd.action((options) => command.callback(options));
        });

        this.program.parse();
    }
}
