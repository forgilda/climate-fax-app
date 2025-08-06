import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Mail, MapPin, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MobileHeader } from "@/components/MobileHeader";
import { MobileNav } from "@/components/MobileNav";
import { Copyright } from "@/components/Copyright";

// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

type FormValues = z.infer<typeof formSchema>;

const ContactPage = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = async (data: FormValues) => {
    try {
      // Simulate API call to submit form
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("Form submission data:", data);
      // In a production environment, this would send to a backend API
      // that forwards the email to the account owner

      toast.success("Message sent successfully", {
        description: "Thank you for contacting us. We'll get back to you soon.",
      });
      
      form.reset();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to send message", {
        description: "Please try again later or contact us directly.",
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <MobileHeader title="Contact Us" showBackButton />
      
      <main className="flex-1 container max-w-lg mx-auto p-4 pb-20">
        <div className="space-y-8">
          <section className="space-y-2">
            <h2 className="text-2xl font-bold">Get in Touch</h2>
            <p className="text-muted-foreground">
              Have questions about ClimateFAX or want to join our waitlist for premium features? Contact us below.
            </p>
          </section>

          <section>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="your.email@example.com" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Input placeholder="What's this about?" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="How can we help you?" 
                          className="min-h-[120px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-orange-500 hover:bg-orange-600"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                  <Send className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </Form>
          </section>
          
          <section className="bg-white rounded-lg border p-4 shadow-sm">
            <div className="flex items-start space-x-3">
              <MapPin className="h-5 w-5 text-orange-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-medium">Our Office</h3>
                <address className="not-italic text-muted-foreground text-sm">
                  750 N San Vicente Blvd.<br />
                  Suite 800 West<br />
                  W. Hollywood, CA 90069
                </address>
              </div>
            </div>
          </section>
        </div>
      </main>
      
      <Copyright />
      <MobileNav />
    </div>
  );
};

export default ContactPage;
