# Support Ticketing System - Laravel Backend

This is the PHP Laravel backend for the Support Ticketing System.

## Features

- User authentication with Laravel Sanctum
- Role-based access control (User/Admin)
- Complete ticket management system
- RESTful API endpoints
- Database migrations and seeders
- CORS support for frontend integration

## Installation

1. **Clone and setup:**
   ```bash
   cd backend
   composer install
   cp .env.example .env
   ```

2. **Configure database in `.env`:**
   ```
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=support_ticketing
   DB_USERNAME=root
   DB_PASSWORD=your_password
   ```

3. **Generate application key:**
   ```bash
   php artisan key:generate
   ```

4. **Run migrations and seeders:**
   ```bash
   php artisan migrate --seed
   ```

5. **Start the server:**
   ```bash
   php artisan serve
   ```

## API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/user` - Get current user

### Tickets
- `GET /api/tickets` - Get tickets (filtered by user role)
- `POST /api/tickets` - Create new ticket
- `GET /api/tickets/{id}` - Get specific ticket
- `PUT /api/tickets/{id}` - Update ticket (admin only)
- `POST /api/tickets/{id}/responses` - Add response to ticket
- `GET /api/tickets-stats` - Get ticket statistics

### Admin
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/{id}/role` - Update user role
- `POST /api/admin/tickets/{id}/assign` - Assign ticket to admin
- `GET /api/admin/admins` - Get all admin users
- `GET /api/admin/dashboard-stats` - Get admin dashboard statistics

## Default Users

After running the seeder, you'll have these test accounts:

- **Admin:** admin@example.com / password
- **User 1:** john@example.com / password
- **User 2:** jane@example.com / password

## Database Schema

### Users Table
- id, name, email, password, role (user/admin), timestamps

### Tickets Table
- id, title, description, category, status, priority, user_id, assigned_to, timestamps

### Ticket Responses Table
- id, ticket_id, user_id, message, timestamps

## Frontend Integration

The backend is configured to work with a React frontend running on `http://localhost:3000`. CORS is properly configured for this setup.

## Security Features

- Laravel Sanctum for API authentication
- Role-based access control
- Input validation on all endpoints
- CSRF protection
- SQL injection protection through Eloquent ORM

## Development

- Use `php artisan tinker` for database testing
- Run `php artisan migrate:fresh --seed` to reset database
- Check logs in `storage/logs/laravel.log`
- Use `php artisan route:list` to see all available routes