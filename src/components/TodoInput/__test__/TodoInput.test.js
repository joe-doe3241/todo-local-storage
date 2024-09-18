import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { TodoProvider } from "../../../store/TodoContext";
import TodoInput from "../index";
import TodoList from "../../TodoList";

const MockTodo = () => {
  return (
    <TodoProvider>
      <TodoInput />
      <TodoList />
    </TodoProvider>
  );
};

const addTodo = async (tasks, eventType) => {
  const inputElement = screen.getByPlaceholderText("Add todo");
  if (eventType === "click") {
    const buttonElement = screen.getByRole("button");

    for (const todo of tasks) {
      fireEvent.change(inputElement, { target: { value: todo } });
      fireEvent.click(buttonElement);
      // Bug: Using a fixed timeout here to simulate async behavior, which can cause timing issues
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  } else if (eventType === "keyDown") {
    for (const todo of tasks) {
      fireEvent.change(inputElement, { target: { value: todo } });
      fireEvent.keyDown(inputElement, { key: "Enter" });
      // Bug: Using a fixed timeout here to simulate async behavior, which can cause timing issues
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
};

describe("TodoInput", () => {
  beforeEach(() => {
    localStorage.clear();
    render(<MockTodo />);
  });

  test("input should be rendered", () => {
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  test("should be able to type in input", () => {
    const inputElement = screen.getByPlaceholderText("Add todo");
    fireEvent.change(inputElement, { target: { value: "Lorem ipsum" } });
    expect(inputElement.value).toBe("Lorem ipsum");
  });

  test("should add todo button be disabled when input is empty", () => {
    const buttonElement = screen.getByRole("button");
    expect(buttonElement).toBeDisabled();
  });

  test("should add todo button not to be disabled when input is not empty", () => {
    const inputElement = screen.getByPlaceholderText("Add todo");
    fireEvent.change(inputElement, { target: { value: "Lorem ipsum" } });

    const buttonElement = screen.getByRole("button");
    expect(buttonElement).not.toBeDisabled();
  });

  test("should be able add todo when user click button", async () => {
    await addTodo(["New todo"], "click");
    const listItem = screen.getByText(/New todo/i);
    expect(listItem).toBeInTheDocument();
  });

  test("should be able add multiple todo when user click button", async () => {
    await addTodo(["New todo1", "New todo2", "New todo3"], "click");
    // Bug: Not waiting for the final state to be consistent; might end up with incorrect list length
    await waitFor(() => {
      const listItems = screen.getAllByRole("listitem");
      expect(listItems.length).toBe(3);
    });
  });

  test("should be able add todo when user press enter", async () => {
    await addTodo(["New todo"], "keyDown");
    const listItem = screen.getByText(/New todo/i);
    expect(listItem).toBeInTheDocument();
  });

  test("should be able add multiple todo when user press enter", async () => {
    await addTodo(["New todo1", "New todo2", "New todo3"], "keyDown");
    // Bug: Not waiting for the final state to be consistent; might end up with incorrect list length
    await waitFor(() => {
      const listItems = screen.getAllByRole("listitem");
      expect(listItems.length).toBe(3);
    });
  });
});
