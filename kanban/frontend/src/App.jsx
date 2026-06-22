import { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";
import "./App.css";

function App() {
  const [boards, setBoards] = useState([]);
  const [newCards, setNewCards] = useState({});

  const API =
    "https://forge2-qualifier-shreya.onrender.com/api";

  const fetchBoards = async () => {
    try {
      const res = await fetch(`${API}/boards`);
      const data = await res.json();

      setBoards(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  const addCard = async (listId) => {
    const title = newCards[listId];

    if (!title?.trim()) return;

    try {
      await fetch(`${API}/cards`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          board_list_id: listId,
          title,
          description: "New Task",
        }),
      });

      setNewCards({
        ...newCards,
        [listId]: "",
      });

      fetchBoards();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteCard = async (cardId) => {
    try {
      await fetch(`${API}/cards/${cardId}`, {
        method: "DELETE",
      });

      fetchBoards();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const destinationListId = parseInt(
      result.destination.droppableId
    );

    const cardId = parseInt(
      result.draggableId
    );

    try {
      await fetch(
        `${API}/cards/${cardId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            board_list_id:
              destinationListId,
          }),
        }
      );

      fetchBoards();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container">
      <div className="hero">
        <h1>Kanban Board</h1>
        <p>
          Manage tasks with drag & drop
        </p>
      </div>

      {boards.length === 0 ? (
        <div className="empty-state">
          <h2>No boards found</h2>

          <a
            href={`${API}/seed`}
            target="_blank"
            rel="noreferrer"
          >
            Seed Database
          </a>
        </div>
      ) : (
        boards.map((board) => (
          <DragDropContext
            key={board.id}
            onDragEnd={handleDragEnd}
          >
            <div className="board">
              {board.lists?.map((list) => (
                <Droppable
                  key={list.id}
                  droppableId={String(list.id)}
                >
                  {(provided) => (
                    <div
                      className="column"
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      <div className="column-header">
                        <span className="column-dot"></span>

                        <div className="column-title">
                          {list.name}
                        </div>

                        <span className="task-count">
                          {(list.cards || []).length}
                        </span>
                      </div>

                      {(list.cards || []).map(
                        (card, index) => (
                          <Draggable
                            key={card.id}
                            draggableId={String(
                              card.id
                            )}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                className="card"
                                ref={
                                  provided.innerRef
                                }
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <div className="card-top">
                                  <span className="card-tag">
                                    Task
                                  </span>
                                </div>

                                <h4>
                                  {card.title}
                                </h4>

                                <p>
                                  {
                                    card.description
                                  }
                                </p>

                                <button
                                  className="delete-btn"
                                  onClick={() =>
                                    deleteCard(
                                      card.id
                                    )
                                  }
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </Draggable>
                        )
                      )}

                      {provided.placeholder}

                      <div className="add-card">
                        <input
                          type="text"
                          placeholder="Add a new task..."
                          value={
                            newCards[
                              list.id
                            ] || ""
                          }
                          onChange={(e) =>
                            setNewCards({
                              ...newCards,
                              [list.id]:
                                e.target.value,
                            })
                          }
                        />

                        <button
                          onClick={() =>
                            addCard(list.id)
                          }
                        >
                          + Add Card
                        </button>
                      </div>
                    </div>
                  )}
                </Droppable>
              ))}
            </div>
          </DragDropContext>
        ))
      )}
    </div>
  );
}

export default App;