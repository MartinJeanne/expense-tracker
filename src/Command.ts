import add from "./commands/add";

type Command = {
    name: CommandName;
    description: string;
    options: string[];
    callback: (options: any) => void;
}

enum CommandName {
    add = 'add',
    update = 'update',
    delete = 'delete',
    list = 'list',
    summary = 'summary',
}

export const commandCollection: Command[] = [
    { name: CommandName.add, description: '', options: ['-d --description <description>', '-a --amount <amount>'], callback: (options) => add(options) },
    { name: CommandName.update, description: '', options: [], callback: () => toImplement() },
    { name: CommandName.list, description: '', options: [], callback: () => toImplement() },
    { name: CommandName.summary, description: '', options: [], callback: () => toImplement() },
    { name: CommandName.delete, description: '', options: [], callback: () => toImplement() },
];

const toImplement = () => {
    console.warn('Not implemented');
}
