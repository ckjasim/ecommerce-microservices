import { Consumer, Kafka, logLevel, Partitioners, Producer } from "kafkajs";
import IKafka from "../types/interface/IKafka";
import { TOPIC_TYPE, messageType, ProductEvent } from "../types/kafkaType";

const KAFKA_CLIENT_ID = "product-service";
const KAFKA_BROKERS = [ "kafka:29092"];

class MessageBroker implements IKafka {
  private kafka: Kafka;
  private producer: Producer;

  constructor() {
    this.kafka = new Kafka({
      clientId: KAFKA_CLIENT_ID,
      brokers: KAFKA_BROKERS,
      logLevel: logLevel.INFO,
    });
    this.producer = this.kafka.producer({
      createPartitioner: Partitioners.DefaultPartitioner,
    });

    // Connect the producer once during initialization
    this.init();
  }

  private async init() {
    try {
      await this.producer.connect();
      console.log("Kafka Producer connected");
    } catch (error) {
      console.error("Failed to connect Kafka Producer", error);
    }
  }

  async publish(topic: TOPIC_TYPE, message: messageType, event: ProductEvent) {
    try {
      await this.producer.send({
        topic,
        messages: [{ value: JSON.stringify(message), key: event }],
      });
      console.log(`Message sent to topic ${topic}`);
    } catch (error) {
      console.error(`Error publishing message to ${topic}: ${(error as Error).message}`);
      throw error; // propagate error
    }
  }

  async subscribe(topic: TOPIC_TYPE, groupId: string, messageHandler: Function) {
    const consumer = this.kafka.consumer({ groupId });
    try {
      await consumer.connect();
      await consumer.subscribe({ topic, fromBeginning: true });

      await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          try {
            if (message.key && message.value) {
              const inputMessage = {
                event: message.key.toString(),
                message: message.value ? JSON.parse(message.value.toString()) : null,
              };
              if (inputMessage.event && inputMessage.message) {
                await messageHandler(inputMessage);
              } else {
                console.warn(`Malformed message received: ${message}`);
              }
            }
          } catch (error) {
            console.error(`Error processing message: ${(error as Error).message}`);
            // Implement retry logic if necessary
          } finally {
            await consumer.commitOffsets([{
              topic,
              partition,
              offset: (Number(message.offset) + 1).toString(),
            }]);
          }
        },
      });
    } catch (error) {
      console.error(`Error setting up consumer: ${(error as Error).message}`);
    }
  }

  // Disconnect the producer when shutting down
  async disconnect() {
    await this.producer.disconnect();
    console.log("Kafka Producer disconnected");
  }
}

export default MessageBroker;
