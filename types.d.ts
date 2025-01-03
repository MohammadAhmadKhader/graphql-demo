import { ApolloServer, ApolloServerOptions } from "@apollo/server"

export type DB = {
    persons: Person[]
    orders: Order[]
    notPerson: NotPerson[]
}

export type Person = {
    id: number
    name: string
    age: number
    email: string[]
}

export type Order = {
    id: number
    personId: number
    items: number

}

export type NotPerson = {
    name: string
    age: number
    type: "fish" | "cat" | "dog" 
}

export type Resolvers<ContextType = {}> = ApolloServerOptions<ContextType>["resolvers"]