import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [jokes, setJokes] = useState([]);

  useEffect(() => {
    axios
      .get("/api/jokes")
      .then((response) => {
        setJokes(response.data);
      })
      .catch((error) => {
        console.log("Error fetching jokes: ", error);
      });

    console.log(jokes);
  }, []);

  return (
    <>
      <h1>Example</h1>
      <p>Jokes: {jokes.length}</p>

      {jokes.map((joke, index) => (
        <div key={joke.id}>
          <h3>Joke #{joke.id}</h3>
          <p>{joke.content}</p>
        </div>
      ))}
    </>
  );
}

export default App;
