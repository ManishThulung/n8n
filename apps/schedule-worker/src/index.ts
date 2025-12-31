import amqplib from "amqplib";
import { QUEUES } from "@n8n/queue";

const connectToRabbit = async () => {
  try {
    const conn = await amqplib.connect(process.env.RABBITMQ_URL!);
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

    channel.consume(QUEUES.WORKFLOW_EXECUTION, async (msg) => {
      if (!msg) return;
      try {
        const { workflowId, userId, delayMs } = JSON.parse(
          msg.content.toString()
        );
        console.log("Processing profile", { workflowId, userId, delayMs });
        channel.ack(msg);
      } catch (err) {
        console.error(err);
        channel.nack(msg);
      }
    });
  } catch (err) {
    console.error("Failed to connect to RabbitMQ:", err);
    setTimeout(connectToRabbit, 5000);
  }
};

connectToRabbit();
