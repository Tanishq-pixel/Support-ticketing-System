<?php

namespace Database\Seeders;

use App\Models\Ticket;
use App\Models\TicketResponse;
use App\Models\User;
use Illuminate\Database\Seeder;

class TicketSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::where('role', 'user')->get();
        $admin = User::where('role', 'admin')->first();

        // Sample tickets
        $tickets = [
            [
                'title' => 'Unable to access my account',
                'description' => 'I keep getting an error message when trying to log in. The error says "Invalid credentials" but I\'m sure my password is correct.',
                'category' => 'Technical',
                'status' => 'Open',
                'priority' => 'High',
                'user_id' => $users->first()->id,
            ],
            [
                'title' => 'Billing discrepancy in latest invoice',
                'description' => 'There seems to be an error in my latest invoice. I was charged twice for the same service.',
                'category' => 'Billing',
                'status' => 'In Progress',
                'priority' => 'Medium',
                'user_id' => $users->last()->id,
                'assigned_to' => $admin->id,
            ],
            [
                'title' => 'Feature request: Dark mode',
                'description' => 'Would it be possible to add a dark mode theme to the application? It would greatly improve the user experience during evening hours.',
                'category' => 'General',
                'status' => 'Resolved',
                'priority' => 'Low',
                'user_id' => $users->first()->id,
                'assigned_to' => $admin->id,
            ],
        ];

        foreach ($tickets as $ticketData) {
            $ticket = Ticket::create($ticketData);

            // Create initial response
            TicketResponse::create([
                'ticket_id' => $ticket->id,
                'user_id' => $ticket->user_id,
                'message' => $ticket->description,
            ]);

            // Add admin response for some tickets
            if ($ticket->status !== 'Open') {
                TicketResponse::create([
                    'ticket_id' => $ticket->id,
                    'user_id' => $admin->id,
                    'message' => $this->getAdminResponse($ticket->category),
                ]);
            }
        }
    }

    private function getAdminResponse($category)
    {
        $responses = [
            'Technical' => 'Thank you for reporting this issue. I\'m looking into your account and will have an update soon.',
            'Billing' => 'I\'ve reviewed your billing history and found the duplicate charge. A refund has been processed.',
            'General' => 'Great suggestion! This is already on our roadmap for the next quarter.',
        ];

        return $responses[$category] ?? 'Thank you for contacting support. We\'re working on your request.';
    }
}