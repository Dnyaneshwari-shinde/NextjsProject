import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class SwapService {
  private readonly moralisApiUrl = 'https://api.moralis.io/v1/eth/price';  // Example Moralis API for ETH price
  private readonly moralisApiKey = 'your-moralis-api-key'; // Replace with your Moralis API key

  constructor(private readonly httpService: HttpService) {}

  // Function to get ETH to BTC conversion rate from an API (using Moralis API as an example)
  getEthToBtcRate(): Observable<any> {
    const headers = {
      'X-API-Key': this.moralisApiKey,
    };

    // Example API call (replace with actual endpoint for ETH to BTC rate)
    return this.httpService.get(`${this.moralisApiUrl}/eth_btc`, { headers }).pipe(
      map(response => response.data)  // Adjust according to the response format
    );
  }

  // Function to calculate the total fee in ETH and USD
  calculateFee(ethAmount: number): { feeInEth: number; feeInUsd: number; btcAmount: number } {
    const ethToBtcRate = 0.062; // Replace with the actual rate fetched from the API
    const ethToUsdRate = 1800;  // Replace with the actual ETH to USD rate

    const feeInEth = ethAmount * 0.03;  // Fee is 3% of the ETH amount
    const feeInUsd = feeInEth * ethToUsdRate;  // Fee in USD (ETH * ETH to USD rate)
    const btcAmount = ethAmount * ethToBtcRate;  // Equivalent BTC amount

    return {
      feeInEth,
      feeInUsd,
      btcAmount,
    };
  }

  // Combine both operations to return the complete response
  async getSwapDetails(ethAmount: number): Promise<any> {
    const ethToBtcRate = await this.getEthToBtcRate().toPromise();
    const conversionRate = ethToBtcRate.price;  // Assuming the rate is returned as 'price'

    const feeData = this.calculateFee(ethAmount);

    return {
      equivalentBtc: feeData.btcAmount,
      feeInEth: feeData.feeInEth,
      feeInUsd: feeData.feeInUsd,
    };
  }
}
