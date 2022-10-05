const Routine = require("@juniordev/routinejs");
const app = new Routine();


app.get(`/`, (req,res) => res.json("hello"))

app.listen(3000);
