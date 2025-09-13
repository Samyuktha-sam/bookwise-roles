import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { BookOpen, FolderOpen, Users, Settings, Shield, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  requiredRoles?: string[];
}

const navigationItems: NavItem[] = [
  {
    title: 'Books',
    href: '/dashboard/books',
    icon: BookOpen,
  },
  {
    title: 'Categories',
    href: '/dashboard/categories',
    icon: FolderOpen,
  },
  {
    title: 'Authors',
    href: '/dashboard/authors',
    icon: Users,
  },
];

const managementItems: NavItem[] = [
  {
    title: 'Users',
    href: '/dashboard/management/users',
    icon: User,
    requiredRoles: ['Admin', 'SuperAdmin'],
  },
  {
    title: 'Roles',
    href: '/dashboard/management/roles',
    icon: Shield,
    requiredRoles: ['SuperAdmin'],
  },
];

export function LeftNav() {
  const { user, hasAnyRole } = useAuth();
  const location = useLocation();

  const NavItemComponent = ({ item }: { item: NavItem }) => {
    const isActive = location.pathname === item.href;
    const Icon = item.icon;

    return (
      <NavLink
        to={item.href}
        className={cn(
          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
          'hover:bg-accent hover:text-accent-foreground',
          isActive 
            ? 'bg-primary text-primary-foreground shadow-sm' 
            : 'text-muted-foreground'
        )}
      >
        <Icon className="h-4 w-4" />
        {item.title}
      </NavLink>
    );
  };

  const filteredManagementItems = managementItems.filter(item => 
    !item.requiredRoles || hasAnyRole(item.requiredRoles as any[])
  );

  return (
    <aside className="w-64 border-r border-nav-border bg-nav-background">
      <nav className="p-4 space-y-6">
        {/* Main Navigation */}
        <div className="space-y-2">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Library
          </h2>
          <div className="space-y-1">
            {navigationItems.map((item) => (
              <NavItemComponent key={item.href} item={item} />
            ))}
          </div>
        </div>

        {/* Management Section - only show if user has access to any management items */}
        {filteredManagementItems.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Management
            </h2>
            <div className="space-y-1">
              {filteredManagementItems.map((item) => (
                <NavItemComponent key={item.href} item={item} />
              ))}
            </div>
          </div>
        )}

        {/* User Info Panel */}
        <div className="pt-4 border-t border-nav-border">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-xs font-semibold text-primary-foreground">
                {user?.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {user?.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {user?.role}
              </p>
            </div>
          </div>
        </div>
      </nav>
    </aside>
  );
}