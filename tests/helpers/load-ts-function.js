import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

export function readText(filePath) {
  return fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "");
}

export function loadFunctionFromTs(tsFilePath, functionName) {
  const absolutePath = path.resolve(tsFilePath);
  const source = readText(absolutePath);
  const normalized = source
    .replace(new RegExp(`export\\s+function\\s+${functionName}`), `function ${functionName}`)
    .concat(`\nmodule.exports = { ${functionName} };`);

  const script = new vm.Script(normalized, { filename: absolutePath });
  const sandbox = { module: { exports: {} }, exports: {} };
  script.runInNewContext(sandbox);
  return sandbox.module.exports[functionName];
}
