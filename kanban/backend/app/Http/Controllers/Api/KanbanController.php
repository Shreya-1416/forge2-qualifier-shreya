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
        $validated = $request->validate([
            'board_list_id' => 'required|exists:board_lists,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'label' => 'nullable|string|max:255',
            'assignee' => 'nullable|string|max:255',
            'due_date' => 'nullable|date',
        ]);

        $card = Card::create($validated);

        return response()->json($card, 201);
    }

    public function update(Request $request, $id)
    {
        $card = Card::findOrFail($id);

        $validated = $request->validate([
            'board_list_id' => 'sometimes|exists:board_lists,id',
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'label' => 'nullable|string|max:255',
            'assignee' => 'nullable|string|max:255',
            'due_date' => 'nullable|date',
        ]);

        $card->update($validated);

        return response()->json($card);
    }

    public function destroy($id)
    {
        Card::findOrFail($id)->delete();

        return response()->json(null, 204);
    }

    public function move(Request $request, $id)
    {
        $card = Card::findOrFail($id);

        $validated = $request->validate([
            'board_list_id' => 'required|exists:board_lists,id',
        ]);

        $card->update($validated);

        return response()->json($card);
    }

    public function storeBoard(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $board = Board::create($validated);

        // Create default lists for new board
        BoardList::create(['board_id' => $board->id, 'name' => 'To Do', 'position' => 1]);
        BoardList::create(['board_id' => $board->id, 'name' => 'Doing', 'position' => 2]);
        BoardList::create(['board_id' => $board->id, 'name' => 'Done', 'position' => 3]);

        // Reload with lists for response
        $board->load('lists');

        return response()->json($board, 201);
    }

    public function updateBoard(Request $request, $id)
    {
        $board = Board::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
        ]);

        $board->update($validated);

        return response()->json($board);
    }

    public function destroyBoard($id)
    {
        $board = Board::findOrFail($id);
        $board->delete();

        return response()->json(null, 204);
    }
}