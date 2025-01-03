type DB = {
    persons: Person[]
    orders: Order[]
    notPerson: NotPerson[]
}

type Person = {
    id: number
    name: string
    age: number
    email: string[]
}

type Order = {
    id: number
    personId: number
    items: number

}

type NotPerson = {
    name: string
    age: number
    type: "fish" | "cat" | "dog" 
}