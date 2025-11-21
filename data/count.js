const fs = require("fs")
const path = require("path")

const pathC = path.join(process.cwd(), "SaveToken.json")
const json =  JSON.parse(fs.readFileSync(pathC, "utf8"))

let total = 0 

for(const item of json) {
    const r  = ((item.input + item.output) / 1_000_000) * 0.88
    total += r;
}

console.log("$ ", total)