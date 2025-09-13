import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Plus, Construction } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function Authors() {
  const { hasRole } = useAuth();
  const canEdit = hasRole('Admin');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Authors</h1>
          <p className="text-muted-foreground">
            Manage author information and biographies
          </p>
        </div>
        {canEdit && (
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Author
          </Button>
        )}
      </div>

      {/* Coming Soon Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Construction className="h-5 w-5 text-warning" />
            Coming Soon
          </CardTitle>
          <CardDescription>
            Author management features are being developed
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-12">
          <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Author Management</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            This feature will allow you to manage author profiles, biographies, and link them to books in your collection.
          </p>
          {canEdit && (
            <Button variant="outline" className="mt-4">
              Request Early Access
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}