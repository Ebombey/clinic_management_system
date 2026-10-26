import e from "express";

const app = e();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Server is ready");
});

// Get a list of 5 jokes
app.get("/api/jokes", (req, res) => {
  const jokes = [
    {
      id: 1,
      content: "First",
    },
    {
      id: 2,
      content: "Second",
    },
    {
      id: 3,
      content: "Third",
    },
    {
      id: 4,
      content: "Forth",
    },
    {
      id: 5,
      content: "Fifth",
    },
  ];

  res.send(jokes);
});

app.listen(port, () => {
  console.log(`Server at http://localhost:${port}`);
});
