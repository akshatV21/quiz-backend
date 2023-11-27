import { Module } from '@nestjs/common';
import { SetsService } from './sets.service';
import { SetsController } from './sets.controller';
import { DatabaseModule } from 'src/database/database.module'
import { Set, SetSchema } from 'src/database/models'
import { SetRepository } from 'src/database/repositories'

@Module({
  imports: [DatabaseModule.forFeature([{ name: Set.name, schema: SetSchema }])],
  controllers: [SetsController],
  providers: [SetsService, SetRepository],
})
export class SetsModule {}
