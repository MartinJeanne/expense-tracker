import Expense from "../Expense";
import ExpenseRepository from "../ExpenseRepository";

export default (options: any) => {
    const description = options.description;
    const amount = parseInt(options.amount);

    console.log(typeof description);
    console.log(typeof amount);

    const newExpense = new Expense(options.description, options.amount);
    const expenseRepo = new ExpenseRepository();
    expenseRepo.save(newExpense);
}
