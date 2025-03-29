
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const SplashPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading resources
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleContinue = () => {
    navigate('/home');
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

        {loading ? (
          <div className="flex justify-center">
            <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                  <span className="text-3xl">🔥</span>
                  <p className="text-sm mt-2">Natural Disaster Risks</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                  <span className="text-3xl">🏡</span>
                  <p className="text-sm mt-2">Protect Equity</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                  <span className="text-3xl">📊</span>
                  <p className="text-sm mt-2">Long Term Predictions</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                  <span className="text-3xl">👨‍👩‍👧‍👦</span>
                  <p className="text-sm mt-2">Personalized</p>
                </div>
              </div>
              
              <Button 
                className="w-full bg-orange-500 hover:bg-orange-600" 
                onClick={handleContinue}
              >
                Get Started
              </Button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default SplashPage;
