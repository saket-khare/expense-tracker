import { Hono } from "hono";
import { logger } from "hono/logger";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const expenseSchema = z.object({
  id: z.number().int().positive().min(1),
  title: z.string().min(3).max(100),
  amount: z.number().positive(),
});

type Expense = z.infer<typeof expenseSchema>;

const createPostSchema = expenseSchema.omit({ id: true });

const fakeExpenses: Expense[] = [
  {
    id: 1,
    title: "Coffee",
    amount: 100,
  },
  {
    id: 2,
    title: "Lunch",
    amount: 200,
  },
  {
    id: 3,
    title: "Dinner",
    amount: 300,
  },
];

export const expensesRoutes = new Hono()
  .get("/", (c) => {
    return c.json({ expenses: fakeExpenses });
  })
  .post("/", zValidator("json", createPostSchema), async (c) => {
    const expense = await c.req.valid("json");
    fakeExpenses.push({
      ...expense,
      id: fakeExpenses.length + 1,
    });
    c.status(201);
    return c.json(expense);
  })
  .get("/total-spent", async (c) => {
    const totalSpent = fakeExpenses.reduce(
      (acc, expense) => acc + expense.amount,
      0
    );
    return c.json({ totalSpent });
  })
  .get("/:id{[0-9]+}", async (c) => {
    const id = Number.parseInt(c.req.param("id"));
    const expense = fakeExpenses.find((e) => e.id === id);
    if (!expense) {
      return c.json({ error: "Expense not found" }, 404);
    }
    return c.json(expense);
  })
  .delete("/:id{[0-9]+}", async (c) => {
    const id = Number.parseInt(c.req.param("id"));
    const expense = fakeExpenses.find((e) => e.id === id);
    if (!expense) {
      return c.json({ error: "Expense not found" }, 404);
    }
    const deletedExpense = fakeExpenses.splice(
      fakeExpenses.indexOf(expense),
      1
    );
    if (deletedExpense.length === 0) {
      return c.json({ error: "Expense not found" }, 404);
    }
    return c.json({ expense: deletedExpense });
  });

expensesRoutes.use(logger());
