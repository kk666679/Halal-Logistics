import { Controller, Get, Post, Body, Param } from "@nestjs/common";
import { SmartContractsService, ContractTemplate } from "./smart-contracts.service";

interface IssueCertificateDto {
  contractAddress: string;
  certificateNumber: string;
  productName: string;
  supplier: string;
  expiryDate: number;
  ipfsHash: string;
  from: string;
  privateKey: string;
}

@Controller("smart-contracts")
export class SmartContractsController {
  constructor(private readonly smartContractsService: SmartContractsService) {}

  @Get("halal-certification-template")
  async getHalalCertificationTemplate(): Promise<ContractTemplate> {
    return this.smartContractsService.getHalalCertificationContractTemplate();
  }

  @Get("supply-chain-tracker-template")
  async getSupplyChainTrackerTemplate(): Promise<ContractTemplate> {
    return this.smartContractsService.getSupplyChainTrackerContractTemplate();
  }

  @Post("deploy-halal-certification")
  async deployHalalCertificationContract(@Body("from") from: string): Promise<string> {
    return this.smartContractsService.deployHalalCertificationContract(from);
  }

  @Post("deploy-supply-chain-tracker")
  async deploySupplyChainTrackerContract(@Body("from") from: string): Promise<string> {
    return this.smartContractsService.deploySupplyChainTrackerContract(from);
  }

  @Post("issue-certificate")
  async issueCertificate(@Body() issueCertificateDto: IssueCertificateDto): Promise<string> {
    return this.smartContractsService.issueCertificate(
      issueCertificateDto.contractAddress,
      issueCertificateDto.certificateNumber,
      issueCertificateDto.productName,
      issueCertificateDto.supplier,
      issueCertificateDto.expiryDate,
      issueCertificateDto.ipfsHash,
      issueCertificateDto.from,
      issueCertificateDto.privateKey
    );
  }

  @Get("certificate/:contractAddress/:certificateNumber")
  async getCertificate(
    @Param("contractAddress") contractAddress: string,
    @Param("certificateNumber") certificateNumber: string,
  ): Promise<any> {
    return this.smartContractsService.getCertificate(contractAddress, certificateNumber);
  }

  @Get("certificate-validity/:contractAddress/:certificateNumber")
  async isCertificateValid(
    @Param("contractAddress") contractAddress: string,
    @Param("certificateNumber") certificateNumber: string,
  ): Promise<boolean> {
    return this.smartContractsService.isCertificateValid(contractAddress, certificateNumber);
  }
}
