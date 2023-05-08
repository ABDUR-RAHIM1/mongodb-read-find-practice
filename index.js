const express = require('express')
const mongoose = require("mongoose")
const mongoURL = `mongodb+srv://abrar:3NUfKV42ivL3fxNm@cluster0.ekd31bu.mongodb.net/admin1?retryWrites=true&w=majority`

const app = express()
const cors = require('cors')
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({extended : true}))
const port = 8000;

//  create schema for mongodb atlas 

const productSchema = new mongoose.Schema({
    title: {
        type:String,
        required: true
    },
    price: {
        type:Number,
        required: true
    },
    description: {
        type:String,
        required: true
    },
    cretedAt: {
        type: Date,
        default: Date.now
    }
})

//   create modal
 const Product =  mongoose.model("Products", productSchema) 


//  connect database 

const connectDB = async () => {
    try {
        await mongoose.connect(mongoURL)
        console.log("Databse is Connected")
    } catch (error) {
        console.log("db not connected ", error)
        process.exit(1)
    }
}




app.listen(port, async () => {
    console.log(`server is running at http://localhost:${port}`)
    await connectDB()
})

//  send request from server 

app.get("/", (req, res) => {
    res.send("welcome to home page")
})

app.post("/products", async (req, res)=>{
     try {
        //  get  data from databasae body
        const title = req.body.title;
        const price = req.body.price;
        const description = req.body.description

        const newProduct = new Product({
            title : title,
            price : price,
            description: description, 
        })

       const productData = await newProduct.save()
        res.status(201).send(productData )


     } catch (error) {
         res.status(5000).send({massage : error.message})
     }
})

//  read method handler 

app.get("/products",async (req, res)=>{
      try {
        // find on modal name => modal name id Product
      const products =  await Product.find().limit(2)
      if (products) {
        res.status(200).send(products)
      }else{
        res.status(404).send({massage : "product not found"})
      }
      } catch (error) {
          res.status(404).send({messege : error.messege})
      }
})

//  data find by id  from database 
app.get("/products/:id",async (req, res)=>{
      try {
        const id = req.params.id;
        // find on modal name => modal name id Product
    //   const product =  await Product.find({_id : id})   // return array object 
       const product =  await Product.findOne({_id : id} , {title : 1})  // return one single object based on id 
        // const product =  await Product.findOne({_id : id}).select({
        //     title:1
        // })  // return specefic property , like as title

      res.send(product)
      
    //   if (products) {
    //     res.status(200).send(products)
    //   }else{
    //     res.status(404).send({massage : "product not found"})
    //   }
      } catch (error) {
          res.status(404).send({messege : error.messege})
      }
})
//  DATABASE => collection => documents 

//  method 
//  POST : /products =>  create a products 
//  GET: /products => return all the products
//  GET: /products/id => return specefic products basesd on id
//   PUT/ UPDATE: /products  => Update a produts
// DELETE : /prducts/id  =>   deleete  products specefic id 

