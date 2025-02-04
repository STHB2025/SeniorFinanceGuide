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
  FormLabel
} from "@/components/ui/form";
import { Loader2, Plus, Phone, Mail, User } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";

type EmergencyContact = {
  id: number;
  name: string;
  phone: string;
  email: string;
  relationship: string;
};

export default function EmergencyContacts() {
  const { user } = useAuth();
  const { toast } = useToast();
  const form = useForm<Omit<EmergencyContact, "id">>();

  const { data: contacts, isLoading } = useQuery<EmergencyContact[]>({
    queryKey: ["/api/emergency-contacts"],
  });

  const addContactMutation = useMutation({
    mutationFn: async (data: Omit<EmergencyContact, "id">) => {
      const res = await apiRequest("POST", "/api/emergency-contacts", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/emergency-contacts"] });
      form.reset();
      toast({
        title: "Contact Added",
        description: "Emergency contact has been added successfully.",
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

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        {contacts?.map((contact) => (
          <Card key={contact.id}>
            <CardContent className="pt-6">
              <div className="flex flex-col space-y-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className={user?.preferLargeText ? "text-lg" : ""}>
                    {contact.name} ({contact.relationship})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a 
                    href={`tel:${contact.phone}`}
                    className={`text-primary hover:underline ${user?.preferLargeText ? "text-lg" : ""}`}
                  >
                    {contact.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a 
                    href={`mailto:${contact.email}`}
                    className={`text-primary hover:underline ${user?.preferLargeText ? "text-lg" : ""}`}
                  >
                    {contact.email}
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className={user?.preferLargeText ? "text-2xl" : "text-xl"}>
            Add Emergency Contact
          </CardTitle>
          <CardDescription className={user?.preferLargeText ? "text-lg" : ""}>
            Add a trusted person who can help you with financial decisions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form 
              onSubmit={form.handleSubmit((data) => addContactMutation.mutate(data))}
              className="space-y-4"
            >
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={user?.preferLargeText ? "text-lg" : ""}>
                        Full Name
                      </FormLabel>
                      <FormControl>
                        <Input {...field} className={user?.preferLargeText ? "text-lg" : ""} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="relationship"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={user?.preferLargeText ? "text-lg" : ""}>
                        Relationship
                      </FormLabel>
                      <FormControl>
                        <Input {...field} className={user?.preferLargeText ? "text-lg" : ""} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={user?.preferLargeText ? "text-lg" : ""}>
                        Phone Number
                      </FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="tel"
                          className={user?.preferLargeText ? "text-lg" : ""} 
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={user?.preferLargeText ? "text-lg" : ""}>
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="email"
                          className={user?.preferLargeText ? "text-lg" : ""} 
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <Button 
                type="submit"
                className={`w-full gap-2 ${user?.preferLargeText ? "text-lg" : ""}`}
                disabled={addContactMutation.isPending}
              >
                <Plus className="h-4 w-4" />
                Add Contact
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
