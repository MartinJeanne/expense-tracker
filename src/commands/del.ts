import ExpenseRepository from "../ExpenseRepository";

export default async (options: any) => {
    const id = options.id;
    if (Number.isNaN(id)) return console.warn('ID value is not a valid number')

    const expenseRepo = new ExpenseRepository();
    expenseRepo.deleteById(id);
}
