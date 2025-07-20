import React, { createContext, useContext, useState } from 'react';
import { Ticket, TicketContextType, TicketResponse } from '../types';
import { apiService } from '../services/api';
import { useAuth } from './AuthContext';

const TicketContext = createContext<TicketContextType | undefined>(undefined);

export const useTickets = () => {
  const context = useContext(TicketContext);
  if (context === undefined) {
    throw new Error('useTickets must be used within a TicketProvider');
  }
  return context;
};

export const TicketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const loadTickets = async (filters?: any) => {
    try {
      setLoading(true);
      const response = await apiService.getTickets(filters);
      if (response.success) {
        // Transform Laravel response to match frontend types
        const transformedTickets = response.tickets.data.map((ticket: any) => ({
          id: ticket.id.toString(),
          title: ticket.title,
          description: ticket.description,
          category: ticket.category,
          status: ticket.status,
          priority: ticket.priority,
          userId: ticket.user_id.toString(),
          assignedTo: ticket.assigned_to?.toString(),
          createdAt: ticket.created_at,
          updatedAt: ticket.updated_at,
          responses: ticket.responses?.map((response: any) => ({
            id: response.id.toString(),
            ticketId: response.ticket_id.toString(),
            userId: response.user_id.toString(),
            userName: response.user.name,
            userRole: response.user.role,
            message: response.message,
            createdAt: response.created_at
          })) || []
        }));
        setTickets(transformedTickets);
      }
    } catch (error) {
      console.error('Error loading tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const createTicket = async (ticketData: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'responses'>) => {
    try {
      const response = await apiService.createTicket({
        title: ticketData.title,
        description: ticketData.description,
        category: ticketData.category,
        priority: ticketData.priority
      });
      
      if (response.success) {
        // Reload tickets to get updated list
        await loadTickets();
      }
    } catch (error) {
      console.error('Error creating ticket:', error);
      throw error;
    }
  };

  const updateTicketStatus = async (ticketId: string, status: Ticket['status']) => {
    try {
      const response = await apiService.updateTicket(ticketId, { status });
      if (response.success) {
        setTickets(prev =>
          prev.map(ticket =>
            ticket.id === ticketId
              ? { ...ticket, status, updatedAt: new Date().toISOString() }
              : ticket
          )
        );
      }
    } catch (error) {
      console.error('Error updating ticket status:', error);
    }
  };

  const addResponse = async (ticketId: string, message: string) => {
    try {
      const response = await apiService.addTicketResponse(ticketId, message);
      if (response.success) {
        const newResponse: TicketResponse = {
          id: response.response.id.toString(),
          ticketId,
          userId: response.response.user_id.toString(),
          userName: response.response.user.name,
          userRole: response.response.user.role,
          message: response.response.message,
          createdAt: response.response.created_at
        };

        setTickets(prev =>
          prev.map(ticket =>
            ticket.id === ticketId
              ? {
                  ...ticket,
                  responses: [...ticket.responses, newResponse],
                  updatedAt: new Date().toISOString()
                }
              : ticket
          )
        );
      }
    } catch (error) {
      console.error('Error adding response:', error);
    }
  };

  const assignTicket = async (ticketId: string, adminId: string) => {
    try {
      const response = await apiService.assignTicket(ticketId, adminId);
      if (response.success) {
        setTickets(prev =>
          prev.map(ticket =>
            ticket.id === ticketId
              ? { ...ticket, assignedTo: adminId, updatedAt: new Date().toISOString() }
              : ticket
          )
        );
      }
    } catch (error) {
      console.error('Error assigning ticket:', error);
    }
  };

  return (
    <TicketContext.Provider value={{
      tickets,
      loading,
      loadTickets,
      createTicket,
      updateTicketStatus,
      addResponse,
      assignTicket
    }}>
      {children}
    </TicketContext.Provider>
  );
};