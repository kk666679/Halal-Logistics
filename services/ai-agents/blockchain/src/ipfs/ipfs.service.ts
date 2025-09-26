import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { create, IPFSHTTPClient } from "ipfs-http-client";

export interface IpfsUploadResult {
  success: boolean;
  hash?: string;
  size?: number;
  url?: string;
  error?: string;
}

@Injectable()
export class IpfsService {
  private readonly logger = new Logger(IpfsService.name);
  private ipfs: IPFSHTTPClient;
  private gatewayUrl: string;

  constructor(private configService: ConfigService) {
    this.initializeIpfs();
  }

  private initializeIpfs() {
    const ipfsUrl = this.configService.get<string>("IPFS_URL", "https://ipfs.infura.io:5001");
    const gatewayUrl = this.configService.get<string>("IPFS_GATEWAY", "https://gateway.pinata.cloud/ipfs/");

    try {
      this.ipfs = create({ url: ipfsUrl });
      this.gatewayUrl = gatewayUrl;
      this.logger.log(`Connected to IPFS: ${ipfsUrl}`);
    } catch (error) {
      this.logger.error("Failed to connect to IPFS", error);
      throw error;
    }
  }

  async uploadFile(file: { path: string; content: Buffer | string }): Promise<IpfsUploadResult> {
    try {
      const result = await this.ipfs.add({
        path: file.path,
        content: file.content,
      });

      this.logger.log(`File uploaded to IPFS: ${result.path} -> ${result.cid.toString()}`);

      return {
        success: true,
        hash: result.cid.toString(),
        size: result.size,
        url: `${this.gatewayUrl}${result.cid.toString()}`,
      };
    } catch (error) {
      this.logger.error("Failed to upload file to IPFS", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  async uploadJson(data: Record<string, unknown>): Promise<IpfsUploadResult> {
    try {
      const jsonString = JSON.stringify(data, null, 2);
      const result = await this.ipfs.add({
        path: `data-${Date.now()}.json`,
        content: jsonString,
      });

      this.logger.log(`JSON data uploaded to IPFS: ${result.cid.toString()}`);

      return {
        success: true,
        hash: result.cid.toString(),
        size: result.size,
        url: `${this.gatewayUrl}${result.cid.toString()}`,
      };
    } catch (error) {
      this.logger.error("Failed to upload JSON to IPFS", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  async uploadBuffer(buffer: Buffer, filename: string): Promise<IpfsUploadResult> {
    try {
      const result = await this.ipfs.add({
        path: filename,
        content: buffer,
      });

      this.logger.log(`Buffer uploaded to IPFS: ${filename} -> ${result.cid.toString()}`);

      return {
        success: true,
        hash: result.cid.toString(),
        size: result.size,
        url: `${this.gatewayUrl}${result.cid.toString()}`,
      };
    } catch (error) {
      this.logger.error("Failed to upload buffer to IPFS", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  async downloadFile(hash: string): Promise<Buffer> {
    try {
      const chunks: Uint8Array[] = [];
      for await (const chunk of this.ipfs.cat(hash)) {
        chunks.push(chunk);
      }

      const buffer = Buffer.concat(chunks);
      this.logger.log(`File downloaded from IPFS: ${hash}`);

      return buffer;
    } catch (error) {
      this.logger.error(`Failed to download file from IPFS: ${hash}`, error);
      throw error;
    }
  }

  async downloadJson(hash: string): Promise<Record<string, unknown>> {
    try {
      const buffer = await this.downloadFile(hash);
      const jsonString = buffer.toString("utf8");
      const data = JSON.parse(jsonString);

      this.logger.log(`JSON downloaded from IPFS: ${hash}`);
      return data;
    } catch (error) {
      this.logger.error(`Failed to download JSON from IPFS: ${hash}`, error);
      throw error;
    }
  }

  async getFileInfo(hash: string): Promise<Record<string, unknown>> {
    try {
      // Use files.stat instead of object.stat for better compatibility
      const info = await this.ipfs.files.stat(`/ipfs/${hash}`);
      return {
        hash,
        size: info.cumulativeSize,
        blockSize: info.blocks || 0,
        links: info.blocks || 0,
      };
    } catch (error) {
      this.logger.error(`Failed to get file info from IPFS: ${hash}`, error);
      throw error;
    }
  }

  async pinFile(hash: string): Promise<boolean> {
    try {
      await this.ipfs.pin.add(hash);
      this.logger.log(`File pinned: ${hash}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to pin file: ${hash}`, error);
      return false;
    }
  }

  async unpinFile(hash: string): Promise<boolean> {
    try {
      await this.ipfs.pin.rm(hash);
      this.logger.log(`File unpinned: ${hash}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to unpin file: ${hash}`, error);
      return false;
    }
  }

  async isPinned(hash: string): Promise<boolean> {
    try {
      const pins = await this.ipfs.pin.ls();
      for await (const pin of pins) {
        if (pin.cid.toString() === hash) {
          return true;
        }
      }
      return false;
    } catch (error) {
      this.logger.error(`Failed to check if file is pinned: ${hash}`, error);
      return false;
    }
  }

  async uploadCertificateDocument(
    certificateData: {
      certificateNumber: string;
      productName: string;
      supplier: string;
      issueDate: string;
      expiryDate: string;
      issuer: string;
      additionalInfo?: Record<string, unknown>;
    }
  ): Promise<IpfsUploadResult> {
    try {
      const document = {
        type: "halal_certificate",
        version: "1.0",
        data: certificateData,
        timestamp: new Date().toISOString(),
        blockchain: {
          network: this.configService.get<string>("BLOCKCHAIN_NETWORK", "polygon"),
          contract: "HalalCertification",
        },
      };

      return await this.uploadJson(document);
    } catch (error) {
      this.logger.error("Failed to upload certificate document", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  async uploadSupplyChainDocument(
    trackingData: {
      productId: string;
      location: string;
      temperature: number;
      humidity: number;
      timestamp: string;
      sensorData?: Record<string, unknown>;
      notes?: string;
    }
  ): Promise<IpfsUploadResult> {
    try {
      const document = {
        type: "supply_chain_tracking",
        version: "1.0",
        data: trackingData,
        timestamp: new Date().toISOString(),
        blockchain: {
          network: this.configService.get<string>("BLOCKCHAIN_NETWORK", "polygon"),
          contract: "SupplyChainTracker",
        },
      };

      return await this.uploadJson(document);
    } catch (error) {
      this.logger.error("Failed to upload supply chain document", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  async verifyFile(hash: string): Promise<boolean> {
    try {
      // Try to get the file info to verify it exists
      await this.getFileInfo(hash);
      return true;
    } catch (error) {
      this.logger.error(`File verification failed for hash: ${hash}`, error);
      return false;
    }
  }

  async getGatewayUrl(hash: string): Promise<string> {
    return `${this.gatewayUrl}${hash}`;
  }

  async getNodeInfo(): Promise<Record<string, unknown>> {
    try {
      const id = await this.ipfs.id();
      const version = await this.ipfs.version();

      return {
        id: id.id,
        publicKey: id.publicKey,
        addresses: id.addresses,
        agentVersion: version.version,
        commit: version.commit,
        repo: version.repo,
      };
    } catch (error) {
      this.logger.error("Failed to get IPFS node info", error);
      throw error;
    }
  }
}
