import { Module } from '@nestjs/common';
import { BlacklistLibService } from './blacklist-lib.service';

@Module({
  providers: [BlacklistLibService],
  exports: [BlacklistLibService],
})
export class BlacklistLibModule {}
