import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DriverModule } from './driver/driver.module';
import { Driver } from './driver/entities/driver.entity';
import { Bus } from './bus/entities/bus.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
       host: 'localhost',
 port: 5432,
 username: 'postgres',
 password: '12345678',
  database: 'passenger',
      schema: 'public',
      entities: [Driver, Bus],
      synchronize: true,
      logging: true
    }),
    DriverModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
