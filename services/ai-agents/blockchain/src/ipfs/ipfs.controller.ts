import { Controller, Get, Post, Body, Param, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { IpfsService, IpfsUploadResult } from "./ipfs.service";

interface UploadJsonDto {
  data: any;
}

interface CertificateDocumentDto {
  certificateNumber: string;
  productName: string;
  supplier: string;
  issueDate: string;
  expiryDate: string;
  issuer: string;
  additionalInfo?: any;
}

interface SupplyChainDocumentDto {
  productId: string;
  location: string;
  temperature: number;
  humidity: number;
  timestamp: string;
  sensorData?: any;
  notes?: string;
}

@Controller("ipfs")
export class IpfsController {
  constructor(private readonly ipfsService: IpfsService) {}

  @Post("upload-json")
  async uploadJson(@Body() uploadJsonDto: UploadJsonDto): Promise<IpfsUploadResult> {
    return this.ipfsService.uploadJson(uploadJsonDto.data);
  }

  @Post("upload-certificate")
  async uploadCertificateDocument(@Body() certificateDto: CertificateDocumentDto): Promise<IpfsUploadResult> {
    return this.ipfsService.uploadCertificateDocument(certificateDto);
  }

  @Post("upload-supply-chain")
  async uploadSupplyChainDocument(@Body() supplyChainDto: SupplyChainDocumentDto): Promise<IpfsUploadResult> {
    return this.ipfsService.uploadSupplyChainDocument(supplyChainDto);
  }

  @Post("upload-file")
  @UseInterceptors(FileInterceptor("file"))
  async uploadFile(@UploadedFile() file: any): Promise<IpfsUploadResult> {
    if (!file) {
      return {
        success: false,
        error: "No file provided",
      };
    }

    return this.ipfsService.uploadBuffer(file.buffer, file.originalname);
  }

  @Get("download/:hash")
  async downloadFile(@Param("hash") hash: string): Promise<Buffer> {
    return this.ipfsService.downloadFile(hash);
  }

  @Get("download-json/:hash")
  async downloadJson(@Param("hash") hash: string): Promise<any> {
    return this.ipfsService.downloadJson(hash);
  }

  @Get("info/:hash")
  async getFileInfo(@Param("hash") hash: string): Promise<any> {
    return this.ipfsService.getFileInfo(hash);
  }

  @Post("pin/:hash")
  async pinFile(@Param("hash") hash: string): Promise<boolean> {
    return this.ipfsService.pinFile(hash);
  }

  @Post("unpin/:hash")
  async unpinFile(@Param("hash") hash: string): Promise<boolean> {
    return this.ipfsService.unpinFile(hash);
  }

  @Get("pinned/:hash")
  async isPinned(@Param("hash") hash: string): Promise<boolean> {
    return this.ipfsService.isPinned(hash);
  }

  @Get("verify/:hash")
  async verifyFile(@Param("hash") hash: string): Promise<boolean> {
    return this.ipfsService.verifyFile(hash);
  }

  @Get("gateway-url/:hash")
  async getGatewayUrl(@Param("hash") hash: string): Promise<string> {
    return this.ipfsService.getGatewayUrl(hash);
  }

  @Get("node-info")
  async getNodeInfo(): Promise<any> {
    return this.ipfsService.getNodeInfo();
  }
}
