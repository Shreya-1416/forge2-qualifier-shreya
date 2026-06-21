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

      console.log("API DATA:", data);

      setBoards(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch Error:", err);
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
      <h1>Forge 2 Kanban Board</h1>

      {boards.length === 0 ? (
        <div>
          <p>No boards found.</p>

          <a
            href="https://forge2-qualifier-shreya.onrender.com/api/seed"
            target="_blank"
            rel="noreferrer"
          >
            Seed Database
          </a>
        </div>
      ) : (
        boards.map((board) => (
          <div key={board.id}>
            <h2>{board.name}</h2>

            <DragDropContext
              onDragEnd={handleDragEnd}
            >
              <div className="board">
                {board.lists?.map((list) => (
                  <Droppable
                    key={list.id}
                    droppableId={String(
                      list.id
                    )}
                  >
                    {(provided) => (
                      <div
                        className="column"
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                      >
                        <h3>{list.name}</h3>

                        {(list.cards || []).map(
                          (
                            card,
                            index
                          ) => (
                            <Draggable
                              key={card.id}
                              draggableId={String(
                                card.id
                              )}
                              index={index}
                            >
                              {(
                                provided
                              ) => (
                                <div
                                  className="card"
                                  ref={
                                    provided.innerRef
                                  }
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <h4>
                                    {
                                      card.title
                                    }
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

                        {
                          provided.placeholder
                        }

                        <div className="add-card">
                          <input
                            type="text"
                            placeholder="New Task"
                            value={
                              newCards[
                                list.id
                              ] || ""
                            }
                            onChange={(
                              e
                            ) =>
                              setNewCards({
                                ...newCards,
                                [list.id]:
                                  e
                                    .target
                                    .value,
                              })
                            }
                          />

                          <button
                            onClick={() =>
                              addCard(
                                list.id
                              )
                            }
                          >
                            Add Card
                          </button>
                        </div>
                      </div>
                    )}
                  </Droppable>
                ))}
              </div>
            </DragDropContext>
          </div>
        ))
      )}
    </div>
  );
}

export default App;