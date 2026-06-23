<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Board;
use App\Models\BoardList;
use App\Models\Card;
use Illuminate\Http\Request;

class KanbanController extends Controller
{
    public function index()
    {
        return Board::with('lists.cards')->get();
    }

    public function seed()
    {
        Card::truncate();
        BoardList::truncate();
        Board::truncate();

        $board = Board::create([
            'name' => 'Forge 2 Board'
        ]);

        $todo = BoardList::create([
            'board_id' => $board->id,
            'name' => 'To Do',
            'position' => 1
        ]);

        $doing = BoardList::create([
            'board_id' => $board->id,
            'name' => 'Doing',
            'position' => 2
        ]);

        $done = BoardList::create([
            'board_id' => $board->id,
            'name' => 'Done',
            'position' => 3
        ]);

        Card::create([
    'board_list_id' => $todo->id,
    'title' => 'Setup Laravel Backend',
    'description' => 'Complete backend setup',
    'label' => 'Backend',
    'assignee' => 'Shreya',
    'due_date' => now()->addDays(2)
]);

Card::create([
    'board_list_id' => $doing->id,
    'title' => 'Build React Frontend',
    'description' => 'Create Kanban UI',
    'label' => 'Frontend',
    'assignee' => 'Shreya',
    'due_date' => now()->addDays(4)
]);

Card::create([
    'board_list_id' => $done->id,
    'title' => 'Configure Hermes',
    'description' => 'Memory + cron working',
    'label' => 'AI',
    'assignee' => 'Shreya',
    'due_date' => now()->subDay()
]);

        return response()->json([
            'message' => 'Seed data created'
        ]);
    }

   public function store(Request $request)
{
    $card = Card::create([
        'board_list_id' => $request->board_list_id,
        'title' => $request->title,
        'description' => $request->description,
        'label' => $request->label,
        'assignee' => $request->assignee,
        'due_date' => $request->due_date
    ]);

    return response()->json($card);
}

public function update(Request $request, $id)
{
    $card = Card::findOrFail($id);

    $card->update([
        'board_list_id' => $request->board_list_id ?? $card->board_list_id,
        'title' => $request->title ?? $card->title,
        'description' => $request->description ?? $card->description,
        'label' => $request->label ?? $card->label,
        'assignee' => $request->assignee ?? $card->assignee,
        'due_date' => $request->due_date ?? $card->due_date,
    ]);

    return response()->json($card);
}

    public function destroy($id)
    {
        Card::findOrFail($id)->delete();

        return response()->json([
            'message' => 'Card deleted'
        ]);
    }

    public function move(Request $request, $id)
    {
        $card = Card::findOrFail($id);

        $card->update([
            'board_list_id' => $request->board_list_id
        ]);

        return response()->json([
            'message' => 'Card moved'
        ]);
    }
}