import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { db } from "@db";
import { transactions, budgets, emergencyContacts } from "@db/schema";
import { eq } from "drizzle-orm";

export function registerRoutes(app: Express): Server {
  setupAuth(app);

  // Protected route middleware
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  };

  // Transactions
  app.get("/api/transactions", requireAuth, async (req, res) => {
    const userTransactions = await db.query.transactions.findMany({
      where: eq(transactions.userId, req.user!.id),
      orderBy: (transactions, { desc }) => [desc(transactions.date)],
      limit: 50,
    });
    res.json(userTransactions);
  });

  // Budgets
  app.get("/api/budgets", requireAuth, async (req, res) => {
    const userBudgets = await db.query.budgets.findMany({
      where: eq(budgets.userId, req.user!.id),
    });
    res.json(userBudgets);
  });

  app.post("/api/budgets", requireAuth, async (req, res) => {
    const newBudget = await db.insert(budgets).values({
      ...req.body,
      userId: req.user!.id,
    }).returning();
    res.json(newBudget[0]);
  });

  // Emergency Contacts
  app.get("/api/emergency-contacts", requireAuth, async (req, res) => {
    const contacts = await db.query.emergencyContacts.findMany({
      where: eq(emergencyContacts.userId, req.user!.id),
    });
    res.json(contacts);
  });

  app.post("/api/emergency-contacts", requireAuth, async (req, res) => {
    const newContact = await db.insert(emergencyContacts).values({
      ...req.body,
      userId: req.user!.id,
    }).returning();
    res.json(newContact[0]);
  });

  const httpServer = createServer(app);
  return httpServer;
}
