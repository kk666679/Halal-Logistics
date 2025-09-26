import { Controller, Get, Post, Body, Param, Query } from "@nestjs/common";
import { BlockchainService, BlockchainConfig, TransactionResult } from "./blockchain.service";

interface DeployContractDto {
  abi: any[];
  bytecode: string;
  from: string;
  args?: any[];
}

interface CallContractDto {
  contractAddress: string;
  abi: any[];
  method: string;
  args?: any[];
}

interface SendTransactionDto {
  contractAddress: string;
  abi: any[];
  method: string;
  from: string;
  privateKey: string;
  args?: any[];
}

@Controller("blockchain")
export class BlockchainController {
  constructor(private readonly blockchainService: BlockchainService) {}

  @Get("network-info")
  async getNetworkInfo(): Promise<BlockchainConfig> {
    return this.blockchainService.getNetworkInfo();
  }

  @Get("balance/:address")
  async getBalance(@Param("address") address: string): Promise<string> {
    return this.blockchainService.getBalance(address);
  }

  @Get("validate-address/:address")
  async validateAddress(@Param("address") address: string): Promise<boolean> {
    return this.blockchainService.validateAddress(address);
  }

  @Get("block-number")
  async getBlockNumber(): Promise<string> {
    const blockNumber = await this.blockchainService.getBlockNumber();
    return blockNumber.toString();
  }

  @Get("block")
  async getBlock(@Query("timestamp") timestamp?: string): Promise<any> {
    const timestampNum = timestamp ? parseInt(timestamp) : undefined;
    return this.blockchainService.getBlock(timestampNum);
  }

  @Post("deploy-contract")
  async deployContract(@Body() deployContractDto: DeployContractDto): Promise<TransactionResult> {
    return this.blockchainService.deployContract(
      deployContractDto.abi,
      deployContractDto.bytecode,
      deployContractDto.from,
      deployContractDto.args
    );
  }

  @Post("call-contract")
  async callContract(@Body() callContractDto: CallContractDto): Promise<any> {
    return this.blockchainService.callContract(
      callContractDto.contractAddress,
      callContractDto.abi,
      callContractDto.method,
      callContractDto.args
    );
  }

  @Post("send-transaction")
  async sendTransaction(@Body() sendTransactionDto: SendTransactionDto): Promise<TransactionResult> {
    return this.blockchainService.sendTransaction(
      sendTransactionDto.contractAddress,
      sendTransactionDto.abi,
      sendTransactionDto.method,
      sendTransactionDto.from,
      sendTransactionDto.privateKey,
      sendTransactionDto.args
    );
  }

  @Get("transaction/:txHash")
  async getTransactionReceipt(@Param("txHash") txHash: string): Promise<any> {
    return this.blockchainService.getTransactionReceipt(txHash);
  }
}
