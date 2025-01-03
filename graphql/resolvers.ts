import { faker } from "@faker-js/faker"
import db from "../db.json" with { type: "json" }
import { updatePerson, addNewPerson } from "../utils.js"
import {GraphQLResolveInfo} from "graphql"

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

const resolvers = {
    Developer: {
        metadata(parent: any){
            return {emptyByOverride:true}
        }
    },
    Person: {
        orders(parent: Order){
            return db.orders.filter((order: Order) => order.personId = parent.id)
        }
    },
    Order:{
        items() {
            return 99999
        }
    },
    Human: {
        __resolveType:(person: any, context: any, info: GraphQLResolveInfo) =>{
            console.log(context)
            context.data = 2
            
            if(person.email && typeof person.email?.length === "number") {
                return "Person"
            }

            if(!person.email) {
                return "NotPerson"
            }
            
            return null
        }
    },
    Query: {
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
        persons: (parent: any, {page, pageSize}: {page:number, pageSize:number}, context: any, info: GraphQLResolveInfo) =>{
            const limit = page * pageSize
            const slice = db.persons.slice((page - 1) * pageSize, limit)
    
            return slice
        },
        person: (parent: any, { id }: {id: number})=>{
            const person = db.persons.find((p)=>{
                return p.id === id
            })
    
            return person
        },
        spaces: ()=>{
            return spaces
        },
        human: (parent: any, { id }:{id: number})=>{
            // person implements human, so we can return person
            const person = db.persons.find((p)=>{
                return p.id === Number(id)
            })
    
            return person
        },
        humans:(parent: any, {page, pageSize}: any, context: any, info: any) =>{
            const limit = page * pageSize
            const slice = db.persons.slice((page - 1) * pageSize, limit)

            return slice
        },
        notPersons:(parent: any, {page, pageSize}: any, context: any, info: any) =>{
            const limit = page * pageSize
            const persons = db.notPersons.slice((page - 1) * pageSize, limit)
            const notPersons = db.persons.slice((page - 1) * pageSize, limit)

            return [...(persons.slice(0,3)), ...(notPersons.slice(0, 5))]
        },
    },
    Mutation: {
        updatePerson: (parent: any, {id, data:{name, email, age}}: any) =>{
            return updatePerson(id, {name, email:[email], age})
        },
        addPerson: (parent: any, {name, email, age}: any)=>{
            const person = {
                name,
                email:[email],
                age
            }
    
            return addNewPerson(person)
        },
    }
}

export default resolvers