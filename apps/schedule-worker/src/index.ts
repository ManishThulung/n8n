import amqplib from "amqplib";
import { QUEUES } from "@n8n/queue";
import { Workflow } from "@n8n/db";
import { startServer } from "./config/db";
import { RABBITMQ_URL } from "./config";
import { buildGraph } from "./lib/helpers/buildGraph";
import { executeEmailNode, executeHttpNode } from "./lib/executors";

startServer();
const connectToRabbit = async () => {
  try {
    const conn = await amqplib.connect(RABBITMQ_URL);
    conn.on("error", (err) => {
      console.error("RabbitMQ connection error:", err);
    });
    conn.on("close", async () => {
      console.log("RabbitMQ connection closed. Reconnecting...");
      setTimeout(connectToRabbit, 5000);
    });

    const channel = await conn.createChannel();

    await channel.assertQueue(QUEUES.WORKFLOW_EXECUTION, {
      durable: true,
    });

    // Declare delay queue with DLX
    await channel.assertQueue(QUEUES.WORKFLOW_DELAY, {
      durable: true,
      arguments: {
        "x-dead-letter-exchange": "", // Use default direct exchange
        "x-dead-letter-routing-key": QUEUES.WORKFLOW_EXECUTION,
      },
    });

    await channel.prefetch(1);

    channel.consume(QUEUES.WORKFLOW_EXECUTION, async (message) => {
      if (!message) return;
      try {
        const { workflowId, userId, delayMs } = JSON.parse(
          message.content.toString()
        );

        const res = await executeScheduledWorkflow(workflowId);
        if (!res) {
          channel.ack(message);
          return;
        }

        const msg = JSON.stringify({ workflowId, userId, delayMs });
        channel.sendToQueue(QUEUES.WORKFLOW_DELAY, Buffer.from(msg), {
          expiration: delayMs.toString(),
          persistent: true,
        });
        channel.ack(message);
      } catch (err) {
        console.error(err);
        channel.nack(message);
      }
    });
  } catch (err) {
    console.error("Failed to connect to RabbitMQ:", err);
    setTimeout(connectToRabbit, 5000);
  }
};

connectToRabbit();

async function executeScheduledWorkflow(workflowId: string) {
  const workflow = await Workflow.findById(workflowId);
  if (!workflow) {
    console.log(`Workflow with id: ${workflowId} not found!`);
    return false;
  }

  // Here, add the logic to execute the workflow.
  console.log(`Executing workflow with id: ${workflowId}`);
  const { nodes, edges } = workflow;

  const { nodeMap, adjList, inDegree } = buildGraph(nodes, edges);

  // Execution context (like n8n execution data)
  const executionResults: Record<string, any> = {};

  // Queue of executable nodes
  const readyQueue: string[] = [];

  // Start from trigger
  for (const [nodeId, deg] of inDegree.entries()) {
    if (deg === 0) readyQueue.push(nodeId);
  }

  while (readyQueue.length > 0) {
    const batch = [...readyQueue];
    readyQueue.length = 0;

    // Execute batch in parallel
    await Promise.all(
      batch.map(async (nodeId) => {
        const node = nodeMap.get(nodeId);
        if (!node) return;

        console.log(`Executing node: ${node.type}`);

        if (node.type === "http-action") {
          executionResults[nodeId] = await executeHttpNode(node);
        }

        if (node.type === "email-action") {
          const httpResults = Object.values(executionResults);
          console.log(node, "nodenodenode");
          await executeEmailNode(node, httpResults);
        }

        // Reduce indegree of children
        for (const next of adjList.get(nodeId) || []) {
          inDegree.set(next, inDegree.get(next)! - 1);
          if (inDegree.get(next) === 0) {
            readyQueue.push(next);
          }
        }
      })
    );
  }

  console.log("Workflow execution completed:", workflowId);
  return true;
}
