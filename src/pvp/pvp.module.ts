import { Module } from '@nestjs/common';
import { PvpService } from './pvp.service';
import { PvpController } from './pvp.controller';

@Module({
  controllers: [PvpController],
  providers: [PvpService],
})
export class PvpModule {}
