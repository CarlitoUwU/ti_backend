import { Module, Global } from '@nestjs/common';
import { DateService } from './services/date.service';
import { RedisModule } from './redis/redis.module';

@Global()
@Module({
  imports: [RedisModule],
  providers: [DateService],
  exports: [DateService, RedisModule],
})
export class CommonModule { }
