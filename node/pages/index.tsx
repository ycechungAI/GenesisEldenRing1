import Head from "next/head";
import React, { useState, Component } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [wordInput, setwordInput] = useState<string>("");
  const [result, setResult] = useState();
  const numRows = 3;
  const numCols = 50;


  async function onSubmit(event: { preventDefault: () => void; }): Promise<void> {
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
        <form onSubmit={onSubmit}>
          <textarea
            name="word"
            placeholder="Enter a phrase"
            value={wordInput} onChange={(e) => setwordInput(e.target.value)} 
            rows={numRows}
            cols={numCols}
          />
          <input type="submit" value="Generate message" />
        </form>
        <div className={styles.result}>{result}</div>
      </main>
    </div>
  );
}
