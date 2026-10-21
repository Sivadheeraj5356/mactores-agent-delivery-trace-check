#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { checkAgentDelivery } from "./delivery-check.js";

const [deliveryPath] = process.argv.slice(2);
if (!deliveryPath) {
  console.error("Usage: npm run check -- <agent-delivery.json>");
  process.exit(1);
}

const delivery = JSON.parse(await readFile(deliveryPath, "utf8"));
const report = checkAgentDelivery(delivery);
console.log(`Agent delivery evidence readiness: ${report.score} (${report.ready ? "ready" : "needs work"})`);
for (const check of report.checks) {
  console.log(`${check.passed ? "PASS" : "FAIL"} ${check.id}: ${check.label}`);
  if (!check.passed) console.log(`  Next: ${check.fix}`);
}
