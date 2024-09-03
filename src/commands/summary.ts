import ExpenseRepository from "../ExpenseRepository";

export default async (options: any) => {
    const expenseRepo = new ExpenseRepository();
    const expenses = await expenseRepo.findAll();
    let totalExpenses = 0;
    expenses.forEach(exp => totalExpenses += exp.amount);
    console.log(`Total expenses: ${totalExpenses}€`);
}
