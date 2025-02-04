import { useQuery } from "@tanstack/react-query";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Loader2, AlertTriangle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

type Transaction = {
  id: number;
  amount: number;
  description: string;
  category: string;
  date: string;
  suspicious: boolean;
};

export default function TransactionList() {
  const { user } = useAuth();
  const { data: transactions, isLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!transactions?.length) {
    return (
      <div className="text-center text-muted-foreground p-8">
        No transactions found
      </div>
    );
  }

  return (
    <div className="relative">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className={user?.preferLargeText ? "text-lg" : ""}>Date</TableHead>
            <TableHead className={user?.preferLargeText ? "text-lg" : ""}>Description</TableHead>
            <TableHead className={`text-right ${user?.preferLargeText ? "text-lg" : ""}`}>Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell className={user?.preferLargeText ? "text-lg" : ""}>
                {format(new Date(transaction.date), "MMM d, yyyy")}
              </TableCell>
              <TableCell>
                <div className={`flex items-center gap-2 ${user?.preferLargeText ? "text-lg" : ""}`}>
                  {transaction.description}
                  {transaction.suspicious && (
                    <Badge variant="destructive" className="gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      Suspicious
                    </Badge>
                  )}
                </div>
                <span className={`text-muted-foreground ${user?.preferLargeText ? "text-base" : "text-sm"}`}>
                  {transaction.category}
                </span>
              </TableCell>
              <TableCell 
                className={`text-right font-medium ${
                  transaction.amount < 0 ? "text-red-500" : "text-green-500"
                } ${user?.preferLargeText ? "text-lg" : ""}`}
              >
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(Math.abs(transaction.amount))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
