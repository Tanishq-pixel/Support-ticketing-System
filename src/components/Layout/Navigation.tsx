import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Home, 
  Plus, 
  List, 
  Settings,
  Users
} from 'lucide-react';

const Navigation: React.FC = () => {
  const { user } = useAuth();

  const userNavItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/create-ticket', label: 'New Ticket', icon: Plus },
    { path: '/my-tickets', label: 'My Tickets', icon: List },
  ];

  const adminNavItems = [
    { path: '/admin', label: 'Admin Dashboard', icon: Settings },
    { path: '/admin/tickets', label: 'All Tickets', icon: List },
    { path: '/admin/users', label: 'Users', icon: Users },
  ];

  const navItems = user?.role === 'admin' ? [...userNavItems, ...adminNavItems] : userNavItems;

  return (
    <nav className="bg-gray-50 border-r border-gray-200 w-64 min-h-screen">
      <div className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;