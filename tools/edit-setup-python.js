const fs = require("fs");

const filePath = "./node_modules/setup-python/src/setup-python.ts"
const source = fs.readFileSync(filePath, "utf-8")

const sourceChanged = source
  .replace("run();", "")
  .replace("\nasync function run()", "\nexport async function run()")
fs.writeFileSync(filePath, sourceChanged)
