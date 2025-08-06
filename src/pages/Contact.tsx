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
  message: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const ContactPage = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = async (data: FormValues) => {
    try {
      // Call Supabase edge function to save signup
      const response = await fetch('/functions/v1/submit-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          subject: 'Contact Form Submission',
          signup_type: 'contact'
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit');
      }

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
      <MobileHeader title="" showBackButton>
        <div className="flex flex-col items-center justify-center w-full">
          <div className="text-2xl font-bold relative">
            <span className="text-black">Climate</span>
            <span className="text-orange-500">FAX</span>
            <span className="absolute top-0 right-0 -mt-1 -mr-3 text-xs">®</span>
          </div>
        </div>
      </MobileHeader>
      
      <main className="flex-1 container max-w-lg mx-auto p-4 pb-20">
        <div className="space-y-8">
          <section className="space-y-2">
            <h2 className="text-2xl font-bold">Get in Touch</h2>
            <p className="text-muted-foreground">
              We hope you enjoy exploring our free Beta* model!<br /><br />
              Have questions about ClimateFAX or want to join our waitlist for premium features? Contact us here:
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
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Optional Message/Suggestions</FormLabel>
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
              </form>
            </Form>
          </section>

          {/* Waitlist Button */}
          <section className="text-center">
            <Button 
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg"
              onClick={async () => {
                const formData = form.getValues();
                try {
                  const response = await fetch('/functions/v1/submit-signup', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      name: formData.name || 'Anonymous',
                      email: formData.email || 'waitlist@climatefax.com',
                      subject: 'Premium Features Waitlist',
                      message: formData.message || 'User joined waitlist from contact page',
                      signup_type: 'waitlist'
                    }),
                  });
                  
                  if (response.ok) {
                    toast.success("Added to waitlist!", {
                      description: "We'll contact you when premium features are available.",
                    });
                    form.reset();
                  } else {
                    toast.error("Something went wrong", {
                      description: "Please try again later.",
                    });
                  }
                } catch (error) {
                  toast.error("Something went wrong", {
                    description: "Please try again later.",
                  });
                }
              }}
            >
              🚀 Join Waitlist
            </Button>
            <p className="text-xs text-muted-foreground italic mt-2 text-center">
              * Beta version - All features and data are for evaluation purposes only.<br />
              Patents pending.
            </p>
          </section>
          
          <section className="bg-white rounded-lg border p-4 shadow-sm">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-orange-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium">Our Office</h3>
                  <address className="not-italic text-muted-foreground text-sm">
                    Pacific Design Center - Red Building<br />
                    750 N San Vicente Blvd.<br />
                    Suite 800 West<br />
                    W. Hollywood, CA 90069
                  </address>
                </div>
              </div>
              <div className="rounded-lg overflow-hidden">
                <img 
                  src="/public/lovable-uploads/339de29b-268c-4aaa-8ee8-2aa43fe2acdf.png"
                  alt="Pacific Design Center - Red, Green & Blue Buildings"
                  className="w-full h-48 object-cover"
                />
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
