import mongoose, { Schema, Document } from "mongoose";

export interface ICoversation extends Document {
  members: Array<mongoose.Types.ObjectId>;
  lastMessage?: mongoose.Types.ObjectId;
  bookingId?: mongoose.Types.ObjectId;
  unReadCount: { [key: string]: number };
}

const conversationSchema: Schema<ICoversation> = new Schema(
  {
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
    },
    unReadCount: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  { timestamps: true }
);


const Conversation = mongoose.models.conversations as mongoose.Model<ICoversation> || 
mongoose.model<ICoversation>('conversations', conversationSchema)

export default Conversation