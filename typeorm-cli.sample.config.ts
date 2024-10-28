import { DataSource } from "typeorm";

export default new DataSource({
    type: 'postgres',
    host: "database host",
    port: 5432,
    username: 'database username',
    password: "database password",
    database: "database name",
    entities: ['**/*.entity.js'],
    migrations: ['migrations/*.js'],
})