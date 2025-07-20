import React, { useState } from 'react';
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTickets } from '../../contexts/TicketContext';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/api';
import { ArrowLeft, Send, Clock, User } from 'lucide-react';

const TicketDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addResponse, updateTicketStatus } = useTickets();
  const { user } = useAuth();
  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [newResponse, setNewResponse] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      loadTicket(id);
    }
  }, [id]);

  const loadTicket = async (ticketId: string) => {
    try {
      setLoading(true);
      const response = await apiService.getTicket(ticketId);
      if (response.success) {
        // Transform Laravel response to match frontend types
        const transformedTicket = {
          id: response.ticket.id.toString(),
          title: response.ticket.title,
          description: response.ticket.description,
          category: response.ticket.category,
          status: response.ticket.status,
          priority: response.ticket.priority,
          userId: response.ticket.user_id.toString(),
          assignedTo: response.ticket.assigned_to?.toString(),
          createdAt: response.ticket.created_at,
          updatedAt: response.ticket.updated_at,
          responses: response.ticket.responses?.map((resp: any) => ({
            id: resp.id.toString(),
            ticketId: resp.ticket_id.toString(),
            userId: resp.user_id.toString(),
            userName: resp.user.name,
            userRole: resp.user.role,
            message: resp.message,
            createdAt: resp.created_at
          })) || []
        };
        setTicket(transformedTicket);
      }
    } catch (error) {
      console.error('Error loading ticket:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Ticket Not Found</h2>
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:text-blue-700"
        >
          Go back
        </button>
      </div>
    );
  }

  const handleSubmitResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResponse.trim()) return;

    setIsSubmitting(true);
    try {
      await addResponse(ticket.id, newResponse);
      setNewResponse('');
      // Reload ticket to get updated responses
      await loadTicket(ticket.id);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = (newStatus: 'Open' | 'In Progress' | 'Resolved' | 'Closed') => {
    updateTicketStatus(ticket.id, newStatus);
    setTicket(prev => ({ ...prev, status: newStatus }));
  };

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Ticket Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{ticket.title}</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>Ticket #{ticket.id}</span>
                <span>•</span>
                <span>Created {formatDate(ticket.createdAt)}</span>
                <span>•</span>
                <span>Updated {formatDate(ticket.updatedAt)}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(ticket.status)}`}>
              {ticket.status}
            </span>
            <span className="px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800">
              {ticket.category}
            </span>
            <span className="px-3 py-1 text-sm font-medium rounded-full bg-purple-100 text-purple-800">
              {ticket.priority} Priority
            </span>
          </div>

          {user?.role === 'admin' && (
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Status:</span>
              <select
                value={ticket.status}
                onChange={(e) => handleStatusChange(e.target.value as any)}
                className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          )}
        </div>

        {/* Conversation */}
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Conversation</h2>
          <div className="space-y-4">
            {ticket.responses.map((response) => (
              <div
                key={response.id}
                className={`flex ${response.userRole === 'admin' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-2xl rounded-lg p-4 ${
                    response.userRole === 'admin'
                      ? 'bg-blue-50 border border-blue-200'
                      : 'bg-gray-50 border border-gray-200'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="font-medium text-gray-900">{response.userName}</span>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        response.userRole === 'admin'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {response.userRole}
                    </span>
                    <span className="text-sm text-gray-500 flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatDate(response.createdAt)}</span>
                    </span>
                  </div>
                  <p className="text-gray-700">{response.message}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Add Response Form */}
          {ticket.status !== 'Closed' && (
            <form onSubmit={handleSubmitResponse} className="mt-6 pt-6 border-t border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add Response
              </label>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <textarea
                    value={newResponse}
                    onChange={(e) => setNewResponse(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Type your response..."
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  disabled={isSubmitting || !newResponse.trim()}
                  className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Sending...' : 'Send Response'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;