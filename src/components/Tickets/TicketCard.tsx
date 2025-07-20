import React from 'react';
import { Ticket } from '../../types';
import { Clock, User, ArrowRight } from 'lucide-react';

interface TicketCardProps {
  ticket: Ticket;
  onClick: () => void;
}

const TicketCard: React.FC<TicketCardProps> = ({ ticket, onClick }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return 'bg-red-100 text-red-800';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'Resolved':
        return 'bg-green-100 text-green-800';
      case 'Closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Technical':
        return 'bg-blue-100 text-blue-800';
      case 'Billing':
        return 'bg-purple-100 text-purple-800';
      case 'General':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
            {ticket.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
            {ticket.description}
          </p>
        </div>
        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors ml-4 mt-1" />
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(ticket.status)}`}>
          {ticket.status}
        </span>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(ticket.priority)}`}>
          {ticket.priority}
        </span>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(ticket.category)}`}>
          {ticket.category}
        </span>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>{formatDate(ticket.createdAt)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <User className="w-3 h-3" />
            <span>#{ticket.id}</span>
          </div>
        </div>
        <div className="text-xs">
          {ticket.responses.length} response{ticket.responses.length !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );
};

export default TicketCard;