"use client";

import { nanoid } from "nanoid";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Task } from "../db/schema";

import { LogoutButton } from "../logoutBtn";
import { useAppContext } from "../ContextApp";

export default function DashClientWrapper() {
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [taskInput, setTaskInput] = useState("");
  const { user } = useAppContext();

  useEffect(() => {
    async function fetchData() {
      try {
        if (user !== null) {
          const tasks = await fetchTasks(user.id);
          setAllTasks(tasks);
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchData();
  }, [user]);

  return (
    <div>
      <p>{user?.username}</p>
      <p>{user?.id}</p>

      <LogoutButton />

      {/* Add new task */}
      <div>
        <input
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          className="border p-2"
          placeholder="add new task"
        />
        <button
          onClick={() => {
            const newTask: Task = {
              id: nanoid(),
              name: taskInput,
              is_completed: false,
              status: "pending",
              userId: user.id || "",
            };

            addNewTask(newTask, setAllTasks);
          }}
          className="bg-red-500 p-3 text-white"
        >
          Add
        </button>
      </div>

      {/* Show all the tasks */}
      <div className="flex flex-col w-1/2 gap-2 mt-3">
        {allTasks.map((task) => (
          <SingleTask key={task.id} task={task} setAllTasks={setAllTasks} />
        ))}
      </div>
    </div>
  );
}

function SingleTask({
  task,
  setAllTasks,
}: {
  task: Task;
  setAllTasks: Dispatch<SetStateAction<Task[]>>;
}) {
  return (
    <div key={task.id} className="border p-3 flex justify-between">
      <input
        type="checkbox"
        checked={task.is_completed}
        onClick={() => {
          const updatedTask: Task = {
            ...task,
            is_completed: !task.is_completed,
          };

          updateTask(updatedTask, setAllTasks);
        }}
      />
      <span>{task.name}</span>
      <span className="text-gray-500">{task.status}</span>
      <button
        onClick={() => deleteTask(task, setAllTasks)}
        className="bg-red-500 p-3"
      >
        Delete
      </button>
    </div>
  );
}

async function updateTask(
  updatedTask: Task,
  setAllTasks: Dispatch<SetStateAction<Task[]>>
) {
  const response = await fetch("/api/tasks", {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(updatedTask),
  });

  if (!response.ok) {
    throw new Error("failed to update the task");
  }

  setAllTasks((prevTasks) => {
    return prevTasks.map((t) => {
      if (t.id === updatedTask.id) {
        return { ...t, is_completed: !t.is_completed };
      }

      return t;
    });
  });

  console.log("success");
}
async function addNewTask(
  task: Task,
  setAllTasks: Dispatch<SetStateAction<Task[]>>
) {
  const response = await fetch("/api/tasks", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(task),
  });

  if (!response.ok) {
    throw new Error("unable to create a new task");
  }

  const data = await response.json();
  setAllTasks((prevTasks) => {
    return [...prevTasks, task];
  });
  console.log("task created", data);
}

async function fetchTasks(userId: string | undefined) {
  const response = await fetch(`/api/tasks?userId=${userId}`, {
    method: "GET",
    headers: { "content-type": "application/json" },
  });

  if (!response.ok) {
    throw new Error("unable to fetch the data");
  }

  return response.json();
}

async function deleteTask(
  task: Task,
  setAllTasks: Dispatch<SetStateAction<Task[]>>
) {
  try {
    const response = await fetch("/api/tasks", {
      headers: { "content-type": "application/json" },
      method: "DELETE",
      body: JSON.stringify({ taskId: task.id }),
    });

    if (!response.ok) {
      throw new Error("failed to delete the task");
    }

    const data = await response.json();
    setAllTasks((prevTasks) => {
      return prevTasks.filter((t) => t.id !== task.id);
    });
    console.log("task delete successfully", data);
  } catch (error) {
    console.log(error);
  }
}
