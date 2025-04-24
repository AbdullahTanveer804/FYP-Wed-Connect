import mongoose, {Schema, Document} from "mongoose";


export interface IMessage extends Document {
    conversationId: mongoose.Types.ObjectId
    sender: mongoose.Types.ObjectId
    content: string
    isReaded: boolean
}


const messageSchema: Schema<IMessage> = new Schema({
    conversationId: {
        type: Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    isReaded: {
        type: Boolean,
        default: false
    }

}, {timestamps: true})


const Message = mongoose.models.messages as mongoose.Model<IMessage> || 
mongoose.model<IMessage>('messages', messageSchema)

export default Message