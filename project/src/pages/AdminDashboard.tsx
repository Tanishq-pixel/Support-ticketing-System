import React from 'react';
import { useTickets } from '../contexts/TicketContext';
import { useNavigate } from 'react-router-dom';
import { TicketIcon, Clock, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';
import TicketCard from '../components/Tickets/TicketCard';

const AdminDashboard: React.FC = () => {
  const { tickets } = useTickets();
  const navigate = useNavigate();

  const recentTickets = tickets.slice(0, 5);

  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'Open').length,
    inProgress: tickets.filter(t => t.status === 'In Progress').length,
    resolved: tickets.filter(t => t.status === 'Resolved').length,
    closed: tickets.filter(t => t.status === 'Closed').length,
  };

  const categoryStats = {
    technical: tickets.filter(t => t.category === 'Technical').length,
    billing: tickets.filter(t => t.category === 'Billing').length,
    general: tickets.filter(t => t.category === 'General').length,
  };

  const priorityStats = {
    high: tickets.filter(t => t.priority === 'High').length,
    medium: tickets.filter(t => t.priority === 'Medium').length,
    low: tickets.filter(t => t.priority === 'Low').length,
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-purple-100">
          Monitor and manage support tickets across the platform
        </p>
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

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tickets by Category</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Technical</span>
              <span className="font-semibold">{categoryStats.technical}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Billing</span>
              <span className="font-semibold">{categoryStats.billing}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">General</span>
              <span className="font-semibold">{categoryStats.general}</span>
            </div>
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tickets by Priority</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-red-600 font-medium">High</span>
              <span className="font-semibold">{priorityStats.high}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-yellow-600 font-medium">Medium</span>
              <span className="font-semibold">{priorityStats.medium}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-green-600 font-medium">Low</span>
              <span className="font-semibold">{priorityStats.low}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Tickets */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Recent Tickets</h2>
          <button
            onClick={() => navigate('/admin/tickets')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            View all tickets
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
            <p className="text-gray-600">
              No support tickets have been created yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;