import { Controller } from '@nestjs/common';
import { PvpService } from './pvp.service';

@Controller('pvp')
export class PvpController {
  constructor(private readonly pvpService: PvpService) {}
}
