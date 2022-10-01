const jsonfile = require("jsonfile");
const date = new Date();

const file = `results/results.json`;

function Push(err, json) {
  try {
    const resultedJson = jsonfile.readFileSync(file);
    jsonfile.writeFileSync(file, [...resultedJson, json]);
  } catch (e) {
    jsonfile.writeFileSync(file, [json]);
  }
}

module.exports = Push;
