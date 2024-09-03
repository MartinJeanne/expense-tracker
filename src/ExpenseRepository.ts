import fs from 'node:fs/promises';
import Expense from "./Expense";
import JSONParseError from './error/JSONParseError';
import { UNDEFINED_ID } from './types';

type RawExpense = {
    _id: number,
    _description: string,
    _amount: number,
    _createdAt: string,
    _updatedAt: string
}

export default class ExpenseRepository {
    private path: string = './expenses.json';

    constructor() { }

    async findAll(): Promise<Expense[]> {
        const expensesRaw = await fs.readFile(this.path, { encoding: 'utf8' })
            .then(json => JSON.parse(json))
            .catch(async e => {
                if (e.code === 'ENOENT') {
                    await this.overwriteAll([]);
                    return [];
                }
                else console.error(e);
            });

        if (!this.isExpensesRaw(expensesRaw)) {
            throw new JSONParseError('Invalid data: the JSON file is corrupted')
        }
        const expenses = this.toExpenses(expensesRaw);
        return expenses.sort((a, b) => a.id - b.id);
    }

    async findById(id: number): Promise<Expense | undefined> {
        const expenses = await this.findAll();
        return expenses.find(t => t.id === id);
    }

    async save(expense: Expense) {
        const expenses = await this.findAll();
        if (expense.id === UNDEFINED_ID)
            expense.id = this.nextValidId(expenses);
        else {
            const toUpdate = expenses.find(t => t.id === expense.id);
            if (toUpdate) {
                expenses.splice(expenses.indexOf(toUpdate), 1);
            }
        }
        expenses.push(expense);
        await this.overwriteAll(expenses);
    }

    async deleteById(id: number) {
        const expenses = await this.findAll();
        const toDelete = expenses.find(t => t.id === id);
        if (toDelete) {
            expenses.splice(expenses.indexOf(toDelete), 1);
            await this.overwriteAll(expenses);
        }
    }

    private nextValidId(expenses: Expense[]): number {
        if (!expenses || expenses.length === 0) return 1;

        const sortedExpenses = expenses.sort((a, b) => b.id- a.id)
        return sortedExpenses[0].id + 1;
    }

    private async overwriteAll(expenses: Expense[]) {
        const json = JSON.stringify(expenses);
        await fs.writeFile(this.path, json, { encoding: 'utf8' });
    }

    private isExpenseRaw(value: unknown): value is RawExpense {
        if (!value || typeof value !== 'object') {
            return false
        }
        const object = value as Record<string, unknown>

        return (
            typeof object._id === 'number' &&
            typeof object._description === 'string' &&
            typeof object._amount === 'number' &&
            typeof object._createdAt === 'string' && !isNaN(Date.parse(object._createdAt)) &&
            typeof object._updatedAt === 'string' && !isNaN(Date.parse(object._updatedAt))
        )
    }

    private isExpensesRaw(value: unknown): value is RawExpense[] {
        return Array.isArray(value) && value.every(this.isExpenseRaw)
    }

    private toExpense(rExpense: RawExpense): Expense {
        return new Expense(rExpense._description, rExpense._amount, rExpense._id, new Date(rExpense._createdAt), new Date(rExpense._updatedAt));
    }

    private toExpenses(rExpenses: RawExpense[]): Expense[] {
        return rExpenses.map(ex => this.toExpense(ex));
    }
}
