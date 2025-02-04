import { Request, Response, Router } from "express";
import { db } from "@db";
import { budgets } from "@db/schema";
import { eq, and } from "drizzle-orm";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

const router = Router();

// Schema for validating budget data
const budgetSchema = z.object({
  category: z.string(),
  amount: z.number().positive(),
  month: z.string().transform(str => new Date(str)),
  spent: z.number().default(0),
});

// Get user's budgets for current month
router.get("/", async (req: Request, res: Response) => {
  try {
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    const userBudgets = await db.query.budgets.findMany({
      where: and(
        eq(budgets.userId, req.user!.id),
        // Filter budgets for current month
        z => z.month >= startOfMonth && z.month <= endOfMonth
      ),
    });

    res.json(userBudgets);
  } catch (error) {
    console.error("Error fetching budgets:", error);
    res.status(500).json({ message: "Failed to fetch budgets" });
  }
});

// Create new budget
router.post("/", async (req: Request, res: Response) => {
  try {
    const result = budgetSchema.safeParse(req.body);
    if (!result.success) {
      const error = fromZodError(result.error);
      return res.status(400).json({ message: error.toString() });
    }

    // Check if budget for this category already exists for the month
    const existingBudget = await db.query.budgets.findFirst({
      where: and(
        eq(budgets.userId, req.user!.id),
        eq(budgets.category, result.data.category),
        eq(budgets.month, result.data.month)
      ),
    });

    if (existingBudget) {
      return res.status(400).json({
        message: "Budget for this category already exists for the selected month"
      });
    }

    const [newBudget] = await db.insert(budgets)
      .values({
        ...result.data,
        userId: req.user!.id,
      })
      .returning();

    res.status(201).json(newBudget);
  } catch (error) {
    console.error("Error creating budget:", error);
    res.status(500).json({ message: "Failed to create budget" });
  }
});

// Update budget spent amount
router.patch("/:id/spent", async (req: Request, res: Response) => {
  try {
    const budgetId = parseInt(req.params.id);
    const { spent } = z.object({ spent: z.number() }).parse(req.body);

    const [updatedBudget] = await db
      .update(budgets)
      .set({ spent })
      .where(and(
        eq(budgets.id, budgetId),
        eq(budgets.userId, req.user!.id)
      ))
      .returning();

    if (!updatedBudget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    // Check if over budget and notify user if necessary
    if (spent > updatedBudget.amount) {
      await sendOverBudgetAlert(req.user!.id, updatedBudget);
    }

    res.json(updatedBudget);
  } catch (error) {
    console.error("Error updating budget spent amount:", error);
    res.status(500).json({ message: "Failed to update budget" });
  }
});

// Helper function to send alerts when over budget
async function sendOverBudgetAlert(userId: number, budget: any) {
  try {
    // Implementation for sending over-budget alerts
    // This could involve sending emails, SMS, or in-app notifications
    console.log(`Over budget alert for user ${userId}:`, budget);
  } catch (error) {
    console.error("Error sending over budget alert:", error);
  }
}

export default router;
