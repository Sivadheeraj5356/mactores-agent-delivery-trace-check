const REQUIRED_FIELDS = [
  ["customerOutcome", "The delivery slice names the customer outcome"],
  ["agentToolContract", "The work defines each callable tool's inputs, outputs, and limits"],
  ["retrievalSource", "The work names the approved discovery or dependency source"],
  ["testEvidence", "The work defines the tests that prove the agent behavior"],
  ["humanReview", "The work defines the forward-deployed engineer review step"],
  ["rollbackRule", "The work defines when generated output is rejected or rolled back"],
  ["auditTrace", "The work defines the prompt, tool, source, and decision trace to keep"],
  ["releaseOwner", "The work names the owner allowed to release the result"]
];

export function checkAgentDelivery(delivery) {
  const checks = REQUIRED_FIELDS.map(([field, label]) => ({
    id: field,
    label,
    passed: typeof delivery[field] === "string" && delivery[field].trim().length >= 8,
    fix: `Add a specific ${field} entry before treating this as delivery-ready.`
  }));

  checks.push({
    id: "tested-evidence",
    label: "The test evidence includes a numeric case count or coverage threshold",
    passed: /\d/.test(`${delivery.testEvidence || ""}`),
    fix: "Add a numeric test case count or coverage threshold."
  });

  const passed = checks.filter((check) => check.passed).length;
  return {
    ready: passed === checks.length,
    score: `${passed}/${checks.length}`,
    checks
  };
}
