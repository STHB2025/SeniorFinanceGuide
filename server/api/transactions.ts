import { Request, Response, Router } from "express";
import { db } from "@db";
import { transactions } from "@db/schema";
import { eq, desc } from "drizzle-orm";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

const router = Router();

// Schema for validating transaction data
const transactionSchema = z.object({
  category: z.string(),
  amount: z.number(),
  description: z.string(),
  date: z.string().transform(str => new Date(str)),
  merchantId: z.string().optional(),
  suspicious: z.boolean().default(false),
});

// Get user's transactions
router.get("/", async (req: Request, res: Response) => {
  try {
    const userTransactions = await db.query.transactions.findMany({
      where: eq(transactions.userId, req.user!.id),
      orderBy: [desc(transactions.date)],
      limit: 50,
    });

    res.json(userTransactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: "Failed to fetch transactions" });
  }
});

// Add new transaction
router.post("/", async (req: Request, res: Response) => {
  try {
    const result = transactionSchema.safeParse(req.body);
    if (!result.success) {
      const error = fromZodError(result.error);
      return res.status(400).json({ message: error.toString() });
    }

    // Analyze transaction for suspicious activity
    const isSuspicious = await analyzeTransaction(result.data);

    const [newTransaction] = await db.insert(transactions)
      .values({
        ...result.data,
        userId: req.user!.id,
        suspicious: isSuspicious,
      })
      .returning();

    // If transaction is suspicious, trigger alerts
    if (isSuspicious) {
      await sendSuspiciousTransactionAlert(req.user!.id, newTransaction);
    }

    res.status(201).json(newTransaction);
  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(500).json({ message: "Failed to create transaction" });
  }
});

// Helper function to analyze transaction for suspicious activity
async function analyzeTransaction(transaction: z.infer<typeof transactionSchema>): Promise<boolean> {
  // Implement transaction analysis logic here
  // Example: Flag large transactions or unusual patterns
  const SUSPICIOUS_AMOUNT_THRESHOLD = 1000;
  
  if (Math.abs(transaction.amount) > SUSPICIOUS_AMOUNT_THRESHOLD) {
    return true;
  }

  // Add more sophisticated analysis as needed
  return false;
}

// Helper function to send alerts for suspicious transactions
async function sendSuspiciousTransactionAlert(userId: number, transaction: any) {
  try {
    // Implementation for sending alerts to user and emergency contacts
    // This could involve sending emails, SMS, or in-app notifications
    console.log(`Suspicious transaction alert for user ${userId}:`, transaction);
  } catch (error) {
    console.error("Error sending suspicious transaction alert:", error);
  }
}

export default router;
