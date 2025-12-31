import { RABBITMQ_URL } from "@/config";
import amqplib, { Channel } from "amqplib";

let channel: Channel | null = null;

export async function getChannel(): Promise<Channel> {
  if (channel) return channel;

  const connection = await amqplib.connect(RABBITMQ_URL);
  channel = await connection.createChannel();

  return channel;
}
