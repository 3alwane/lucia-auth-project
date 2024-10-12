import { NextResponse } from "next/server";
import { db } from "@/app/db/drizzle";
import { hash } from "@node-rs/argon2";
import { lucia } from "@/app/lib/auth";
import { generateId } from "lucia";
import { userTable } from "@/app/db/schema";
import { DatabaseError } from "pg";

export async function POST(request: Request) {
  const body = await request.json();
  const { username, password } = body;

  if (
    typeof username !== "string" ||
    username.length < 3 ||
    username.length > 31 ||
    !/^[a-z0-9_-]+$/.test(username)
  ) {
    return NextResponse.json({ error: "Invalid username" }, { status: 400 });
  }

  if (
    typeof password !== "string" ||
    password.length < 6 ||
    password.length > 255
  ) {
    return NextResponse.json({ error: "Invalid password" }, { status: 400 });
  }

  const passwordHash = await hash(password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });

  const userId = generateId(15);

  try {
    await db.insert(userTable).values({
      id: userId,
      username: username,
      password_hash: passwordHash,
    });

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    return NextResponse.json(
      { success: true },
      {
        status: 200,
        headers: {
          "Set-Cookie": sessionCookie.serialize(),
        },
      }
    );
  } catch (e) {
    if (e instanceof DatabaseError && e.code === "23505") {
      return NextResponse.json(
        { error: "Username already used" },
        { status: 400 }
      );
    }
    console.error("Database error:", e);
    return NextResponse.json(
      { error: "An unknown error occurred" },
      { status: 500 }
    );
  }
}
