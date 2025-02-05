import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import TransactionList from "@/components/TransactionList";
import BudgetTracker from "@/components/BudgetTracker";
import EmergencyContacts from "@/components/EmergencyContacts";
import VoiceCommands from "@/components/VoiceCommands";
import { Settings, Book, LogOut, CreditCard } from "lucide-react";

export default function HomePage() {
  const { user, logoutMutation } = useAuth();
  const [largeText, setLargeText] = useState(user?.preferLargeText || false);

  const textStyles = largeText ? "text-xl" : "text-base";

  return (
    <div className={`min-h-screen bg-background p-6 ${textStyles}`}>
      <VoiceCommands />

      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className={`font-bold ${largeText ? "text-4xl" : "text-2xl"}`}>
            Welcome, {user?.fullName}
          </h1>
          <div className="flex gap-4">
            <Link href="/cards">
              <Button variant="outline" className="gap-2">
                <CreditCard size={20} />
                Manage Cards
              </Button>
            </Link>
            <Button
              variant="outline"
              onClick={() => setLargeText(!largeText)}
              className="gap-2"
            >
              <Settings size={20} />
              {largeText ? "Normal Text" : "Large Text"}
            </Button>
            <Link href="/education">
              <Button variant="outline" className="gap-2">
                <Book size={20} />
                Learning Center
              </Button>
            </Link>
            <Button
              variant="destructive"
              onClick={() => logoutMutation.mutate()}
              className="gap-2"
            >
              <LogOut size={20} />
              Sign Out
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className={`font-semibold mb-4 ${largeText ? "text-2xl" : "text-xl"}`}>
              Recent Transactions
            </h2>
            <TransactionList />
          </Card>

          <Card className="p-6">
            <h2 className={`font-semibold mb-4 ${largeText ? "text-2xl" : "text-xl"}`}>
              Budget Overview
            </h2>
            <BudgetTracker />
          </Card>
        </div>

        <Card className="mt-6 p-6">
          <h2 className={`font-semibold mb-4 ${largeText ? "text-2xl" : "text-xl"}`}>
            Emergency Contacts
          </h2>
          <EmergencyContacts />
        </Card>
      </div>
    </div>
  );
}