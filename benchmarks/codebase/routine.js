const Routine = require("routinejs");
const app = new Routine();

app.get(`/`, (req, res) => {
  res.json("hello routine");
});

app.listen(3000);
