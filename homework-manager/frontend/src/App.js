import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

function App() {
  const [homework, setHomework] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form state
  const [newHwTitle, setNewHwTitle] = useState('');
  const [newHwSubject, setNewHwSubject] = useState('');
  const [newHwDueDate, setNewHwDueDate] = useState('');

  const fetchHomework = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/homework');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setHomework(data);
      setError(null);
    } catch (e) {
      console.error("Error fetching homework:", e);
      setError(e.message);
      setHomework([]); // Clear homework on error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHomework();
  }, [fetchHomework]);

  const handleAddHomework = async (e) => {
    e.preventDefault();
    if (!newHwTitle || !newHwSubject || !newHwDueDate) {
      alert("Please fill in all fields for the new homework.");
      return;
    }
    try {
      const response = await fetch('/api/homework', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newHwTitle,
          subject: newHwSubject,
          dueDate: newHwDueDate,
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // const addedHw = await response.json();
      // setHomework([...homework, addedHw]); // Optimistic update or refetch
      fetchHomework(); // Refetch to get the latest list including the new one
      setNewHwTitle('');
      setNewHwSubject('');
      setNewHwDueDate('');
    } catch (error) {
      console.error("Error adding homework:", error);
      setError(error.message);
    }
  };

  const toggleComplete = async (hwId, currentStatus) => {
    try {
      const response = await fetch(`/api/homework/${hwId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: !currentStatus }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // const updatedHw = await response.json();
      // setHomework(homework.map(hw => hw.id === hwId ? updatedHw : hw)); // Optimistic update
      fetchHomework(); // Refetch for simplicity
    } catch (error) {
      console.error("Error updating homework:", error);
      setError(error.message);
    }
  };

  const handleDelete = async (hwId) => {
    if (!window.confirm("Are you sure you want to delete this assignment?")) {
        return;
    }
    try {
      const response = await fetch(`/api/homework/${hwId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({ message: "Unknown error" }));
        throw new Error(`HTTP error! status: ${response.status} - ${errData.message || errData.error}`);
      }
      // setHomework(homework.filter(hw => hw.id !== hwId)); // Optimistic update
      fetchHomework(); // Refetch for simplicity
    } catch (error) {
      console.error("Error deleting homework:", error);
      setError(error.message);
    }
  };

  if (loading && !homework.length) { // Show loading only on initial load
    return <div className="App">Loading homework...</div>;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Homework Manager</h1>
      </header>

      {error && <p className="error-message">Error: {error}. Please try refreshing.</p>}

      <form onSubmit={handleAddHomework}>
        <h2>Add New Homework</h2>
        <div>
          <input
            type="text"
            placeholder="Title"
            value={newHwTitle}
            onChange={(e) => setNewHwTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Subject"
            value={newHwSubject}
            onChange={(e) => setNewHwSubject(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="date"
            placeholder="Due Date"
            value={newHwDueDate}
            onChange={(e) => setNewHwDueDate(e.target.value)}
            required
          />
        </div>
        <button type="submit">Add Homework</button>
      </form>

      <h2>Current Assignments</h2>
      {homework.length === 0 && !loading ? (
        <p>No homework assignments yet! Add one above.</p>
      ) : (
        <ul>
          {homework.map(hw => (
            <li key={hw.id} className={hw.completed ? 'completed' : ''}>
              <div>
                <strong>{hw.title}</strong> ({hw.subject})
              </div>
              <div>Due: {hw.dueDate}</div>
              <div>Status: {hw.completed ? 'Completed' : 'Pending'}</div>
              <div>
                <button
                  onClick={() => toggleComplete(hw.id, hw.completed)}
                  className="action-button complete-button"
                >
                  {hw.completed ? 'Mark as Incomplete' : 'Mark as Complete'}
                </button>
                <button
                  onClick={() => handleDelete(hw.id)}
                  className="action-button delete-button"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
