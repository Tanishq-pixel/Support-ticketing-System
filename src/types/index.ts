export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  category: 'Technical' | 'Billing' | 'General';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  priority: 'Low' | 'Medium' | 'High';
  userId: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  responses: TicketResponse[];
}

export interface TicketResponse {
  id: string;
  ticketId: string;
  userId: string;
  userName: string;
  userRole: 'user' | 'admin';
  message: string;
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export interface TicketContextType {
  tickets: Ticket[];
  loading: boolean;
  loadTickets: (filters?: any) => Promise<void>;
  createTicket: (ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'responses'>) => void;
  updateTicketStatus: (ticketId: string, status: Ticket['status']) => void;
  addResponse: (ticketId: string, message: string) => void;
  assignTicket: (ticketId: string, adminId: string) => void;
}