import mongoose, { Schema, Document } from "mongoose";

export interface IConversation extends Document {
  members: Array<mongoose.Types.ObjectId>;
  lastMessage?: mongoose.Types.ObjectId;
  bookingId?: mongoose.Types.ObjectId;
  unReadCount: { [key: string]: number };
}

const conversationSchema: Schema<IConversation> = new Schema(
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


const Conversation = mongoose.models.conversations as mongoose.Model<IConversation> || 
mongoose.model<IConversation>('conversations', conversationSchema)

export default Conversation