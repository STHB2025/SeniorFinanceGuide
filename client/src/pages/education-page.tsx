import { useState } from "react";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Play, Book, Shield, PiggyBank, CreditCard } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

type LessonType = {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  icon: JSX.Element;
};

const lessons: Record<string, LessonType[]> = {
  basics: [
    {
      id: "digital-banking",
      title: "Introduction to Digital Banking",
      description: "Learn the fundamentals of online banking and how to securely manage your accounts.",
      videoUrl: "https://www.youtube.com/embed/example1",
      icon: <CreditCard className="h-6 w-6" />,
    },
    {
      id: "budgeting",
      title: "Creating a Monthly Budget",
      description: "Simple steps to track your income and expenses effectively.",
      videoUrl: "https://www.youtube.com/embed/example2",
      icon: <PiggyBank className="h-6 w-6" />,
    },
  ],
  security: [
    {
      id: "fraud-prevention",
      title: "Spotting Financial Scams",
      description: "Learn how to identify and avoid common financial scams targeting seniors.",
      videoUrl: "https://www.youtube.com/embed/example3",
      icon: <Shield className="h-6 w-6" />,
    },
    {
      id: "online-safety",
      title: "Online Banking Safety",
      description: "Essential security practices for safe online banking.",
      videoUrl: "https://www.youtube.com/embed/example4",
      icon: <Shield className="h-6 w-6" />,
    },
  ],
};

export default function EducationPage() {
  const { user } = useAuth();
  const [selectedLesson, setSelectedLesson] = useState<LessonType | null>(null);
  const textSize = user?.preferLargeText ? "text-xl" : "text-base";

  return (
    <div className={`min-h-screen bg-background p-6 ${textSize}`}>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className={`font-bold ${user?.preferLargeText ? "text-4xl" : "text-2xl"}`}>
            Learning Center
          </h1>
        </div>

        {selectedLesson ? (
          <div className="space-y-6">
            <Button 
              variant="ghost" 
              onClick={() => setSelectedLesson(null)}
              className="mb-4"
            >
              ← Back to Lessons
            </Button>
            
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                {selectedLesson.icon}
                <h2 className={`font-semibold ${user?.preferLargeText ? "text-2xl" : "text-xl"}`}>
                  {selectedLesson.title}
                </h2>
              </div>
              <p className="text-muted-foreground mb-6">
                {selectedLesson.description}
              </p>
              <div className="aspect-video bg-muted rounded-lg mb-6">
                <iframe 
                  src={selectedLesson.videoUrl}
                  className="w-full h-full rounded-lg"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </Card>
          </div>
        ) : (
          <Tabs defaultValue="basics" className="space-y-6">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="basics" className="gap-2">
                <Book className="h-4 w-4" />
                Banking Basics
              </TabsTrigger>
              <TabsTrigger value="security" className="gap-2">
                <Shield className="h-4 w-4" />
                Security
              </TabsTrigger>
            </TabsList>

            {Object.entries(lessons).map(([category, categoryLessons]) => (
              <TabsContent key={category} value={category} className="grid gap-4 md:grid-cols-2">
                {categoryLessons.map((lesson) => (
                  <Card 
                    key={lesson.id}
                    className="p-6 cursor-pointer hover:bg-accent transition-colors"
                    onClick={() => setSelectedLesson(lesson)}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      {lesson.icon}
                      <h3 className={`font-semibold ${user?.preferLargeText ? "text-xl" : "text-lg"}`}>
                        {lesson.title}
                      </h3>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      {lesson.description}
                    </p>
                    <Button variant="secondary" className="gap-2">
                      <Play className="h-4 w-4" />
                      Start Lesson
                    </Button>
                  </Card>
                ))}
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </div>
  );
}
