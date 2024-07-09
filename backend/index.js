import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { typeDefs } from './database/schema.js'
import authRoutes from './routes/authRoute.js'
import mysql from 'mysql2/promise.js'
import { resolvers } from './database/resolver.js'
import { ApolloServer } from 'apollo-server-express'
dotenv.config()

const app= express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(cors())


async function init(){
    try{
        const pool=mysql.createPool({
            host: process.env.HOST,
            user: process.env.USER,
            password: process.env.PASSWORD,
            database: process.env.DATABASE,
            port: process.env.DB_PORT   
    
        })


        await pool.getConnection()
        // console.log(pool)

        const graphql=new ApolloServer({
            typeDefs,
            resolvers,
            context: {pool}
        })

        await graphql.start()

        graphql.applyMiddleware({app})
        app.use('/api/user',authRoutes)
        app.use('^/$', (req,res,next)=>{
            
        })
      

        app.listen(process.env.PORT,()=>{
            console.log(`server is running on ${process.env.PORT}`)
        })
    }catch (err){
        console.log(err)
    }
}
init()