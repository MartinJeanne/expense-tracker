import ExpenseRepository from "../ExpenseRepository";

export default async (options: any) => {
    const month = options.month;
    const expenseRepo = new ExpenseRepository();

    let expenses;
    if (month) {
        if (Number.isNaN(month)) return console.warn('Month value is not a valid number')
        expenses = await expenseRepo.findByMonth(month);
    } else {
        expenses = await expenseRepo.findAll();
    }

    let totalExpenses = 0;
    expenses.forEach(exp => totalExpenses += exp.amount);
    console.log(`Total expenses: ${totalExpenses}€`);
}
