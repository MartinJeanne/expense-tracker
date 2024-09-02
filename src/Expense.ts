import { UNDEFINED_ID } from "./types";

export default class Expense {
    private id: number;
    private description: string;
    private amount: number;
    private createdAt: Date;
    private updatedAt: Date;

    constructor(description: string, amount: number, id?: number, createdAt?: Date, updatedAt?: Date) {
        if (id) this.id = id; // todo better id handling?
        else this.id = UNDEFINED_ID;
        this.description = description;
        this.amount = amount;

        if (createdAt) this.createdAt = createdAt;
        else this.createdAt = new Date();
        if (updatedAt) this.updatedAt = updatedAt;
        else this.updatedAt = new Date();
    }

    getId() {
        return this.id;
    }

    setId(id: number): void {
        this.id = id;
    }

    setDescription(description: string) {
        this.description = description;
    }

    setUpdatedAt(date: Date) {
        this.updatedAt = date;
    }

    toString(): string {
        return `${this.id}. ${this.amount}: "${this.description}"`;
    }

    toStringDetail(): string {
        return `${this.id}. ${this.amount}: "${this.description}" - created: ${this.createdAt}, updated: ${this.updatedAt}`;
    }
}
