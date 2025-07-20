const API_BASE_URL = '/api';

class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  private async handleResponse(response: Response) {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(error.message || 'API request failed');
    }
    return response.json();
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ email, password })
    });
    return this.handleResponse(response);
  }

  async register(name: string, email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ name, email, password })
    });
    return this.handleResponse(response);
  }

  async logout() {
    const response = await fetch(`${API_BASE_URL}/logout`, {
      method: 'POST',
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async getCurrentUser() {
    const response = await fetch(`${API_BASE_URL}/user`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  // Ticket endpoints
  async getTickets(filters?: any) {
    const params = new URLSearchParams();
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key] && filters[key] !== 'all') {
          params.append(key, filters[key]);
        }
      });
    }
    
    const url = `${API_BASE_URL}/tickets${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async getTicket(id: string) {
    const response = await fetch(`${API_BASE_URL}/tickets/${id}`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async createTicket(ticketData: any) {
    const response = await fetch(`${API_BASE_URL}/tickets`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(ticketData)
    });
    return this.handleResponse(response);
  }

  async updateTicket(id: string, data: any) {
    const response = await fetch(`${API_BASE_URL}/tickets/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return this.handleResponse(response);
  }

  async addTicketResponse(ticketId: string, message: string) {
    const response = await fetch(`${API_BASE_URL}/tickets/${ticketId}/responses`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ message })
    });
    return this.handleResponse(response);
  }

  async getTicketStats() {
    const response = await fetch(`${API_BASE_URL}/tickets-stats`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  // Admin endpoints
  async getUsers(filters?: any) {
    const params = new URLSearchParams();
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params.append(key, filters[key]);
        }
      });
    }
    
    const url = `${API_BASE_URL}/admin/users${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async updateUserRole(userId: string, role: string) {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/role`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ role })
    });
    return this.handleResponse(response);
  }

  async assignTicket(ticketId: string, adminId: string) {
    const response = await fetch(`${API_BASE_URL}/admin/tickets/${ticketId}/assign`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ admin_id: adminId })
    });
    return this.handleResponse(response);
  }

  async getAdmins() {
    const response = await fetch(`${API_BASE_URL}/admin/admins`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async getAdminDashboardStats() {
    const response = await fetch(`${API_BASE_URL}/admin/dashboard-stats`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }
}

export const apiService = new ApiService();