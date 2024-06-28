import mongoose from "mongoose";

type ConnectionObject = {
    isConnected? : number
}

const connection : ConnectionObject = {}

async function dbConnect(): Promise<void> {
    if(connection.isConnected) {
        console.log("Database is connected")
        return
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || '')
        connection.isConnected = db.connections[0].readyState
        console.log("DB Connected Succesfully")
    }
    catch(error) {
        console.log("Database connection failed")
        process.exit(1) // gracefully close the request
    }
}
export default dbConnect;