
import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

// Render Backend URL
const API = "https://project-management-z5wv.onrender.com/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch all tasks
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API);
      setTasks(res.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      alert("Unable to connect to backend");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Create task
  const createTask = async () => {
    if (!title.trim()) {
      alert("Please enter task name");
      return;
    }

    try {
      await axios.post(API, { title: title.trim() });
      setTitle("");
      fetchTasks();
    } catch (error) {
      console.error(error);
      alert("Unable to add task");
    }
  };

  // Update task status
  const updateStatus = async (id, status) => {
    try {
      await axios.patch(`${API}/${id}`, { status });
      fetchTasks();
    } catch (error) {
      console.error(error);
      alert("Unable to update task");
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      await axios.delete(`${API}/${id}`);
      fetchTasks();
    } catch (error) {
      console.error(error);
      alert("Unable to delete task");
    }
  };

  const statuses = ["Pending", "InProgress", "Completed"];

  return (
    <div className="container mt-5 mb-5">

      <h1 className="text-center mb-4">
        Project Management Dashboard
      </h1>

      <div className="input-group mb-4">

        <input
          type="text"
          className="form-control"
          placeholder="Enter task name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") createTask();
          }}
        />

        <button
          className="btn btn-primary"
          onClick={createTask}
        >
          Add Task
        </button>

      </div>

      {loading && (
        <p className="text-center">Loading tasks...</p>
      )}

      <div className="row">

        {statuses.map((status) => (

          <div className="col-md-4 mb-3" key={status}>

            <div className="card h-100">

              <div className="card-header">
                <h5 className="mb-0">
                  {status === "InProgress"
                    ? "In Progress"
                    : status} Tasks
                </h5>
              </div>

              <div className="card-body">

                {tasks
                  .filter((task) => task.status === status)
                  .map((task) => (

                    <div
                      className="card p-3 mb-3"
                      key={task._id}
                    >

                      <h6>{task.title}</h6>

                      {status === "Pending" && (
                        <button
                          className="btn btn-info mb-2"
                          onClick={() =>
                            updateStatus(task._id, "InProgress")
                          }
                        >
                          Start Task
                        </button>
                      )}

                      {status !== "Completed" && (
                        <button
                          className="btn btn-success mb-2"
                          onClick={() =>
                            updateStatus(task._id, "Completed")
                          }
                        >
                          Complete Task
                        </button>
                      )}

                      <button
                        className="btn btn-danger"
                        onClick={() => deleteTask(task._id)}
                      >
                        Delete
                      </button>

                    </div>

                  ))}

                {tasks.filter(
                  (task) => task.status === status
                ).length === 0 && (
                  <p className="text-muted text-center">
                    No tasks available
                  </p>
                )}

              </div>
            </div>
          </div>

        ))}

      </div>

    </div>
  );
}

export default App;
