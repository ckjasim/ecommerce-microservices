import { messageType, TOPIC_TYPE, UserEvent } from "../kafkaType";

export default interface IKafka{
  publish (topic: TOPIC_TYPE, message:messageType,event:UserEvent) : Promise<void>;

}