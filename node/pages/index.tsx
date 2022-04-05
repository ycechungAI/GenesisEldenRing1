import Head from "next/head";
import React, { useState, Component } from "react";
import styles from "./index.module.css";
const numRow = 3;
const numCol = 50;
export default function Home() {
  const [wordInput, setwordInput] = useState<string>("");
  const [result, setResult] = useState();

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(e.currentTarget.body.word.value);
    onSubmit(e.currentTarget.body.word.value);
  }


  async function onSubmit(event : React.FormEvent< HTMLFormElement >): Promise<void> {
    event.preventDefault();
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ word: wordInput }),
    });
    const data = await response.json();
    setResult(data.result);
    setwordInput("");
  }

  return (
    <div>
      <Head>
        <title>OpenAI Quickstart</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <img src="/dog.png" className={styles.icon} />
        <h3>Dark Souls Message</h3>
        <form onSubmit={handleFormSubmit}>
          <input
            type="text"
            className={styles.textarea}
            value={wordInput}
            name="word"
            placeholder="Enter a phrase."
          />
          <button type="submit">Generate Message</button>
        </form>
        <div className={styles.result}>{result}</div>
      </main>
    </div>
  );
}
