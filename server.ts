import express from "express"
import { readFileSync } from "fs"
import { ApolloServer, BaseContext } from "@apollo/server"
import { startStandaloneServer } from "@apollo/server/standalone"
import resolvers from "./graphql/resolvers.js"

const app = express()
const filePath = "./schema.gql"
const typeDefs = readFileSync(filePath, {encoding:"utf-8"})

const server = new ApolloServer<BaseContext>({
    typeDefs,
    resolvers,
    plugins: [
        {
          async requestDidStart({ contextValue,request }) {
            console.log(request.variables)
            console.log(contextValue,"context value from start plugin")
          },
        }
      ],
})

const { url } = await startStandaloneServer(server, {
    listen: { port:4001 },
    context: async ({req, res}) =>{
        return {}
    }
})

console.log(`server is ready an running at url: ${url}`)

app.listen(4000, ()=>{
    console.log("server listening at 4000 port")
})
