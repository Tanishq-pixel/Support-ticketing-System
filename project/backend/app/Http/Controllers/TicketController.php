<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Models\TicketResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TicketController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $query = Ticket::with(['user', 'assignedTo', 'responses.user']);

        // If user is not admin, only show their tickets
        if (!$user->isAdmin()) {
            $query->forUser($user->id);
        }

        // Apply filters
        if ($request->has('status') && $request->status !== 'all') {
            $query->byStatus($request->status);
        }

        if ($request->has('category') && $request->category !== 'all') {
            $query->byCategory($request->category);
        }

        if ($request->has('priority') && $request->priority !== 'all') {
            $query->byPriority($request->priority);
        }

        if ($request->has('search') && !empty($request->search)) {
            $query->search($request->search);
        }

        if ($request->has('assigned_to') && !empty($request->assigned_to)) {
            $query->assignedTo($request->assigned_to);
        }

        $tickets = $query->orderBy('created_at', 'desc')->paginate(10);

        return response()->json([
            'success' => true,
            'tickets' => $tickets,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'category' => 'required|in:Technical,Billing,General',
            'priority' => 'required|in:Low,Medium,High',
        ]);

        $ticket = Ticket::create([
            'title' => $request->title,
            'description' => $request->description,
            'category' => $request->category,
            'priority' => $request->priority,
            'status' => 'Open',
            'user_id' => Auth::id(),
        ]);

        // Create initial response with the description
        TicketResponse::create([
            'ticket_id' => $ticket->id,
            'user_id' => Auth::id(),
            'message' => $request->description,
        ]);

        $ticket->load(['user', 'assignedTo', 'responses.user']);

        return response()->json([
            'success' => true,
            'ticket' => $ticket,
        ], 201);
    }

    public function show($id)
    {
        $user = Auth::user();
        $ticket = Ticket::with(['user', 'assignedTo', 'responses.user'])->findOrFail($id);

        // Check if user can view this ticket
        if (!$user->isAdmin() && $ticket->user_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized to view this ticket',
            ], 403);
        }

        return response()->json([
            'success' => true,
            'ticket' => $ticket,
        ]);
    }

    public function update(Request $request, $id)
    {
        $user = Auth::user();
        $ticket = Ticket::findOrFail($id);

        // Only admins can update ticket status and assignment
        if (!$user->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized to update this ticket',
            ], 403);
        }

        $request->validate([
            'status' => 'sometimes|in:Open,In Progress,Resolved,Closed',
            'assigned_to' => 'sometimes|nullable|exists:users,id',
            'priority' => 'sometimes|in:Low,Medium,High',
        ]);

        $ticket->update($request->only(['status', 'assigned_to', 'priority']));
        $ticket->load(['user', 'assignedTo', 'responses.user']);

        return response()->json([
            'success' => true,
            'ticket' => $ticket,
        ]);
    }

    public function addResponse(Request $request, $id)
    {
        $user = Auth::user();
        $ticket = Ticket::findOrFail($id);

        // Check if user can respond to this ticket
        if (!$user->isAdmin() && $ticket->user_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized to respond to this ticket',
            ], 403);
        }

        $request->validate([
            'message' => 'required|string',
        ]);

        $response = TicketResponse::create([
            'ticket_id' => $ticket->id,
            'user_id' => $user->id,
            'message' => $request->message,
        ]);

        // Update ticket's updated_at timestamp
        $ticket->touch();

        $response->load('user');

        return response()->json([
            'success' => true,
            'response' => $response,
        ], 201);
    }

    public function getStats()
    {
        $user = Auth::user();
        
        if ($user->isAdmin()) {
            // Admin sees all tickets stats
            $stats = [
                'total' => Ticket::count(),
                'open' => Ticket::byStatus('Open')->count(),
                'in_progress' => Ticket::byStatus('In Progress')->count(),
                'resolved' => Ticket::byStatus('Resolved')->count(),
                'closed' => Ticket::byStatus('Closed')->count(),
                'categories' => [
                    'technical' => Ticket::byCategory('Technical')->count(),
                    'billing' => Ticket::byCategory('Billing')->count(),
                    'general' => Ticket::byCategory('General')->count(),
                ],
                'priorities' => [
                    'high' => Ticket::byPriority('High')->count(),
                    'medium' => Ticket::byPriority('Medium')->count(),
                    'low' => Ticket::byPriority('Low')->count(),
                ],
            ];
        } else {
            // User sees only their tickets stats
            $stats = [
                'total' => Ticket::forUser($user->id)->count(),
                'open' => Ticket::forUser($user->id)->byStatus('Open')->count(),
                'in_progress' => Ticket::forUser($user->id)->byStatus('In Progress')->count(),
                'resolved' => Ticket::forUser($user->id)->byStatus('Resolved')->count(),
                'closed' => Ticket::forUser($user->id)->byStatus('Closed')->count(),
            ];
        }

        return response()->json([
            'success' => true,
            'stats' => $stats,
        ]);
    }
}