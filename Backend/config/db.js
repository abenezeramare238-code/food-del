import mongoose from "mongoose";

export const connectDB = async ()=> {
    (await mongoose.connect('mongodb+srv://abenezer:00957765@cluster0.tj90yjh.mongodb.net/food-del')).then(()=>console.log("DB Connected"));
}