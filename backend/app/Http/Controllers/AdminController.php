<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminController extends Controller
{
    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            if (!Auth::user()->isAdmin()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized. Admin access required.',
                ], 403);
            }
            return $next($request);
        });
    }

    public function getUsers(Request $request)
    {
        $query = User::query();

        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($request->has('role') && $request->role !== 'all') {
            $query->where('role', $request->role);
        }

        $users = $query->withCount('tickets')->orderBy('created_at', 'desc')->paginate(10);

        return response()->json([
            'success' => true,
            'users' => $users,
        ]);
    }

    public function updateUserRole(Request $request, $id)
    {
        $request->validate([
            'role' => 'required|in:user,admin',
        ]);

        $user = User::findOrFail($id);
        
        // Prevent changing own role
        if ($user->id === Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot change your own role',
            ], 400);
        }

        $user->update(['role' => $request->role]);

        return response()->json([
            'success' => true,
            'user' => $user,
        ]);
    }

    public function assignTicket(Request $request, $ticketId)
    {
        $request->validate([
            'admin_id' => 'required|exists:users,id',
        ]);

        $admin = User::findOrFail($request->admin_id);
        
        if (!$admin->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Can only assign tickets to admin users',
            ], 400);
        }

        $ticket = Ticket::findOrFail($ticketId);
        $ticket->update(['assigned_to' => $request->admin_id]);
        $ticket->load(['user', 'assignedTo', 'responses.user']);

        return response()->json([
            'success' => true,
            'ticket' => $ticket,
        ]);
    }

    public function getAdmins()
    {
        $admins = User::where('role', 'admin')->select('id', 'name', 'email')->get();

        return response()->json([
            'success' => true,
            'admins' => $admins,
        ]);
    }

    public function getDashboardStats()
    {
        $stats = [
            'total_tickets' => Ticket::count(),
            'total_users' => User::where('role', 'user')->count(),
            'total_admins' => User::where('role', 'admin')->count(),
            'tickets_by_status' => [
                'open' => Ticket::byStatus('Open')->count(),
                'in_progress' => Ticket::byStatus('In Progress')->count(),
                'resolved' => Ticket::byStatus('Resolved')->count(),
                'closed' => Ticket::byStatus('Closed')->count(),
            ],
            'tickets_by_category' => [
                'technical' => Ticket::byCategory('Technical')->count(),
                'billing' => Ticket::byCategory('Billing')->count(),
                'general' => Ticket::byCategory('General')->count(),
            ],
            'tickets_by_priority' => [
                'high' => Ticket::byPriority('High')->count(),
                'medium' => Ticket::byPriority('Medium')->count(),
                'low' => Ticket::byPriority('Low')->count(),
            ],
            'recent_tickets' => Ticket::with(['user', 'assignedTo'])
                ->orderBy('created_at', 'desc')
                ->limit(5)
                ->get(),
        ];

        return response()->json([
            'success' => true,
            'stats' => $stats,
        ]);
    }
}