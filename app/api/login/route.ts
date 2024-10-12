import { NextResponse } from "next/server";
import { db } from "@/app/db/drizzle";
import { verify } from "@node-rs/argon2";
import { lucia } from "@/app/lib/auth";
import { userTable } from "@/app/db/schema";
import { eq } from "drizzle-orm";

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

  const existingUser = await db
    .select()
    .from(userTable)
    .where(eq(userTable.username, username))
    .limit(1)
    .then((users) => users[0]);

  if (!existingUser) {
    return NextResponse.json(
      { error: "Incorrect username or password" },
      { status: 400 }
    );
  }

  const validPassword = await verify(existingUser.password_hash, password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });

  if (!validPassword) {
    return NextResponse.json(
      { error: "Incorrect username or password" },
      { status: 400 }
    );
  }

  const session = await lucia.createSession(existingUser.id, {});
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
}
