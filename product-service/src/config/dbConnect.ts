import {connect } from 'mongoose'

const dbUrl='mongodb+srv://jasim:XTlFg5ggiUVQvN9n@cluster0.ijunqha.mongodb.net/product-service'

export default async function dbConnect(){

 await connect(dbUrl)
      .then(()=>{
      console.log("connected to DB");
      })
      .catch((err)=>{
          console.log(err)
      })
}