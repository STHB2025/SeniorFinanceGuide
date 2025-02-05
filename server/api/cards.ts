import { Request, Response, Router } from "express";
import { db } from "@db";
import { cards } from "@db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

const router = Router();

// Schema for validating card data
const cardSchema = z.object({
  cardNumber: z.string().length(16, "Card number must be 16 digits"),
  cardholderName: z.string().min(1, "Cardholder name is required"),
  expiryDate: z.string().regex(/^\d{2}\/\d{2}$/, "Expiry date must be in MM/YY format"),
  cardType: z.enum(["debit", "credit"]),
  dailyLimit: z.number().positive("Daily limit must be positive"),
});

// Get user's cards
router.get("/", async (req: Request, res: Response) => {
  try {
    const userCards = await db.query.cards.findMany({
      where: eq(cards.userId, req.user!.id),
    });
    res.json(userCards);
  } catch (error) {
    console.error("Error fetching cards:", error);
    res.status(500).json({ message: "Failed to fetch cards" });
  }
});

// Add new card
router.post("/", async (req: Request, res: Response) => {
  try {
    const result = cardSchema.safeParse(req.body);
    if (!result.success) {
      const error = fromZodError(result.error);
      return res.status(400).json({ message: error.toString() });
    }

    const [newCard] = await db.insert(cards)
      .values({
        ...result.data,
        userId: req.user!.id,
        dailyLimit: result.data.dailyLimit.toString(),
      })
      .returning();

    res.status(201).json(newCard);
  } catch (error) {
    console.error("Error adding card:", error);
    res.status(500).json({ message: "Failed to add card" });
  }
});

// Toggle card lock status
router.patch("/:id/lock", async (req: Request, res: Response) => {
  try {
    const cardId = parseInt(req.params.id);
    const { isLocked } = z.object({ isLocked: z.boolean() }).parse(req.body);

    const [updatedCard] = await db
      .update(cards)
      .set({ isLocked })
      .where(eq(cards.id, cardId))
      .returning();

    if (!updatedCard) {
      return res.status(404).json({ message: "Card not found" });
    }

    res.json(updatedCard);
  } catch (error) {
    console.error("Error updating card lock status:", error);
    res.status(500).json({ message: "Failed to update card" });
  }
});

// Update card daily limit
router.patch("/:id/limit", async (req: Request, res: Response) => {
  try {
    const cardId = parseInt(req.params.id);
    const { dailyLimit } = z.object({ dailyLimit: z.number().positive() }).parse(req.body);

    const [updatedCard] = await db
      .update(cards)
      .set({ dailyLimit: dailyLimit.toString() })
      .where(eq(cards.id, cardId))
      .returning();

    if (!updatedCard) {
      return res.status(404).json({ message: "Card not found" });
    }

    res.json(updatedCard);
  } catch (error) {
    console.error("Error updating card limit:", error);
    res.status(500).json({ message: "Failed to update card" });
  }
});

export default router;