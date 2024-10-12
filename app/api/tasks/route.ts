import { db } from "@/app/db/drizzle";
import { tasks } from "@/app/db/schema";

import { NextResponse } from "next/server";
import { Task } from "@/app/db/schema";
import { eq } from "drizzle-orm";
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ message: "id undefined" });
    }

    console.log(userId);

    // Fetch tasks only for the given userId
    const allTasks = await db
      .select()
      .from(tasks)
      .where(eq(tasks.userId, userId));

    return NextResponse.json(allTasks);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}

export async function POST(request: Request) {
  try {
    const body: Task = await request.json();
    const newToDo = await db.insert(tasks).values(body);

    console.log(body);

    return NextResponse.json(newToDo, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}

export async function PUT(request: Request) {
  try {
    const body: Task = await request.json();

    console.log(body);

    //update the task in the db
    await db
      .update(tasks)
      .set({
        name: body.name,
        is_completed: body.is_completed,
        status: body.status,
      })
      .where(eq(tasks.id, body.id));

    return NextResponse.json({ message: "Task has been updated succesfully" });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message });
    }
  }
}

export async function DELETE(request: Request) {
  try {
    const { taskId } = await request.json();
    await db.delete(tasks).where(eq(tasks.id, taskId));
    return NextResponse.json(
      { message: "Task has been delete successfully" },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}
