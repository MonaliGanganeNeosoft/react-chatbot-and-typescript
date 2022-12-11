import { ConnectionOptions } from 'typeorm';

const connectionOptions: ConnectionOptions = {
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: Number.parseInt(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    entities: ['dist/entities/*.js', 'dist/app/**/**.entity.js'],
    /** make false always  */
    synchronize: process.env.ENV === "LOCAL",
    logging: true,
    migrations: [
        "dist/migration/*.js"
    ],
    migrationsRun: false,
    cli: {
        "migrationsDir": "src/migration",
    }
};

export = connectionOptions;
