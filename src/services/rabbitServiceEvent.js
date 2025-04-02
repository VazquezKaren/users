import amqp from "amqplib";
import dotenv from "dotenv";

dotenv.config();

const RABBITMQ_URL = process.env.RABBITMQ_URL;
const RABBITMQ_EXCHANGE = "user_event";
const RABBITMQ_ROUTING_KEY = "user.created";

export async function userCreatedEvent(user) {
  const connection = await amqp.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();

  const exchange = "user_event";
  const queue = "user_created_queue";
  const routingKey = "user.created";

  await channel.assertExchange(exchange, "topic", { durable: true });
  await channel.assertQueue(queue, { durable: true });
  await channel.bindQueue(queue, exchange, routingKey);

  const message = JSON.stringify(user);
  channel.publish(
    RABBITMQ_EXCHANGE,
    RABBITMQ_ROUTING_KEY,
    Buffer.from(message)
  );

  console.log(
    `[x] exchange "${RABBITMQ_EXCHANGE}", routing key "${RABBITMQ_ROUTING_KEY}": ${message}`
  );

  setTimeout(() => {
    connection.close();
  }, 500);
}