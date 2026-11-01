import { useEffect, useState } from "react";

const STORAGE_KEY = "hackduo.classroom.v1";

export type ClassroomStudent = {
  id: string;
  name: string;
  grade: string;
  joinedAt: string;
};

export type Classroom = {
  id: string;
  name: string;
  inviteCode: string;
  students: ClassroomStudent[];
};

type ClassroomState = { classrooms: Classroom[]; activeClassroomId: string | null };

const EMPTY_STATE: ClassroomState = { classrooms: [], activeClassroomId: null };

function readState(): ClassroomState {
  if (typeof window === "undefined") return EMPTY_STATE;
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null") as Partial<ClassroomState> | null;
    if (!parsed || !Array.isArray(parsed.classrooms)) return EMPTY_STATE;
    const classrooms = parsed.classrooms.filter((classroom): classroom is Classroom => Boolean(classroom && typeof classroom.id === "string" && typeof classroom.name === "string" && typeof classroom.inviteCode === "string" && Array.isArray(classroom.students)));
    return { classrooms, activeClassroomId: typeof parsed.activeClassroomId === "string" ? parsed.activeClassroomId : classrooms[0]?.id ?? null };
  } catch {
    return EMPTY_STATE;
  }
}

function code() {
  return `TEUM-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

export function useClassroom() {
  const [state, setState] = useState<ClassroomState>(readState);
  useEffect(() => { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }, [state]);
  const activeClassroom = state.classrooms.find((classroom) => classroom.id === state.activeClassroomId) ?? state.classrooms[0];

  function createClassroom(name: string) {
    const normalized = name.trim().slice(0, 32);
    if (!normalized) return;
    const classroom: Classroom = { id: `class-${Date.now()}`, name: normalized, inviteCode: code(), students: [] };
    setState((current) => ({ classrooms: [...current.classrooms, classroom], activeClassroomId: classroom.id }));
  }

  function addStudent(name: string, grade: string) {
    const normalized = name.trim().slice(0, 24);
    if (!activeClassroom || !normalized) return false;
    const student: ClassroomStudent = { id: `student-${Date.now()}`, name: normalized, grade: grade.trim().slice(0, 16) || "미입력", joinedAt: new Date().toISOString() };
    setState((current) => ({ ...current, classrooms: current.classrooms.map((classroom) => classroom.id === activeClassroom.id ? { ...classroom, students: [...classroom.students, student] } : classroom) }));
    return true;
  }

  function removeStudent(studentId: string) {
    if (!activeClassroom) return;
    setState((current) => ({ ...current, classrooms: current.classrooms.map((classroom) => classroom.id === activeClassroom.id ? { ...classroom, students: classroom.students.filter((student) => student.id !== studentId) } : classroom) }));
  }

  return { classrooms: state.classrooms, activeClassroom, createClassroom, addStudent, removeStudent };
}
