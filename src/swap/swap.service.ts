import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';


@Injectable()
export class SwapService {
  feePercentage: number;


  constructor(private readonly httpService: HttpService) {}

  async getSwapDetails(ethAmount: number) {
    // Fetch price data from CoinGecko
    const { data: ethData } = await this.httpService.get(
    'https://api.coingecko.com/api/v3/simple/price?ids=ethereum,bitcoin&vs_currencies=usd').toPromise();

    const ethPriceUsd = ethData.ethereum.usd;
    const btcPriceUsd = ethData.bitcoin.usd;

    // Calculate BTC amount
    const ethUsdValue = ethAmount * ethPriceUsd;
    const btcAmount = ethUsdValue / btcPriceUsd;

    // Calculate Fees
    const ethFee = this.feePercentage * ethAmount;
    const feeUsd = ethFee * ethPriceUsd;

    return {
      btcAmount,
      fee: { eth: ethFee, usd: feeUsd}
    };
  }
}

