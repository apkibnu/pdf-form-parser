import { Module } from '@nestjs/common';
import { TaxProofController } from 'src/presentation/controllers/tax-proof-controller';
import { TaxProofService } from 'src/services/tax-proof-service';

@Module({
  imports: [],
  controllers: [TaxProofController],
  providers: [TaxProofService],
})
export class TaxProofModule {}
