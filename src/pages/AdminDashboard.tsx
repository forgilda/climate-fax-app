import React from 'react';
import { MobileHeader } from '@/components/MobileHeader';

const AdminDashboard = () => {
  const signups = JSON.parse(localStorage.getItem('climatefax_signups') || '[]');

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <MobileHeader title="Admin Dashboard" showBackButton />
      
      <main className="flex-1 container max-w-6xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Signups: {signups.length}</h1>
        
        <div className="space-y-4">
          {signups.length === 0 ? (
            <p>No signups yet</p>
          ) : (
            signups.map((signup: any, index: number) => (
              <div key={index} className="border p-4 rounded">
                <p><strong>Name:</strong> {signup.name}</p>
                <p><strong>Email:</strong> {signup.email}</p>
                <p><strong>Type:</strong> {signup.signup_type}</p>
                <p><strong>Date:</strong> {new Date(signup.created_at).toLocaleString()}</p>
                {signup.message && <p><strong>Message:</strong> {signup.message}</p>}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;