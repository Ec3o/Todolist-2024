import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({ description: '', status: '', aborted: false });
  const [editTodo, setEditTodo] = useState(null);
  const [loading, setLoading] = useState(false);

  // 获取 Todo 列表
  const fetchTodos = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:3000/api/todos');
      setTodos(res.data);
      setLoading(false);
    } catch (error) {
      console.error("There was an error fetching the todos!", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // 新增 Todo
  const handleAddTodo = async () => {
    try {
      await axios.post('http://localhost:3000/api/todos', newTodo);
      setNewTodo({ description: '', status: '', aborted: false });
      fetchTodos();
    } catch (error) {
      console.error("There was an error adding the todo!", error);
    }
  };

  // 删除 Todo
  const handleDeleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/todos/${id}`);
      fetchTodos();
    } catch (error) {
      console.error("There was an error deleting the todo!", error);
    }
  };

  // 更新 Todo
  const handleUpdateTodo = async () => {
    try {
      await axios.put(`http://localhost:3000/api/todos/${editTodo.id}`, editTodo);
      setEditTodo(null);
      fetchTodos();
    } catch (error) {
      console.error("There was an error updating the todo!", error);
    }
  };

  return (
    <div className="App">
      <h1>Todo List</h1>
      
      {/* 显示 todo 列表 */}
      {loading ? <p>Loading...</p> : (
        <ul>
          {todos.map(todo => (
            <li key={todo.id}>
              <span>{todo.description} - {todo.status}</span>
              <button onClick={() => setEditTodo(todo)}>Edit</button>
              <button onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
      
      {/* 新增 Todo */}
      <div>
        <h2>Add New Todo</h2>
        <input 
          type="text" 
          placeholder="Description" 
          value={newTodo.description}
          onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
        />
        <input 
          type="text" 
          placeholder="Status" 
          value={newTodo.status}
          onChange={(e) => setNewTodo({ ...newTodo, status: e.target.value })}
        />
        <label>
          Aborted:
          <input 
            type="checkbox" 
            checked={newTodo.aborted}
            onChange={(e) => setNewTodo({ ...newTodo, aborted: e.target.checked })}
          />
        </label>
        <button onClick={handleAddTodo}>Add Todo</button>
      </div>

      {/* 编辑 Todo */}
      {editTodo && (
        <div>
          <h2>Edit Todo</h2>
          <input 
            type="text" 
            value={editTodo.description}
            onChange={(e) => setEditTodo({ ...editTodo, description: e.target.value })}
          />
          <input 
            type="text" 
            value={editTodo.status}
            onChange={(e) => setEditTodo({ ...editTodo, status: e.target.value })}
          />
          <label>
            Aborted:
            <input 
              type="checkbox" 
              checked={editTodo.aborted}
              onChange={(e) => setEditTodo({ ...editTodo, aborted: e.target.checked })}
            />
          </label>
          <button onClick={handleUpdateTodo}>Update Todo</button>
          <button onClick={() => setEditTodo(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
}

export default App;
