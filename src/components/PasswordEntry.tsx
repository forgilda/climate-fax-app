
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface PasswordEntryProps {
  correctPassword: string;
  onPasswordCorrect: () => void;
}

const PasswordEntry = ({ correctPassword, onPasswordCorrect }: PasswordEntryProps) => {
  const [password, setPassword] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === correctPassword) {
      toast.success("Access granted");
      onPasswordCorrect();
    } else {
      toast.error("Incorrect password");
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-orange-50 to-orange-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <div className="mb-6">
          <div className="text-4xl font-bold relative inline-block">
            <span className="text-black">Climate</span>
            <span className="text-orange-500">FAX</span>
            <span className="absolute top-0 right-0 -mt-1 -mr-3 text-xs">®</span>
          </div>
          <p className="text-gray-600 mt-2">
            Find safer ground
          </p>
        </div>

        <motion.div 
          animate={{ x: isShaking ? [-10, 10, -10, 10, 0] : 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white p-6 rounded-lg shadow-md w-full max-w-md mx-auto"
        >
          <h2 className="text-lg font-semibold mb-4">Enter Password</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter access code"
                className="w-full"
                autoFocus
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-orange-500 hover:bg-orange-600"
            >
              Submit
            </Button>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PasswordEntry;
