import { DataSource } from "typeorm"

const AppDataSource = new DataSource({
type: "poqstgres",
host: "localhost",
port: 5432,
username: "test",
password: "test",
database: "test",
})

try {
await AppDataSource.initialize()
console.log("Data Source has been initialized!")
} catch (error) {
console.error("Error during Data Source initialization", error)
}