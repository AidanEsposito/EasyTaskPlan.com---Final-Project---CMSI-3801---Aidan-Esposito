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
  const [isLoading, setIsLoading] = useState(false);
  const user = useAuthentication();

  //Add TODO
  async function createTodo(e) {
    e.preventDefault();

    try {
      setIsLoading(true);
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
    } catch (error) {
      console.error("Error creating todo:", error);
    } finally {
      setIsLoading(false);
    }
  }

  //Update TODO
  useEffect(() => {
    if (!user) {
      return;
    }

    const q = query(collection(db, "todos"), where("user", "==", user.email));
    setIsLoading(true);
    const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
      try {
        let todosArr = [];
        QuerySnapshot.forEach((doc) => {
          todosArr.push({ ...doc.data(), id: doc.id });
        });
        setTodos(todosArr);
      } catch (error) {
        console.error("Error fetching todos:", error);
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, [user]);

  // const updateDifficulty = async (id, difficulty) => {
  //   await updateDoc(doc(db, "todos", id), {
  //     difficulty: difficulty,
  //   });
  // };

  //Complete TODO
  async function toggleComplete(todo) {
    try {
      setIsLoading(true);
      await updateDoc(doc(db, "todos", todo.id), {
        completed: !todo.completed,
      });
    } catch (error) {
      console.error("Error updating todo:", error);
    } finally {
      setIsLoading(false);
    }
  }

  //Delete TODO
  async function deleteTodo(id) {
    try {
      setIsLoading(true);
      await deleteDoc(doc(db, "todos", id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    } finally {
      setIsLoading(false);
    }
  }

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
                id="todoInput"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="Input"
                type="text"
                placeholder="Add TODO"
              ></input>
              <button className="Button" disabled={isLoading}>
                <AiOutlinePlus size={30}></AiOutlinePlus>
              </button>
            </form>
            {isLoading && <p className="WaitingText">Please Wait...</p>}
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
//look into calender and other features
//add Error checking and waiting screens

//finish date goal: Wednesday 12/6/23 Supposed Presentation Date: 12/11/23

//todos.js

//add online/offline control
