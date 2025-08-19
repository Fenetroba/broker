import mongoose from 'mongoose';
import "dotenv/config";
export const DBconnect= async()=>{

try {
     const CN= await mongoose.connect(process.env.DB) 
     console.log('database connected')
} catch (error) {
     console.log(error)
} 

}
