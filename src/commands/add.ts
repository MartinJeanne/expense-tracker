import Expense from "../Expense";

export default (options: any) => {
    const newExpense = new Expense(options.description, options.amount);
    console.log(newExpense.toString());
}
