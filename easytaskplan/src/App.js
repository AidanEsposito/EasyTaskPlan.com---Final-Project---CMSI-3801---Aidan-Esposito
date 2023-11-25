import "./App.css";
import React, { useState, useEffect } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import Todo from "./Todo";
import { db } from "./firebase";
import {
  query,
  collection,
  onSnapshot,
  updateDoc,
  doc,
  addDoc,
  deleteDoc,
} from "firebase/firestore";

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");

  //Create ToDO
  const createTodo = async (e) => {
    e.preventDefault(e);
    if (input === "") {
      alert("Please enter a valid Todo.");
      return;
    }
    await addDoc(collection(db, "todos"), {
      text: input,
      completed: false,
    });
    setInput("");
  };

  useEffect(() => {
    const q = query(collection(db, "todos"));
    const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
      let todosArr = [];
      QuerySnapshot.forEach((doc) => {
        todosArr.push({ ...doc.data(), id: doc.id });
      });
      setTodos(todosArr);
    });
    return () => unsubscribe();
  }, []);
  //Read Todo
  //Update Todo

  const toggleComplete = async (todo) => {
    await updateDoc(doc(db, "todos", todo.id), {
      completed: !todo.completed,
    });
  };

  //Delete Todo
  const deleteTodo = async (id) => {
    await deleteDoc(doc(db, "todos", id));
  };

  return (
    <div className="App">
      <div className="Container">
        <h3 className="Header">EasyTaskPlan</h3>
        <form onSubmit={createTodo} className="Form">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="Input"
            type="text"
            placeholder="Add TODO"
          ></input>
          <button className="Button">
            <AiOutlinePlus size={30}></AiOutlinePlus>
          </button>
        </form>
        <ul>
          {todos.map((todo, index) => (
            <Todo
              key={index}
              todo={todo}
              toggleComplete={toggleComplete}
              deleteTodo={deleteTodo}
            ></Todo>
          ))}
        </ul>

        {todos.length < 1 ? null : (
          <p className="Count">{`You have ${todos.length} Todos`}</p>
        )}
      </div>
      <div className="Footer">
        {/* Content for the bottom of the website */}© 2023 EasyTaskPlan. All
        rights reserved.
      </div>
    </div>
  );
}

export default App;

//react icons
