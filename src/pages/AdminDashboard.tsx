import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MobileHeader } from '@/components/MobileHeader';
import { toast } from 'sonner';

interface Signup {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  signup_type: 'contact' | 'waitlist';
  created_at: string;
}

const AdminDashboard = () => {
  const [signups, setSignups] = useState<Signup[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    contacts: 0,
    waitlist: 0,
    today: 0
  });

  useEffect(() => {
    fetchSignups();
  }, []);

  const fetchSignups = async () => {
    try {
      // Get signups from localStorage
      const signups = JSON.parse(localStorage.getItem('climatefax_signups') || '[]');
      
      setSignups(signups);
      
      // Calculate stats
      const today = new Date().toISOString().split('T')[0];
      const todaySignups = signups.filter((signup: Signup) => 
        signup.created_at.startsWith(today)
      ).length;
      
      setStats({
        total: signups.length,
        contacts: signups.filter((s: Signup) => s.signup_type === 'contact').length,
        waitlist: signups.filter((s: Signup) => s.signup_type === 'waitlist').length,
        today: todaySignups
      });
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load signups');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <MobileHeader title="Admin Dashboard" showBackButton />
        <main className="flex-1 container max-w-6xl mx-auto p-4">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading signups...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <MobileHeader title="Admin Dashboard" showBackButton />
      
      <main className="flex-1 container max-w-6xl mx-auto p-4 space-y-6">
        {/* Debug Info */}
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h3 className="font-medium mb-2">Debug Info:</h3>
          <p className="text-sm">Raw localStorage data: {localStorage.getItem('climatefax_signups') || 'null'}</p>
          <button 
            onClick={() => {
              const testSignup = {
                id: Date.now().toString(),
                name: 'Test User',
                email: 'test@example.com', 
                subject: 'Test',
                message: 'Test message',
                signup_type: 'contact',
                created_at: new Date().toISOString()
              };
              const existing = JSON.parse(localStorage.getItem('climatefax_signups') || '[]');
              existing.push(testSignup);
              localStorage.setItem('climatefax_signups', JSON.stringify(existing));
              fetchSignups();
            }}
            className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm"
          >
            Add Test Signup
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Signups</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Contact Forms</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.contacts}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Waitlist</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.waitlist}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.today}</div>
            </CardContent>
          </Card>
        </div>

        {/* Signups Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Signups</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {signups.map((signup) => (
                    <TableRow key={signup.id}>
                      <TableCell className="font-medium">{signup.name}</TableCell>
                      <TableCell>{signup.email}</TableCell>
                      <TableCell>
                        <Badge variant={signup.signup_type === 'waitlist' ? 'secondary' : 'default'}>
                          {signup.signup_type}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{signup.subject}</TableCell>
                      <TableCell>{formatDate(signup.created_at)}</TableCell>
                    </TableRow>
                  ))}
                  {signups.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        No signups yet
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;