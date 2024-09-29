import { Document, Model, ObjectId } from "mongoose";
import MessageBroker from "../util/messageBroker";
import { Event } from "../types/events";
import { DocumentWithId, TPayload } from "../types/consumeMessageT";
import { TOPIC_TYPE } from "../types/kafkaType";

const service = "product-service";

const Create = async <T>(id: string | ObjectId, data: T, model: Model<T>) => {
  try {
    const exist = await model.findOne({ _id: id });
    if (!exist) {
      await model.create(data);
    } else {
      console.log(`Document with ID ${id} already exists.`);
    }
  } catch (err) {
    console.log((err as Error).message);
  }
};

const Update = async <T>(id: string | ObjectId, data: Record<string, any>, model: Model<T>) => {
  try {
    const updatedDoc = await model.findOneAndUpdate({ _id: id }, data, { new: true });
    if (!updatedDoc) {
      console.log(`No document found with ID ${id} for update.`);
    }
  } catch (error) {
    console.error("Error processing data:", (error as Error).message);
  }
};

const Delete = async <T>(id: string | ObjectId, model: Model<T>) => {
  try {
    await model.findOneAndDelete({ _id: id });
  } catch (error) {
    console.error("Error processing data:", (error as Error).message);
  }
};

const Upsert = async <T>(id: string | ObjectId, data: Record<string, any>, model: Model<T>) => {
  try {
    await model.findOneAndUpdate({ _id: id }, data, { upsert: true });
  } catch (error) {
    console.error("Error processing data:", (error as Error).message);
  }
};

const proccesData = async <T extends Document>(topic: TOPIC_TYPE, groupName: string, model: Model<T>) => {
  const kafka = new MessageBroker();

  await kafka.subscribe(topic, `${service}-${groupName}`, async (payload: TPayload<T>) => {
    console.log(payload, "Received payload in " + groupName);
    switch (payload.event) {
      case Event.CREATE:
        await Create<T>(payload.message.data._id as string | ObjectId, payload.message.data, model);
        break;
      case Event.UPDATE:
        await Update<T>(payload.message.data._id as string | ObjectId, payload.message.data, model);
        break;
      case Event.DELETE:
        await Delete<T>(payload.message.data._id as string | ObjectId, model);
        break;
      case Event.UPSERT:
        await Upsert<T>(payload.message.data._id as string | ObjectId, payload.message.data, model);
        break;
    }
  });
};

export default proccesData;
