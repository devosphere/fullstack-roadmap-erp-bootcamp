import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from 'module/health/health.module';
import { AuthModule } from 'module/auth/auth.module';
import { PrismaModule } from 'src/database/prisma/prisma.module';

@Module({
  imports: [HealthModule, AuthModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
