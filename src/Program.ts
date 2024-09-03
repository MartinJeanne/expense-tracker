import { Command } from "commander";
import Subcommand from "./Subcommand";

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
        Subcommand.getCollection().forEach(subcmd => {
            const currentCmd = this.program
                .command(subcmd.name)
                .description(subcmd.description)

            subcmd.options.forEach(option => currentCmd.addOption(option));
            currentCmd.action((options) => subcmd.action(options));
        });

        this.program.parse();
    }
}
