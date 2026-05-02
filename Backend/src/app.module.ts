import {
  Module,
  RequestMethod,
  type MiddlewareConsumer,
  type NestModule,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { BooksModule } from './books/books.module';
import { FirstMiddleware } from './middlewares/first/first.middleware';
import { SecondMiddleware } from './middlewares/second/second.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FavorisModule } from "./books/favoris.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TasksModule,
    BooksModule,
    FavorisModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql' as const,
        driver: require('mysql2'),
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 3308),
        username: configService.get<string>('DB_USERNAME', 'root'),
        password: configService.get<string>('DB_PASSWORD', ''),
        database: configService.get<string>('DB_NAME', 'isids26'),
        autoLoadEntities: true,
        synchronize: true, // ⚠️ Set to false in production
        logging: false,
      }),
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(FirstMiddleware).forRoutes(''); // appliqué pour toutes les routes
    // consumer.apply(FirstMiddleware).forRoutes('tasks/*'); // appliqué pour toutes les routes
    consumer.apply(SecondMiddleware).forRoutes('');
    consumer.apply(FirstMiddleware).forRoutes({
      path: 'tasks/*',
      method: RequestMethod.GET,
    });
  }
  
  constructor(private configSer : ConfigService) {}
}
