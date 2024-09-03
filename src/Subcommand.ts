import { Option } from "commander";
import add from "./commands/add";
import list from "./commands/list";
import update from "./commands/update";

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
                'Add an expense',
                [
                    new Option('-d --description <description>').makeOptionMandatory(),
                    new Option('-a --amount <amount>').argParser(parseFloat).makeOptionMandatory()
                ],
                (options) => add(options)
            ),

            new Subcommand(
                SubcommandName.update,
                'Update an expense',
                [
                    new Option('--id <id>').argParser(parseInt),
                    new Option('-d --description <description>'),
                    new Option('-a --amount <amount>').argParser(parseFloat)
                ],
                (options) => update(options)
            ),

            new Subcommand(SubcommandName.delete, '', [], (options) => notImplemented()),
            new Subcommand(SubcommandName.list, '', [], (options) => list(options)),
            new Subcommand(SubcommandName.summary, '', [], (options) => notImplemented()),
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

const notImplemented = () => {
    console.warn('Not implemented');
}
