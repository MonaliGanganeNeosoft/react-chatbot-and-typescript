import { Injectable } from '@nestjs/common';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { getMetadataArgsStorage } from 'typeorm';
import {
  DB_TYPE,
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_DATABASE,
  TYPEORM_SYNC,
} from '@environments';
import { join } from 'path';


@Injectable()
export class TypeOrmService implements TypeOrmOptionsFactory {
  async createTypeOrmOptions(): Promise<TypeOrmModuleOptions> {
    const options: TypeOrmModuleOptions = {
      type: DB_TYPE,
      entities: [join(__dirname, '../../**/**.entity{.ts,.js}')],
      // entities: [],
      synchronize: TYPEORM_SYNC,
      autoLoadEntities: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      keepConnectionAlive: true,
      logging: true,
      host: DB_HOST,
      port: DB_PORT,
      username: DB_USER,
      password: DB_PASSWORD,
      database: DB_DATABASE,
      maxQueryExecutionTime: 1000,
    };
    return options;
  }
}
