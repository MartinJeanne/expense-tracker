import fs from 'node:fs/promises';
import Expense from "./Expense";
import JSONParseError from './error/JSONParseError';
import { UNDEFINED_ID } from './types';

type RawExpense = {
    id: number,
    description: string,
    amount: number,
    createdAt: string,
    updatedAt: string
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
        return expenses.sort((a, b) => a.getId() - b.getId());
    }

    async findById(id: number): Promise<Expense | undefined> {
        const expenses = await this.findAll();
        return expenses.find(t => t.getId() === id);
    }

    async save(expense: Expense) {
        const expenses = await this.findAll();
        if (expense.getId() === UNDEFINED_ID)
            expense.setId(this.nextValidId(expenses));
        else {
            const toUpdate = expenses.find(t => t.getId() === expense.getId());
            if (toUpdate) {
                expenses.splice(expenses.indexOf(toUpdate), 1);
            }
        }
        expenses.push(expense);
        await this.overwriteAll(expenses);
    }

    async delete(expense: Expense) {
        const expenses = await this.findAll();
        const toDelete = expenses.find(t => t.getId() === expense.getId());
        if (toDelete) {
            expenses.splice(expenses.indexOf(toDelete), 1);
            await this.overwriteAll(expenses);
        }
    }

    private nextValidId(expenses: Expense[]): number {
        if (!expenses || expenses.length === 0) return 1;

        const sortedExpenses = expenses.sort((a, b) => b.getId() - a.getId())
        return sortedExpenses[0].getId() + 1;
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
            typeof object.id === 'number' &&
            typeof object.description === 'string' &&
            typeof object.amount === 'number' &&
            typeof object.createdAt === 'string' && !isNaN(Date.parse(object.createdAt)) &&
            typeof object.updatedAt === 'string' && !isNaN(Date.parse(object.updatedAt))
        )
    }

    private isExpensesRaw(value: unknown): value is RawExpense[] {
        return Array.isArray(value) && value.every(this.isExpenseRaw)
    }

    private toExpense(rExpense: RawExpense): Expense {
        return new Expense(rExpense.description, rExpense.amount, rExpense.id, new Date(rExpense.createdAt), new Date(rExpense.updatedAt));
    }

    private toExpenses(rExpenses: RawExpense[]): Expense[] {
        return rExpenses.map(ex => this.toExpense(ex));
    }
}
