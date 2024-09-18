import { createContext, useState, useEffect, useRef } from "react";

export const TodoContext = createContext({
  todoItems: [],
  addTodoItem: () => {},
  removeTodoItem: () => {},
});

export const TodoProvider = (props) => {
  const [todoItems, setTodoItems] = useState(() => {
    const storedItems = JSON.parse(localStorage.getItem("todoItems"));
    return storedItems || [];
  });

  useEffect(() => {
    const handle = setTimeout(() => {
      localStorage.setItem("todoItems", JSON.stringify(todoItems));
    }, 300);

    return () => clearTimeout(handle);
  }, [todoItems]);

  const addTodoItem = (item) => {
    setTodoItems((prevItems) => {
      const updatedItems = [...prevItems, item];
      return updatedItems; // updatedItems is already being stored in localStorage by useEffect
    });
  };

  const removeTodoItem = (id) => {
    setTodoItems((prevItems) => {
      const updatedItems = prevItems.filter((item) => item.id !== id);
      return updatedItems; // updatedItems is already being stored in localStorage by useEffect
    });
  };

  return (
    <TodoContext.Provider value={{ todoItems, addTodoItem, removeTodoItem }}>
      {props.children}
    </TodoContext.Provider>
  );
};
