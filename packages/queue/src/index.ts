export const QUEUES = {
  WORKFLOW_EXECUTION: "workflow.execution",
  WORKFLOW_DELAY: "workflow.delay",
  WORKFLOW_RETRY: "workflow.retry",
} as const;

export interface WorkflowExecutionPayload {
  workflowId: string;
  userId: string;
  delayMs: number;
}
