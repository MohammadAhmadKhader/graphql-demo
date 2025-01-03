import { buildSchema, graphql } from "graphql"
import express from "express"
import { graphqlHTTP } from "express-graphql"
import { faker } from "@faker-js/faker"
import db from "./db.json"
import { readFileSync } from "fs"
import { updatePerson, addNewPerson } from "./utils.js"
import { Person } from "./types"

const app = express()
const filePath = "./schema.gql"
const typeDefs = readFileSync(filePath, {encoding:"utf-8"})
const schema = buildSchema(typeDefs);

const AVAILABLE = "AVAILABLE"
const NOT_AVAILABLE = "NOT_AVAILABLE"
const spaces = [{
    status: AVAILABLE
},{
    status: NOT_AVAILABLE
},{
    status: AVAILABLE
},{
    status: NOT_AVAILABLE
}]

const root = {
    developer: () =>{
        return {
            profile : {
                name: faker.person.fullName(),
                age: faker.number.int({min:12, max: 100}),
                isDeveloper: faker.number.int({min:0, max: 100}) > 50 ? true : false,
                email: [faker.internet.email({provider:"gmail.com"}), faker.internet.email({provider:"gmail.com"})]
            },
            salary: faker.number.float({min: 500, max: 5000, fractionDigits: 4})
        }
    },
    isDeveloper: ()=>{
        return true
    }, 
    persons: ({page, pageSize}:{page:number, pageSize:number}) =>{
        const limit = page * pageSize
        const slice = db.persons.slice((page - 1) * pageSize, limit)

        return slice
    },
    person: ({ id } :{id: number})=>{
        const person = db.persons.find((p:Person)=>{
            return p.id === id
        })

        return person
    },
    addPerson: ({name, email, age}:{name: string, email:string,  age: number})=>{
        const person = {
            name,
            email:[email],
            age
        }

        return addNewPerson(person)
    },
    updatePerson: ({id, data:{name, email, age}}:{id:number, data:{name: string, email:string,  age: number}}) =>{
        return updatePerson(id, {name, email:[email], age})
    },
    spaces: ()=>{
        return spaces
    }
}
app.use(
    "/graphql",
    graphqlHTTP({
        schema: schema,
        rootValue: root,
        graphiql: true
    })
);

app.listen(4000, ()=>{
    console.log("server listening at 4000 port")
})


//graphql({schema, source: '{hello}' ,rootValue:root}).then((res)=>{
//    console.log(res)
//}).catch((err)=>console.log(err))