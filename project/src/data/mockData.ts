import { User, Ticket } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'john@example.com',
    name: 'John Doe',
    role: 'user'
  },
  {
    id: '2',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin'
  },
  {
    id: '3',
    email: 'jane@example.com',
    name: 'Jane Smith',
    role: 'user'
  }
];

export const mockTickets: Ticket[] = [
  {
    id: '1',
    title: 'Unable to access my account',
    description: 'I keep getting an error message when trying to log in. The error says "Invalid credentials" but I\'m sure my password is correct.',
    category: 'Technical',
    status: 'Open',
    priority: 'High',
    userId: '1',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    responses: [
      {
        id: '1',
        ticketId: '1',
        userId: '1',
        userName: 'John Doe',
        userRole: 'user',
        message: 'I keep getting an error message when trying to log in.',
        createdAt: '2024-01-15T10:30:00Z'
      }
    ]
  },
  {
    id: '2',
    title: 'Billing discrepancy in latest invoice',
    description: 'There seems to be an error in my latest invoice. I was charged twice for the same service.',
    category: 'Billing',
    status: 'In Progress',
    priority: 'Medium',
    userId: '3',
    assignedTo: '2',
    createdAt: '2024-01-14T14:20:00Z',
    updatedAt: '2024-01-15T09:15:00Z',
    responses: [
      {
        id: '2',
        ticketId: '2',
        userId: '3',
        userName: 'Jane Smith',
        userRole: 'user',
        message: 'There seems to be an error in my latest invoice.',
        createdAt: '2024-01-14T14:20:00Z'
      },
      {
        id: '3',
        ticketId: '2',
        userId: '2',
        userName: 'Admin User',
        userRole: 'admin',
        message: 'Thank you for reporting this. I\'m looking into your billing history and will have an update soon.',
        createdAt: '2024-01-15T09:15:00Z'
      }
    ]
  },
  {
    id: '3',
    title: 'Feature request: Dark mode',
    description: 'Would it be possible to add a dark mode theme to the application? It would greatly improve the user experience during evening hours.',
    category: 'General',
    status: 'Resolved',
    priority: 'Low',
    userId: '1',
    assignedTo: '2',
    createdAt: '2024-01-12T16:45:00Z',
    updatedAt: '2024-01-13T11:30:00Z',
    responses: [
      {
        id: '4',
        ticketId: '3',
        userId: '1',
        userName: 'John Doe',
        userRole: 'user',
        message: 'Would it be possible to add a dark mode theme?',
        createdAt: '2024-01-12T16:45:00Z'
      },
      {
        id: '5',
        ticketId: '3',
        userId: '2',
        userName: 'Admin User',
        userRole: 'admin',
        message: 'Great suggestion! This is already on our roadmap for the next quarter.',
        createdAt: '2024-01-13T11:30:00Z'
      }
    ]
  }
];