import express from "express"
import { readFileSync } from "fs"
import { ApolloServer } from "@apollo/server"
import { startStandaloneServer } from "@apollo/server/standalone"
import resolvers from "./graphql/resolvers.js"

const app = express()
const filePath = "./schema.gql"
const typeDefs = readFileSync(filePath, {encoding:"utf-8"})

const server = new ApolloServer({
    typeDefs,
    resolvers,
})

const { url } = await startStandaloneServer(server, {
    listen: { port:4001 },
} as any)

const ans =await (async function test(){
    console.log("test")
    return 1
})()

console.log(`server is ready an running at url: ${url}`)

app.listen(4000, ()=>{
    console.log("server listening at 4000 port")
})
