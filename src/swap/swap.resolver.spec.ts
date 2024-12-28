import { Test, TestingModule } from '@nestjs/testing';
import { SwapResolver } from './swap.resolver';
import { SwapService } from './swap.service';

describe('SwapResolver', () => {
  let resolver: SwapResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SwapResolver, SwapService],
    }).compile();

    resolver = module.get<SwapResolver>(SwapResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
