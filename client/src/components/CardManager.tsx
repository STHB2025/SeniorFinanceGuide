import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  CreditCard,
  Lock,
  Unlock,
  Plus,
  DollarSign,
  Loader2
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";

type CardData = {
  id: number;
  cardNumber: string;
  cardholderName: string;
  expiryDate: string;
  isLocked: boolean;
  dailyLimit: number;
  cardType: "debit" | "credit";
};

export default function CardManager() {
  const { user } = useAuth();
  const { toast } = useToast();

  // Format currency consistently
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const form = useForm<Omit<CardData, "id" | "isLocked">>({
    defaultValues: {
      cardType: "debit",
      cardNumber: "",
      cardholderName: "",
      expiryDate: "",
      dailyLimit: 0,
    },
    mode: "onChange",
  });

  const { data: cards, isLoading } = useQuery<CardData[]>({
    queryKey: ["/api/cards"],
  });

  const addCardMutation = useMutation({
    mutationFn: async (data: Omit<CardData, "id" | "isLocked">) => {
      const res = await apiRequest("POST", "/api/cards", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cards"] });
      form.reset();
      toast({
        title: "Card Added",
        description: "Your card has been added successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const toggleLockMutation = useMutation({
    mutationFn: async ({ id, isLocked }: { id: number; isLocked: boolean }) => {
      const res = await apiRequest("PATCH", `/api/cards/${id}/lock`, { isLocked });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cards"] });
      toast({
        title: "Card Updated",
        description: "Card lock status has been updated.",
      });
    },
  });

  const updateLimitMutation = useMutation({
    mutationFn: async ({ id, dailyLimit }: { id: number; dailyLimit: number }) => {
      const res = await apiRequest("PATCH", `/api/cards/${id}/limit`, { dailyLimit });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cards"] });
      toast({
        title: "Limit Updated",
        description: "Card daily limit has been updated.",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        {cards?.map((card) => (
          <Card key={card.id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <CreditCard className={`h-6 w-6 ${card.isLocked ? "text-muted-foreground" : "text-primary"}`} />
                  <div>
                    <h3 className={`font-medium ${user?.preferLargeText ? "text-xl" : "text-lg"}`}>
                      •••• {card.cardNumber.slice(-4)}
                    </h3>
                    <p className={`text-muted-foreground ${user?.preferLargeText ? "text-lg" : "text-sm"}`}>
                      {card.cardType.charAt(0).toUpperCase() + card.cardType.slice(1)}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleLockMutation.mutate({ id: card.id, isLocked: !card.isLocked })}
                  className={`${user?.preferLargeText ? "h-10 w-10" : "h-8 w-8"} ${toggleLockMutation.isPending ? "opacity-50" : ""}`}
                  disabled={toggleLockMutation.isPending}
                >
                  {toggleLockMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : card.isLocked ? (
                    <Lock className="h-4 w-4" />
                  ) : (
                    <Unlock className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className={`text-muted-foreground ${user?.preferLargeText ? "text-lg" : "text-sm"}`}>
                    Cardholder:
                  </span>
                  <span className={user?.preferLargeText ? "text-lg" : ""}>
                    {card.cardholderName}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-muted-foreground ${user?.preferLargeText ? "text-lg" : "text-sm"}`}>
                    Expires:
                  </span>
                  <span className={user?.preferLargeText ? "text-lg" : ""}>
                    {card.expiryDate}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className={`text-muted-foreground ${user?.preferLargeText ? "text-lg" : "text-sm"}`}>
                    Daily Limit:
                  </span>
                  <span className={user?.preferLargeText ? "text-lg" : ""}>
                    {formatCurrency(card.dailyLimit)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className={user?.preferLargeText ? "text-2xl" : "text-xl"}>
            Add New Card
          </CardTitle>
          <CardDescription className={user?.preferLargeText ? "text-lg" : ""}>
            Add a new card to manage your spending and security.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((data) => addCardMutation.mutate(data))}
              className="space-y-4"
            >
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="cardType"
                  rules={{ required: "Card type is required" }}
                  render={({ field, fieldState: { error } }) => (
                    <FormItem>
                      <FormLabel className={user?.preferLargeText ? "text-lg" : ""}>
                        Card Type
                      </FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className={`w-full p-3 rounded-md border bg-background ${
                            user?.preferLargeText ? "text-lg" : ""
                          } ${error ? "border-destructive" : ""}`}
                        >
                          <option value="">Select card type</option>
                          <option value="debit">Debit Card</option>
                          <option value="credit">Credit Card</option>
                        </select>
                      </FormControl>
                      {error && (
                        <div className="text-sm text-destructive">{error.message}</div>
                      )}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cardNumber"
                  rules={{
                    required: "Please enter your card number",
                    pattern: {
                      value: /^\d{16}$/,
                      message: "Please enter a valid 16-digit card number"
                    },
                    validate: {
                      numbersOnly: (value) => /^\d+$/.test(value) || "Card number must contain only digits"
                    }
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <FormItem>
                      <FormLabel className={user?.preferLargeText ? "text-lg" : ""}>
                        Card Number
                      </FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          className={`${user?.preferLargeText ? "text-lg" : ""} ${error ? "border-destructive" : ""}`}
                          placeholder="Enter 16-digit card number"
                          maxLength={16}
                        />
                      </FormControl>
                      {error && (
                        <div className="text-sm text-destructive">{error.message}</div>
                      )}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cardholderName"
                  rules={{ required: "Cardholder name is required" }}
                  render={({ field, fieldState: { error } }) => (
                    <FormItem>
                      <FormLabel className={user?.preferLargeText ? "text-lg" : ""}>
                        Cardholder Name
                      </FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          className={`${user?.preferLargeText ? "text-lg" : ""} ${error ? "border-destructive" : ""}`}
                          placeholder="Enter cardholder name"
                        />
                      </FormControl>
                      {error && (
                        <div className="text-sm text-destructive">{error.message}</div>
                      )}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="expiryDate"
                  rules={{
                    required: "Expiry date is required",
                    pattern: {
                      value: /^\d{2}\/\d{2}$/,
                      message: "Expiry date must be in MM/YY format"
                    }
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <FormItem>
                      <FormLabel className={user?.preferLargeText ? "text-lg" : ""}>
                        Expiry Date (MM/YY)
                      </FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          className={`${user?.preferLargeText ? "text-lg" : ""} ${error ? "border-destructive" : ""}`}
                          placeholder="MM/YY"
                        />
                      </FormControl>
                      {error && (
                        <div className="text-sm text-destructive">{error.message}</div>
                      )}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dailyLimit"
                  rules={{
                    required: "Please enter a daily spending limit",
                    min: { value: 0, message: "Daily limit must be greater than 0" },
                    validate: {
                      validNumber: (value) => !isNaN(value) || "Please enter a valid amount",
                      validDecimal: (value) => 
                        Number.isFinite(parseFloat(value)) || "Please enter a valid amount with up to 2 decimal places",
                      positiveAmount: (value) => parseFloat(value) > 0 || "Amount must be greater than 0"
                    }
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <FormItem>
                      <FormLabel className={user?.preferLargeText ? "text-lg" : ""}>
                        Daily Limit
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="Enter daily spending limit"
                          className={`${user?.preferLargeText ? "text-lg" : ""} ${
                            error ? "border-destructive" : ""
                          }`}
                        />
                      </FormControl>
                      {error && (
                        <div className="text-sm text-destructive">{error.message}</div>
                      )}
                      {field.value > 0 && (
                        <div className="text-sm text-muted-foreground">
                          Will be displayed as: {formatCurrency(parseFloat(field.value.toString()))}
                        </div>
                      )}
                    </FormItem>
                  )}
                />
              </div>
              <Button
                type="submit"
                className={`w-full gap-2 ${user?.preferLargeText ? "text-lg" : ""}`}
                disabled={addCardMutation.isPending}
              >
                <Plus className="h-4 w-4" />
                Add Card
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}