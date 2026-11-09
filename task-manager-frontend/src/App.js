
import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const API = "http://localhost:5000/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  const fetchTasks = async () => {
    try {
      const res = await axios.get(API);
      setTasks(res.data);
    } catch (error) {
      console.log("Unable to fetch tasks");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async () => {
    if (!title.trim()) {
      alert("Please enter task title");
      return;
    }

    try {
      await axios.post(API, { title });
      setTitle("");
      fetchTasks();
    } catch (error) {
      alert("Unable to add task");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(`${API}/${id}`, { status });
      fetchTasks();
    } catch (error) {
      alert("Unable to update task");
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      fetchTasks();
    } catch (error) {
      alert("Unable to delete task");
    }
  };

  const columns = [
    { name: "Pending", color: "pending" },
    { name: "Ongoing", color: "ongoing" },
    { name: "Completed", color: "completed" }
  ];

  return (
    <div className="dashboard">

      <h1 className="text-center dashboard-title">
        Task Manager
      </h1>

      <div className="input-group task-input">
        <input
          type="text"
          className="form-control"
          placeholder="Enter task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") addTask();
          }}
        />

        <button
          className="btn btn-primary add-button"
          onClick={addTask}
        >
          Add Task
        </button>
      </div>

      <div className="row task-board">

        {columns.map((column) => (
          <div className="col-md-4 mb-4" key={column.name}>

            <div className="task-column">

              <div className={`column-header ${column.color}`}>
                {column.name} Tasks
              </div>

              <div className="column-body">

                {tasks.filter(
                  (task) => task.status === column.name
                ).length === 0 && (
                  <p className="empty-message">
                    No tasks in this category.
                  </p>
                )}

                {tasks
                  .filter(
                    (task) => task.status === column.name
                  )
                  .map((task) => (

                    <div className="task-card" key={task._id}>

                      <h6>{task.title}</h6>

                      <p>
                        Status: {task.status}
                      </p>

                      <div className="task-actions">

                        {column.name === "Pending" && (
                          <>
                            <button
                              className="btn btn-info"
                              onClick={() =>
                                updateStatus(task._id, "Ongoing")
                              }
                            >
                              Mark as Ongoing
                            </button>

                            <button
                              className="btn btn-success"
                              onClick={() =>
                                updateStatus(task._id, "Completed")
                              }
                            >
                              Mark as Completed
                            </button>
                          </>
                        )}

                        {column.name === "Ongoing" && (
                          <>
                            <button
                              className="btn btn-info"
                              onClick={() =>
                                updateStatus(task._id, "Pending")
                              }
                            >
                              Mark as Pending
                            </button>

                            <button
                              className="btn btn-success"
                              onClick={() =>
                                updateStatus(task._id, "Completed")
                              }
                            >
                              Mark as Completed
                            </button>
                          </>
                        )}

                        {column.name === "Completed" && (
                          <button
                            className="btn btn-info"
                            onClick={() =>
                              updateStatus(task._id, "Ongoing")
                            }
                          >
                            Mark as Ongoing
                          </button>
                        )}

                        <button
                          className="btn btn-danger"
                          onClick={() => deleteTask(task._id)}
                        >
                          Delete Task
                        </button>

                      </div>
                    </div>
                  ))}

              </div>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}

export default App;
