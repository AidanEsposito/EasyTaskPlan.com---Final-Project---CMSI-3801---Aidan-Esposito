import "./App.css";
import React, { useState, useEffect } from "react";
import { SignIn, SignOut, useAuthentication } from "./authService";
import { AiOutlinePlus } from "react-icons/ai";
import Todo from "./Todo";
import { auth, db } from "./firebase";
import {
  query,
  collection,
  onSnapshot,
  updateDoc,
  doc,
  addDoc,
  deleteDoc,
  where,
} from "firebase/firestore";

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const user = useAuthentication();

  const createTodo = async (e) => {
    e.preventDefault(e);
    if (input === "") {
      alert("Please enter a valid Todo.");
      return;
    }

    const defaultDifficulty = "Medium";

    await addDoc(collection(db, "todos"), {
      user: user.email,
      text: input,
      completed: false,
      difficulty: defaultDifficulty,
    });
    setInput("");
  };

  useEffect(() => {
    if (!user) {
      return;
    }

    const q = query(collection(db, "todos"), where("user", "==", user.email));
    const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
      let todosArr = [];
      QuerySnapshot.forEach((doc) => {
        todosArr.push({ ...doc.data(), id: doc.id });
      });
      setTodos(todosArr);
    });

    return () => unsubscribe();
  }, [user]);
  //Read Todo
  //Update Todo

  // const updateDifficulty = async (id, difficulty) => {
  //   await updateDoc(doc(db, "todos", id), {
  //     difficulty: difficulty,
  //   });
  // };

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
        {user && <SignOut />}
        <h3 className="Header">EasyTaskPlan</h3>
        {!user && <SignIn />}
        {user && (
          <div>
            <h4>Add a task to get started!</h4>
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
                  // updateDifficulty={updateDifficulty}
                ></Todo>
              ))}
            </ul>

            {todos.length < 1 ? null : (
              <p className="Count">{`You have ${todos.length} Todos`}</p>
            )}
          </div>
        )}
      </div>
      <div className="Footer">Aidan Esposito Final Project CMSI 3801</div>
    </div>
  );
}

export default App;

//Credit to Code Commerce for a guide to start the website https://www.youtube.com/watch?v=drF8HbnW87w

//finish difficulty scaling
//finish authentification
//look into calender and other features
//add Error checking and waiting screens

//finish date goal: Wednesday 12/6/23 Supposed Presentation Date: 12/11/23

//todos.js
//authentification and filtering tutorial
//fix query so everyone has unique web page
