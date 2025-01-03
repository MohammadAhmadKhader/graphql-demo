import fs from "fs"

export function writeToDB(persons: Person[]) {
    const dbPath = "./db.json"
    const data = getData(dbPath)

    persons.forEach((p)=>{
        data.persons.push(p)
    })

    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2))
}

export function addIds() {
    const dbPath = "./db.json"
    const data = getData(dbPath)

    data.persons = data.persons.map((p, index)=>{
        return {...p, id: index + 1}
    })
    
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2))
}

export function addNewPerson(person: Partial<Person>) {
    const dbPath = "./db.json"
    const data = getData(dbPath)

    const newIndex = data.persons[data.persons.length - 1].id + 1
    person["id"] = newIndex;

    data.persons.push(person as Person)
    
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2))
    return person
}

export function updatePerson(id: number, input: any) {
    const dbPath = "./db.json"
    const data = getData(dbPath)

    const person = data.persons.find((per) => per.id === id)
    console.log(person)
    if(!person) {
        return null
    }

    const personBeforeUpdate = data.persons[id - 1]
    data.persons[id - 1] = {...personBeforeUpdate, ...input}

    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2))
    return data.persons[id - 1]
}

function getData(dbPath: string) {
    const data = JSON.parse(fs.readFileSync(dbPath, "utf-8"))
    return data as DB
}