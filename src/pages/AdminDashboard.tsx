import React, { useEffect, useState } from 'react';
import { MobileHeader } from '@/components/MobileHeader';

const AdminDashboard = () => {
  const [signups, setSignups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSignups = async () => {
      try {
        const response = await fetch('/functions/v1/get-signups');
        if (response.ok) {
          const data = await response.json();
          setSignups(data.signups || []);
        }
      } catch (error) {
        console.error('Failed to fetch signups:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSignups();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <MobileHeader title="Admin Dashboard" showBackButton />
      
      <main className="flex-1 container max-w-6xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Total Signups: {signups.length}</h1>
        
        {loading ? (
          <div className="text-center py-12">
            <p className="text-xl">Loading signups...</p>
          </div>
        ) : signups.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500">No signups yet</p>
            <p className="text-sm text-gray-400 mt-2">Signups will appear here immediately after someone joins the waitlist</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {signups.map((signup: any, index: number) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <p><span className="font-semibold">Name:</span> {signup.name}</p>
                  <p><span className="font-semibold">Email:</span> {signup.email}</p>
                  <p><span className="font-semibold">Type:</span> <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">{signup.signup_type}</span></p>
                  <p><span className="font-semibold">Date:</span> {new Date(signup.created_at).toLocaleString()}</p>
                  {signup.message && (
                    <p className="md:col-span-2"><span className="font-semibold">Message:</span> {signup.message}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;