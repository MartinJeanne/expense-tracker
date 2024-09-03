import { Option } from "commander";
import add from "./subcommands/add";
import list from "./subcommands/list";
import update from "./subcommands/update";
import del from "./subcommands/del";
import summary from "./subcommands/summary";

enum SubcommandName {
    add = 'add',
    update = 'update',
    delete = 'delete',
    list = 'list',
    summary = 'summary',
}

export default class Subcommand {
    private static collection: Subcommand[] = [];

    private _name: SubcommandName;
    private _description: string;
    private _options: Option[];
    private _action: (options: any) => void;

    constructor(name: SubcommandName, description: string, options: Option[], action: (options: any) => void) {
        this._name = name;
        this._description = description;
        this._options = options;
        this._action = action;
    }

    static getCollection() {
        if (Subcommand.collection && Subcommand.collection.length > 0)
            return Subcommand.collection;

        Subcommand.collection.push(
            new Subcommand(
                SubcommandName.add,
                'add an expense',
                [
                    new Option('-d --description <description>').makeOptionMandatory(),
                    new Option('-a --amount <amount>').argParser(parseFloat).makeOptionMandatory()
                ],
                (options) => add(options)
            ),

            new Subcommand(
                SubcommandName.update,
                'update expense description or amount',
                [
                    new Option('--id <id>').argParser(parseInt).makeOptionMandatory(),
                    new Option('-d --description <description>'),
                    new Option('-a --amount <amount>').argParser(parseFloat)
                ],
                (options) => update(options)
            ),

            new Subcommand(
                SubcommandName.delete, 'delete an expense by id',
                [new Option('--id <id>').argParser(parseInt).makeOptionMandatory()],
                (options) => del(options)
            ),

            new Subcommand(SubcommandName.list, 'list expenses', [], (options) => list(options)),

            new Subcommand(
                SubcommandName.summary,
                'summary of expenses',
                [new Option('-m --month <month>').argParser(parseInt)],
                (options) => summary(options)
            )
        );

        return Subcommand.collection;
    }

    get name() {
        return this._name;
    }

    get description() {
        return this._description;
    }

    get options() {
        return this._options;
    }

    get action() {
        return this._action;
    }
}
