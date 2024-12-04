import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Button, Table, Form, Modal } from "react-bootstrap";
import './App.css';

const App = () => {
  const [todos, setTodos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentTodo, setCurrentTodo] = useState(null);
  const [newTodo, setNewTodo] = useState({ description: "", status: "pending", aborted: false });

  // 状态选项
  const statusOptions = ["pending", "in-progress", "completed"];

  // 获取 Todo 列表
  useEffect(() => {
    axios.get("http://127.0.0.1:3000/api/todos")
      .then(response => setTodos(response.data))
      .catch(error => console.error("Error fetching todos", error));
  }, [todos]);

  // 新增 Todo
  const handleAddTodo = () => {
    axios.post("http://127.0.0.1:3000/api/todos", newTodo)
      .then(response => {
        setTodos([...todos, { ...newTodo, id: response.data.id }]);
        setNewTodo({ description: "", status: "pending", aborted: false });
        setShowModal(false);
      })
      .catch(error => console.error("Error adding todo", error));
  };

  // 更新 Todo
  const handleUpdateTodo = () => {
    if (currentTodo) {
      axios.put(`http://127.0.0.1:3000/api/todos/${currentTodo.id}`, currentTodo)
        .then(() => {
          setTodos(todos.map(todo => (todo.id === currentTodo.id ? currentTodo : todo)));
          setCurrentTodo(null);
        })
        .catch(error => console.error("Error updating todo", error));
    }
  };

  // 删除 Todo
  const handleDeleteTodo = (id) => {
    axios.delete(`http://127.0.0.1:3000/api/todos/${id}`)
      .then(() => setTodos(todos.filter(todo => todo.id !== id)))
      .catch(error => console.error("Error deleting todo", error));
  };

  // 选择 Todo 进行编辑
  const handleSelectTodo = (todo) => {
    setCurrentTodo(todo);
    setShowModal(true);
  };

  return (
    <Container>
      <Row className="mt-4">
        <Col>
          <h2>Todo List</h2>
          <Button onClick={() => setShowModal(true)} variant="primary" className="mb-3">
            Add New Todo
          </Button>

          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Description</th>
                <th>Status</th>
                <th>Aborted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {todos.map(todo => (
                <tr key={todo.id}>
                  <td>{todo.description}</td>
                  <td>{todo.status}</td>
                  <td>{todo.aborted ? "Yes" : "No"}</td>
                  <td>
                    <Button onClick={() => handleSelectTodo(todo)} variant="warning" size="sm" className="mr-2">Edit</Button>
                    <Button onClick={() => handleDeleteTodo(todo.id)} variant="danger" size="sm">Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>

      {/* Modal for Add/Edit Todo */}
      <Modal show={showModal} onHide={() => setShowModal(false)} className="modal-bottom">
        <Modal.Header>
          <Modal.Title>{currentTodo ? "Edit Todo" : "Add New Todo"}</Modal.Title>
              <Button
              variant="link"
              onClick={() => setShowModal(false)}
              className="btn-close"
            >
              X
            </Button>
          
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter description"
                value={currentTodo ? currentTodo.description : newTodo.description}
                onChange={(e) => currentTodo ? setCurrentTodo({ ...currentTodo, description: e.target.value }) : setNewTodo({ ...newTodo, description: e.target.value })}
              />
            </Form.Group>

            <Form.Group controlId="formStatus">
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                value={currentTodo ? currentTodo.status : newTodo.status}
                onChange={(e) => currentTodo ? setCurrentTodo({ ...currentTodo, status: e.target.value }) : setNewTodo({ ...newTodo, status: e.target.value })}
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="formAborted">
              <Form.Check
                type="checkbox"
                label="Aborted"
                checked={currentTodo ? currentTodo.aborted : newTodo.aborted}
                onChange={(e) => currentTodo ? setCurrentTodo({ ...currentTodo, aborted: e.target.checked }) : setNewTodo({ ...newTodo, aborted: e.target.checked })}
              />
            </Form.Group>

            <div className="button-container">
              <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button variant="primary" onClick={currentTodo ? handleUpdateTodo : handleAddTodo}>
                {currentTodo ? "Update Todo" : "Add Todo"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default App;
