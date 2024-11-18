import { Module } from '@nestjs/common';
import { TaxProofModule } from './module/tax-proof-module';

@Module({
  imports: [TaxProofModule],
})
export class AppModule {}
