const mongoose=require("mongoose");
const connectDb=async()=>{
    try{
        const connect=await mongoose.connect(process.env.CONNECTION_STRING);
        console.log("Database Connected: ",connect.connection.host,connect.connection.name);
    }
    catch(err){
        console.log(err);
        process.exit(1); //Terminate the process immediately 0-sucess and 1-fail
    }
    console.log("MongoDB Connection String: ", process.env.CONNECTION_STRING);

};
module.exports=connectDb;