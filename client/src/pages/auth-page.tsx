import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Redirect } from "wouter";
import { Wallet } from "lucide-react";

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();

  const loginForm = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const registerForm = useForm({
    defaultValues: {
      username: "",
      password: "",
      fullName: "",
      phone: "",
    },
  });

  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8">
        <div className="flex flex-col justify-center">
          <div className="mb-8 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-6">
              <Wallet className="h-16 w-16 text-primary" />
              <h1 className="text-5xl font-bold text-primary">SeniorFinance</h1>
            </div>
            <p className="text-xl text-foreground">
              Secure and simple financial management designed for seniors
            </p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 h-14">
              <TabsTrigger value="login" className="text-lg">Login</TabsTrigger>
              <TabsTrigger value="register" className="text-lg">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card className="p-8">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit((data) => loginMutation.mutate(data))} className="space-y-6">
                    <FormField
                      control={loginForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg font-medium">Username</FormLabel>
                          <FormControl>
                            <Input {...field} type="text" className="text-lg h-12" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg font-medium">Password</FormLabel>
                          <FormControl>
                            <Input {...field} type="password" className="text-lg h-12" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full text-lg h-12 text-xl"
                      disabled={loginMutation.isPending}
                    >
                      Sign In
                    </Button>
                  </form>
                </Form>
              </Card>
            </TabsContent>

            <TabsContent value="register">
              <Card className="p-8">
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit((data) => registerMutation.mutate(data))} className="space-y-6">
                    <FormField
                      control={registerForm.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg font-medium">Full Name</FormLabel>
                          <FormControl>
                            <Input {...field} type="text" className="text-lg h-12" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg font-medium">Username</FormLabel>
                          <FormControl>
                            <Input {...field} type="text" className="text-lg h-12" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg font-medium">Password</FormLabel>
                          <FormControl>
                            <Input {...field} type="password" className="text-lg h-12" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg font-medium">Phone Number</FormLabel>
                          <FormControl>
                            <Input {...field} type="tel" className="text-lg h-12" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full text-lg h-12 text-xl"
                      disabled={registerMutation.isPending}
                    >
                      Create Account
                    </Button>
                  </form>
                </Form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="hidden md:flex flex-col justify-center p-8 bg-primary text-primary-foreground rounded-lg">
          <h2 className="text-4xl font-bold mb-8">Why Choose SeniorFinance?</h2>
          <ul className="space-y-6 text-xl">
            <li>✓ Large text option for better readability</li>
            <li>✓ Voice commands for easy navigation</li>
            <li>✓ Secure transaction monitoring</li>
            <li>✓ Emergency contact system</li>
            <li>✓ Educational resources</li>
            <li>✓ Fraud prevention tools</li>
          </ul>
        </div>
      </div>
    </div>
  );
}