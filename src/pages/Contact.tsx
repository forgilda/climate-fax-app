import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { MapPin } from "lucide-react";

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
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('https://script.google.com/macros/s/AKfycbyLuDKfLPoRPju7cSL3OcgJ8iH3hm3HMv1UVrGd8P6a8Xfjoz7j6ONfuGY6NAVx6x3bPA/exec', {
        method: 'POST',
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message
        })
      });
      
      // Show success message
      setShowSuccess(true);
      toast.success("Successfully joined the waitlist!");
      
      // Clear form
      setFormData({name: '', email: '', phone: '', message: ''});
      
    } catch (error) {
      console.error('Error:', error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
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
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Name
                </label>
                <Input 
                  id="name"
                  placeholder="Your name" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input 
                  id="email"
                  placeholder="your.email@example.com" 
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">
                  Phone (optional)
                </label>
                <Input 
                  id="phone"
                  placeholder="Your phone number" 
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  Optional Message/Suggestions
                </label>
                <Textarea 
                  id="message"
                  placeholder="How can we help you?" 
                  className="min-h-[120px]"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                />
              </div>
              
              <Button 
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Joining...' : '🚀 Join Waitlist'}
              </Button>
              
              {showSuccess && (
                <div className="text-center text-green-600 font-medium">
                  ✅ Successfully joined the waitlist!
                </div>
              )}
            </form>
          </section>

          <section className="text-center">
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
                  src="https://chapter.digital/wp-content/uploads/2023/10/PacificDesignCenterLosAngelesCA-lg-1779x1054.jpg"
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