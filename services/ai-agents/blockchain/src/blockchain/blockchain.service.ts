import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Web3 } from "web3";
import { Contract } from "web3-eth-contract";

export interface BlockchainConfig {
  network: string;
  rpcUrl: string;
  chainId: bigint;
  gasPrice: string;
  gasLimit: string;
}

export interface TransactionResult {
  success: boolean;
  txHash?: string;
  blockNumber?: bigint;
  gasUsed?: bigint;
  error?: string;
}

@Injectable()
export class BlockchainService {
  private readonly logger = new Logger(BlockchainService.name);
  private web3: Web3;
  private contracts: Map<string, Contract<any>> = new Map();

  constructor(private configService: ConfigService) {
    this.initializeWeb3();
  }

  private initializeWeb3() {
    const rpcUrl = this.configService.get<string>("BLOCKCHAIN_RPC_URL", "https://polygon-rpc.com");
    this.web3 = new Web3(rpcUrl);
    this.logger.log(`Connected to blockchain network: ${rpcUrl}`);
  }

  async getNetworkInfo(): Promise<BlockchainConfig> {
    try {
      const networkId = Number(await this.web3.eth.net.getId());
      const chainId = await this.web3.eth.getChainId();
      const gasPrice = await this.web3.eth.getGasPrice();
      const blockNumber = await this.web3.eth.getBlockNumber();

      return {
        network: this.getNetworkName(networkId),
        rpcUrl: this.configService.get<string>("BLOCKCHAIN_RPC_URL", "https://polygon-rpc.com"),
        chainId: chainId,
        gasPrice: gasPrice.toString(),
        gasLimit: "21000",
      };
    } catch (error) {
      this.logger.error("Failed to get network info", error);
      throw error;
    }
  }

  private getNetworkName(networkId: number): string {
    const networks: { [key: number]: string } = {
      1: "Ethereum Mainnet",
      137: "Polygon Mainnet",
      80001: "Polygon Mumbai",
      56: "BSC Mainnet",
      97: "BSC Testnet",
    };
    return networks[networkId] || `Network ${networkId}`;
  }

  async deployContract(
    abi: any[],
    bytecode: string,
    from: string,
    args: any[] = []
  ): Promise<TransactionResult> {
    try {
      const contract = new this.web3.eth.Contract(abi);
      const gasPrice = await this.web3.eth.getGasPrice();
      const gasLimit = 3000000n;

      // Get deployment transaction data
      const deployTx = contract.deploy({
        data: bytecode,
        arguments: args,
      });

      // Send transaction
      const tx = await this.web3.eth.sendTransaction({
        from,
        data: `0x${deployTx.encodeABI()}`,
        gas: gasLimit.toString(),
        gasPrice: gasPrice.toString(),
      });

      // Get contract address from transaction receipt
      const receipt = await this.web3.eth.getTransactionReceipt(tx.transactionHash);
      const contractAddress = receipt.contractAddress;

      if (!contractAddress) {
        throw new Error("Contract deployment failed - no contract address in receipt");
      }

      this.logger.log(`Contract deployed at: ${contractAddress}`);
      return {
        success: true,
        txHash: tx.transactionHash.toString(),
        blockNumber: BigInt(tx.blockNumber),
        gasUsed: BigInt(tx.gasUsed),
      };
    } catch (error) {
      this.logger.error("Failed to deploy contract", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async callContract(
    contractAddress: string,
    abi: any[],
    method: string,
    args: any[] = []
  ): Promise<any> {
    try {
      const contract = new this.web3.eth.Contract(abi, contractAddress);
      const result = await contract.methods[method](...args).call();
      return result;
    } catch (error) {
      this.logger.error(`Failed to call contract method ${method}`, error);
      throw error;
    }
  }

  async sendTransaction(
    contractAddress: string,
    abi: any[],
    method: string,
    from: string,
    privateKey: string,
    args: any[] = []
  ): Promise<TransactionResult> {
    try {
      const contract = new this.web3.eth.Contract(abi, contractAddress);
      const account = this.web3.eth.accounts.privateKeyToAccount(privateKey);
      this.web3.eth.accounts.wallet.add(account);

      const gasPrice = await this.web3.eth.getGasPrice();
      const gasLimit = await contract.methods[method](...args).estimateGas({ from });

      const tx = await contract.methods[method](...args).send({
        from,
        gas: gasLimit.toString(),
        gasPrice: gasPrice.toString(),
      });

      return {
        success: true,
        txHash: tx.transactionHash.toString(),
        blockNumber: BigInt(tx.blockNumber),
        gasUsed: BigInt(tx.gasUsed),
      };
    } catch (error) {
      this.logger.error(`Failed to send transaction for method ${method}`, error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async getTransactionReceipt(txHash: string): Promise<any> {
    try {
      const receipt = await this.web3.eth.getTransactionReceipt(txHash);
      return receipt;
    } catch (error) {
      this.logger.error("Failed to get transaction receipt", error);
      throw error;
    }
  }

  async getBalance(address: string): Promise<string> {
    try {
      const balance = await this.web3.eth.getBalance(address);
      return this.web3.utils.fromWei(balance, "ether");
    } catch (error) {
      this.logger.error("Failed to get balance", error);
      throw error;
    }
  }

  async validateAddress(address: string): Promise<boolean> {
    return this.web3.utils.isAddress(address);
  }

  async getBlockNumber(): Promise<bigint> {
    return await this.web3.eth.getBlockNumber();
  }

  async getBlock(timestamp?: number): Promise<any> {
    if (timestamp) {
      // Get block by timestamp (approximate)
      const latestBlock = await this.web3.eth.getBlock("latest");
      const targetTimestamp = Math.floor(timestamp / 1000);
      const currentTimestamp = Number(latestBlock.timestamp);

      const blockDiff = Math.floor((currentTimestamp - targetTimestamp) / 15); // ~15 seconds per block
      const targetBlockNumber = Number(latestBlock.number) - blockDiff;

      return await this.web3.eth.getBlock(BigInt(targetBlockNumber));
    } else {
      return await this.web3.eth.getBlock("latest");
    }
  }
}
