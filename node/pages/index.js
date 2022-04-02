import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [wordInput, setwordInput] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
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
            type="text"
            name="word"
            placeholder="Enter a phrase"
            value={wordInput} onChange={(e) => setwordInput(e.target.value)} 
            rows="3"
            cols="50"
          />
          <input type="submit" value="Generate message" />
        </form>
        <div className={styles.result}>{result}</div>
      </main>
    </div>
  );
}
