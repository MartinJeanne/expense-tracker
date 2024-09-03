import Expense from "../Expense";
import ExpenseRepository from "../ExpenseRepository";

export default async (options: any) => {
    console.log(options);
    
    const id = options.id;
    const description = options.description;
    const amount = options.amount;
    if (id && Number.isNaN(id)) return console.warn('ID value is not a valid number')
    if (amount && Number.isNaN(amount)) return console.warn('Amount value is not a valid number')

    const expenseRepo = new ExpenseRepository();
    const expense = await expenseRepo.findById(id);
    if (!expense) return console.warn(`Not expense found for id: ${id}`);

    if (description) expense.description = description;
    if (amount) expense.amount = amount;
    expenseRepo.save(expense);
}
