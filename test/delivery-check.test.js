import test from "node:test";
import assert from "node:assert/strict";
import { checkAgentDelivery } from "../src/delivery-check.js";

const readyDelivery = {
  customerOutcome: "Produce a reviewed application dependency map that an engineer can use during modernization planning.",
  agentToolContract: "Tools accept a repository or inventory identifier and return dependencies with source path, confidence, and timestamp.",
  retrievalSource: "Use only the approved synthetic repository inventory and architecture notes for this evaluation.",
  testEvidence: "Run 12 dependency cases with 100% source coverage and compare each result with the expected map.",
  humanReview: "A forward-deployed engineer reviews low-confidence links and every customer-facing result before release.",
  rollbackRule: "Reject generated dependencies without a source path or confidence score and rerun with the deterministic parser.",
  auditTrace: "Keep prompt version, source identifiers, tool calls, generated output, test result, reviewer decision, and release timestamp.",
  releaseOwner: "Mactores forward-deployed engineering owner"
};

test("accepts a complete agent delivery slice", () => {
  const report = checkAgentDelivery(readyDelivery);
  assert.equal(report.ready, true);
  assert.equal(report.score, "9/9");
});

test("rejects a missing customer outcome", () => {
  const report = checkAgentDelivery({ ...readyDelivery, customerOutcome: "" });
  assert.equal(report.checks.find((check) => check.id === "customerOutcome").passed, false);
});

test("rejects a missing tool contract", () => {
  const report = checkAgentDelivery({ ...readyDelivery, agentToolContract: "" });
  assert.equal(report.checks.find((check) => check.id === "agentToolContract").passed, false);
});

test("rejects missing retrieval source", () => {
  const report = checkAgentDelivery({ ...readyDelivery, retrievalSource: "" });
  assert.equal(report.checks.find((check) => check.id === "retrievalSource").passed, false);
});

test("requires numeric test evidence", () => {
  const report = checkAgentDelivery({ ...readyDelivery, testEvidence: "tests pass" });
  assert.equal(report.checks.find((check) => check.id === "tested-evidence").passed, false);
});

test("requires rollback and release ownership", () => {
  const report = checkAgentDelivery({ ...readyDelivery, rollbackRule: "retry", releaseOwner: "team" });
  assert.equal(report.checks.find((check) => check.id === "rollbackRule").passed, false);
  assert.equal(report.checks.find((check) => check.id === "releaseOwner").passed, false);
});
