import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import CardManager from "@/components/CardManager";

export default function CardsPage() {
  const { user } = useAuth();

  return (
    <div className={`min-h-screen bg-background p-6 ${user?.preferLargeText ? "text-xl" : "text-base"}`}>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className={`font-bold ${user?.preferLargeText ? "text-4xl" : "text-2xl"}`}>
            Card Management
          </h1>
        </div>

        <CardManager />
      </div>
    </div>
  );
}
