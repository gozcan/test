import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

export function readText(filePath) {
  return fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "");
}

export function loadFunctionsFromTs(tsFilePath, functionNames) {
  const absolutePath = path.resolve(tsFilePath);
  const source = readText(absolutePath);
  const normalized = source
    .replace(/^import[^\n]*\n/gm, "")
    .replace(/export\s+function\s+/g, "function ")
    .replace(/export\s+const\s+/g, "const ")
    .concat(`\nmodule.exports = { ${functionNames.join(", ")} };`);

  const script = new vm.Script(normalized, { filename: absolutePath });
  const sandbox = { module: { exports: {} }, exports: {}, Map, Number, Object, Date, process };
  script.runInNewContext(sandbox);
  return sandbox.module.exports;
}