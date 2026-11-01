import { and, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { classrooms, classroomMembers, InsertClassroom, InsertClassroomMember, learningEvents, InsertUser, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    throw new Error("Database is not available");
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function createClassroom(input: Pick<InsertClassroom, "ownerId" | "name" | "inviteCode">) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const result = await db.insert(classrooms).values(input).$returningId();
  return result[0];
}

export async function listOwnedClassrooms(ownerId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  return db.select().from(classrooms).where(eq(classrooms.ownerId, ownerId));
}

export async function addClassroomMember(input: Pick<InsertClassroomMember, "classroomId" | "displayName" | "grade" | "userId">, ownerId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const owned = await db.select({ id: classrooms.id }).from(classrooms).where(and(eq(classrooms.id, input.classroomId), eq(classrooms.ownerId, ownerId))).limit(1);
  if (!owned[0]) return null;
  const result = await db.insert(classroomMembers).values(input).$returningId();
  return result[0];
}

export async function getClassroomOverview(classroomId: number, ownerId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const owned = await db.select({ id: classrooms.id, name: classrooms.name, inviteCode: classrooms.inviteCode }).from(classrooms).where(and(eq(classrooms.id, classroomId), eq(classrooms.ownerId, ownerId))).limit(1);
  if (!owned[0]) return null;
  const members = await db.select().from(classroomMembers).where(eq(classroomMembers.classroomId, classroomId));
  const events = await db.select().from(learningEvents).where(eq(learningEvents.classroomId, classroomId));
  return { classroom: owned[0], members, events };
}
