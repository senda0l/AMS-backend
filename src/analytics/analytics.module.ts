import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { Issue } from '../issues/entities/issue.entity';
import { Apartment } from '../buildings/entities/apartment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Issue, Apartment])],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}


