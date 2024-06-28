import mongoose, {Schema, Document} from "mongoose";

export interface Message extends Document {
    content : string,
    createdAt : Date
}

const MessageSchema: Schema<Message> = new Schema({
    content : {
        type: String,
        required : true
    },
    createdAt :{
        type: Date,
        required: true,
        default: Date.now
    }
})

export interface User extends Document {
    username : string,
    email : string,
    password: string,
    verifyCode : string,
    verifyCodeExpiry: Date,
    isAcceptingMessage : boolean,
    isVerified : boolean,
    messages: Message[]
}

const UserSchema: Schema<User> = new Schema({
    username : {
        type: String,
        required : [true, 'User name is required'],
        trim : true,
        unique: true
    },
    email : {
        type: String,
        required : [true, 'Email is required'],
        unique: true,
        match : [/.+\@.+\..+/,"Please provide a valid email"]
    },
    password : {
        type: String,
        required : [true, 'Password is required'],
    },
    verifyCode : {
        type: String,
        required : [true, 'Verify Code is required'],
    },
    verifyCodeExpiry : {
        type: Date,
        required : [true, 'Verify Code Expiry is required'],
    },
    isVerified : {
        type: Boolean,
        default : false
    },
    isAcceptingMessage : {
        type: Boolean,
        default: true
    },
    messages : [MessageSchema],
})


// models

const UserModels = (mongoose.models.User as mongoose.Modal<User>) || mongoose.model<User>("User",UserSchema)

export default UserModels