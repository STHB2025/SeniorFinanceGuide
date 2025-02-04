import { useQuery } from "@tanstack/react-query";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Loader2, AlertTriangle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

type Budget = {
  id: number;
  category: string;
  amount: number;
  spent: number;
  month: string;
};

export default function BudgetTracker() {
  const { user } = useAuth();
  const { data: budgets, isLoading } = useQuery<Budget[]>({
    queryKey: ["/api/budgets"],
  });

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!budgets?.length) {
    return (
      <div className="text-center text-muted-foreground p-8">
        No budgets set up yet
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {budgets.map((budget) => {
        const percentage = Math.min((budget.spent / budget.amount) * 100, 100);
        const isOverBudget = budget.spent > budget.amount;

        return (
          <Card key={budget.id} className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className={user?.preferLargeText ? "text-xl font-medium" : "text-lg font-medium"}>
                  {budget.category}
                </h3>
                <p className={`text-muted-foreground ${user?.preferLargeText ? "text-lg" : "text-sm"}`}>
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(budget.spent)}{" "}
                  of{" "}
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(budget.amount)}
                </p>
              </div>

              {isOverBudget && (
                <div className="flex items-center gap-1 text-destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <span className={user?.preferLargeText ? "text-lg" : "text-sm"}>Over Budget</span>
                </div>
              )}
            </div>

            <Progress
              value={percentage}
              className="h-2"
              indicatorClassName={isOverBudget ? "bg-destructive" : undefined}
            />
          </Card>
        );
      })}
    </div>
  );
}
