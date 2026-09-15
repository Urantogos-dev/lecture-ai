"use client";

import { useEffect, useState } from "react";

type Lecture = {
  id: number;
  user_id: number;
  title: string;
  description: string | null;
  status: string;
};

export default function Home() {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const fetchLectures = async () => {
    const res = await fetch("http://localhost:3333/api/lectures");
    const data = await res.json();

    setLectures(data.data);
  };

  useEffect(() => {
    const loadLectures = async () => {
      const res = await fetch("http://localhost:3333/api/lectures");
      const data = await res.json();

      setLectures(data.data);
    };

    loadLectures();
  }, []);

  const createLecture = async () => {
    const res = await fetch("http://localhost:3333/api/lectures", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: 1,
        title,
        description,
      }),
    });

    if (res.ok) {
      setTitle("");
      setDescription("");
      fetchLectures();
    }
  };

  return (
    <main>
      <h1>Lecture AI</h1>

      <h2>Create Lecture</h2>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Lecture title"
      />

      <input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
      />

      <button onClick={createLecture}>Create</button>

      <h2>My Lectures</h2>

      {lectures.map((lecture) => (
        <div key={lecture.id}>
          <h3>{lecture.title}</h3>
          <p>{lecture.description}</p>
          <p>Status: {lecture.status}</p>
        </div>
      ))}
    </main>
  );
}
