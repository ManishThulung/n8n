import { QUEUES } from "@n8n/queue";
import { getChannel } from "./conn";

export async function publishWorkflowJob(
  workflowId: string,
  userId: string,
  delayMs: number
) {
  const channel = await getChannel();

  // // Declare dead-letter queue
  // await channel.assertQueue(QUEUES, { durable: true });

  // Declare main target queue with DLX pointing to DLQ
  await channel.assertQueue(QUEUES.WORKFLOW_EXECUTION, {
    durable: true,
    // arguments: {
    //   "x-dead-letter-exchange": "", // Default exchange
    //   "x-dead-letter-routing-key": dlqQueue,
    // },
  });

  // Declare delay queue with DLX
  await channel.assertQueue(QUEUES.WORKFLOW_DELAY, {
    durable: true,
    arguments: {
      "x-dead-letter-exchange": "", // Use default direct exchange
      "x-dead-letter-routing-key": QUEUES.WORKFLOW_EXECUTION,
    },
  });

  const message = JSON.stringify({ workflowId, userId, delayMs });

  channel.sendToQueue(QUEUES.WORKFLOW_DELAY, Buffer.from(message), {
    expiration: delayMs.toString(),
    persistent: true,
  });

  console.log(
    `Scheduled workflow executation: ${workflowId} in ${delayMs / 1000}s`
  );
}
