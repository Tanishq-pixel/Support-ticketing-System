import React from 'react';
import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTickets } from '../contexts/TicketContext';
import { useNavigate } from 'react-router-dom';
import { Plus, TicketIcon, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import TicketCard from '../components/Tickets/TicketCard';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { tickets, loading, loadTickets } = useTickets();
  const navigate = useNavigate();

  useEffect(() => {
    loadTickets();
  }, []);

  const userTickets = user?.role === 'admin' 
    ? tickets 
    : tickets.filter(ticket => ticket.userId === user?.id);

  const recentTickets = userTickets.slice(0, 3);

  const stats = {
    total: userTickets.length,
    open: userTickets.filter(t => t.status === 'Open').length,
    inProgress: userTickets.filter(t => t.status === 'In Progress').length,
    resolved: userTickets.filter(t => t.status === 'Resolved').length,
  };

  const statCards = [
    {
      title: 'Total Tickets',
      value: stats.total,
      icon: TicketIcon,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Open',
      value: stats.open,
      icon: AlertCircle,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600'
    },
    {
      title: 'In Progress',
      value: stats.inProgress,
      icon: Clock,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    },
    {
      title: 'Resolved',
      value: stats.resolved,
      icon: CheckCircle,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-blue-100 mb-4">
          {user?.role === 'admin' 
            ? 'Manage and respond to support tickets across the platform.'
            : 'Track your support requests and get help when you need it.'
          }
        </p>
        {user?.role !== 'admin' && (
          <button
            onClick={() => navigate('/create-ticket')}
            className="flex items-center space-x-2 bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Ticket</span>
          </button>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.bgColor} mr-4`}>
                  <Icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Tickets */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {user?.role === 'admin' ? 'Recent Tickets' : 'Your Recent Tickets'}
          </h2>
          <button
            onClick={() => navigate(user?.role === 'admin' ? '/admin/tickets' : '/my-tickets')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            View all
          </button>
        </div>

        {recentTickets.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {recentTickets.map((ticket) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                onClick={() => navigate(`/ticket/${ticket.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <TicketIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets yet</h3>
            <p className="text-gray-600 mb-4">
              {user?.role === 'admin' 
                ? 'No tickets have been created yet.'
                : 'You haven\'t created any support tickets yet.'
              }
            </p>
            {user?.role !== 'admin' && (
              <button
                onClick={() => navigate('/create-ticket')}
                className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Create Your First Ticket</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;