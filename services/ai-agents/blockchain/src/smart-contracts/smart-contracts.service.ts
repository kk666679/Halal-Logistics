import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { BlockchainService } from "../blockchain/blockchain.service";

export interface HalalCertificate {
  id: string;
  productName: string;
  supplier: string;
  certificateNumber: string;
  issueDate: number;
  expiryDate: number;
  status: "valid" | "expired" | "revoked";
  ipfsHash: string;
  blockchainHash: string;
}

export interface ContractTemplate {
  name: string;
  description: string;
  abi: any[];
  bytecode: string;
}

@Injectable()
export class SmartContractsService {
  private readonly logger = new Logger(SmartContractsService.name);

  constructor(
    private configService: ConfigService,
    private blockchainService: BlockchainService,
  ) {}

  getHalalCertificationContractTemplate(): ContractTemplate {
    const abi = [
      {
        inputs: [
          {
            internalType: "string",
            name: "_certificateNumber",
            type: "string",
          },
          {
            internalType: "string",
            name: "_productName",
            type: "string",
          },
          {
            internalType: "string",
            name: "_supplier",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "_expiryDate",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "_ipfsHash",
            type: "string",
          },
        ],
        name: "issueCertificate",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "string",
            name: "_certificateNumber",
            type: "string",
          },
        ],
        name: "revokeCertificate",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "string",
            name: "_certificateNumber",
            type: "string",
          },
        ],
        name: "getCertificate",
        outputs: [
          {
            internalType: "string",
            name: "productName",
            type: "string",
          },
          {
            internalType: "string",
            name: "supplier",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "issueDate",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "expiryDate",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "ipfsHash",
            type: "string",
          },
          {
            internalType: "string",
            name: "status",
            type: "string",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "string",
            name: "_certificateNumber",
            type: "string",
          },
        ],
        name: "isCertificateValid",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
    ];

    const bytecode = `
      pragma solidity ^0.8.0;

      contract HalalCertification {
          struct Certificate {
              string productName;
              string supplier;
              uint256 issueDate;
              uint256 expiryDate;
              string ipfsHash;
              string status;
          }

          mapping(string => Certificate) public certificates;
          address public owner;

          event CertificateIssued(
              string certificateNumber,
              string productName,
              string supplier,
              uint256 expiryDate
          );

          event CertificateRevoked(string certificateNumber);

          modifier onlyOwner() {
              require(msg.sender == owner, "Only owner can call this function");
              _;
          }

          constructor() {
              owner = msg.sender;
          }

          function issueCertificate(
              string memory _certificateNumber,
              string memory _productName,
              string memory _supplier,
              uint256 _expiryDate,
              string memory _ipfsHash
          ) public onlyOwner {
              require(bytes(_certificateNumber).length > 0, "Certificate number is required");
              require(certificates[_certificateNumber].issueDate == 0, "Certificate already exists");

              certificates[_certificateNumber] = Certificate({
                  productName: _productName,
                  supplier: _supplier,
                  issueDate: block.timestamp,
                  expiryDate: _expiryDate,
                  ipfsHash: _ipfsHash,
                  status: "valid"
              });

              emit CertificateIssued(_certificateNumber, _productName, _supplier, _expiryDate);
          }

          function revokeCertificate(string memory _certificateNumber) public onlyOwner {
              require(certificates[_certificateNumber].issueDate != 0, "Certificate does not exist");
              require(
                  keccak256(bytes(certificates[_certificateNumber].status)) == keccak256(bytes("valid")),
                  "Certificate is not valid"
              );

              certificates[_certificateNumber].status = "revoked";
              emit CertificateRevoked(_certificateNumber);
          }

          function getCertificate(string memory _certificateNumber)
              public
              view
              returns (
                  string memory productName,
                  string memory supplier,
                  uint256 issueDate,
                  uint256 expiryDate,
                  string memory ipfsHash,
                  string memory status
              )
          {
              require(certificates[_certificateNumber].issueDate != 0, "Certificate does not exist");
              Certificate memory cert = certificates[_certificateNumber];
              return (
                  cert.productName,
                  cert.supplier,
                  cert.issueDate,
                  cert.expiryDate,
                  cert.ipfsHash,
                  cert.status
              );
          }

          function isCertificateValid(string memory _certificateNumber) public view returns (bool) {
              require(certificates[_certificateNumber].issueDate != 0, "Certificate does not exist");

              Certificate memory cert = certificates[_certificateNumber];
              return (
                  keccak256(bytes(cert.status)) == keccak256(bytes("valid")) &&
                  cert.expiryDate > block.timestamp
              );
          }
      }
    `;

    return {
      name: "HalalCertification",
      description: "Smart contract for managing Halal certificates on blockchain",
      abi,
      bytecode,
    };
  }

  getSupplyChainTrackerContractTemplate(): ContractTemplate {
    const abi = [
      {
        inputs: [
          {
            internalType: "string",
            name: "_productId",
            type: "string",
          },
          {
            internalType: "string",
            name: "_location",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "_temperature",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "_humidity",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "_ipfsHash",
            type: "string",
          },
        ],
        name: "addTrackingEvent",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "string",
            name: "_productId",
            type: "string",
          },
        ],
        name: "getTrackingHistory",
        outputs: [
          {
            internalType: "string[]",
            name: "locations",
            type: "string[]",
          },
          {
            internalType: "uint256[]",
            name: "timestamps",
            type: "uint256[]",
          },
          {
            internalType: "uint256[]",
            name: "temperatures",
            type: "uint256[]",
          },
          {
            internalType: "uint256[]",
            name: "humidities",
            type: "uint256[]",
          },
          {
            internalType: "string[]",
            name: "ipfsHashes",
            type: "string[]",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
    ];

    const bytecode = `
      pragma solidity ^0.8.0;

      contract SupplyChainTracker {
          struct TrackingEvent {
              string location;
              uint256 timestamp;
              uint256 temperature;
              uint256 humidity;
              string ipfsHash;
          }

          mapping(string => TrackingEvent[]) public trackingHistory;
          mapping(string => address) public productOwners;

          event TrackingEventAdded(
              string productId,
              string location,
              uint256 temperature,
              uint256 humidity
          );

          function addTrackingEvent(
              string memory _productId,
              string memory _location,
              uint256 _temperature,
              uint256 _humidity,
              string memory _ipfsHash
          ) public {
              trackingHistory[_productId].push(
                  TrackingEvent({
                      location: _location,
                      timestamp: block.timestamp,
                      temperature: _temperature,
                      humidity: _humidity,
                      ipfsHash: _ipfsHash
                  })
              );

              emit TrackingEventAdded(_productId, _location, _temperature, _humidity);
          }

          function getTrackingHistory(string memory _productId)
              public
              view
              returns (
                  string[] memory locations,
                  uint256[] memory timestamps,
                  uint256[] memory temperatures,
                  uint256[] memory humidities,
                  string[] memory ipfsHashes
              )
          {
              TrackingEvent[] memory events = trackingHistory[_productId];
              uint256 length = events.length;

              locations = new string[](length);
              timestamps = new uint256[](length);
              temperatures = new uint256[](length);
              humidities = new uint256[](length);
              ipfsHashes = new string[](length);

              for (uint256 i = 0; i < length; i++) {
                  locations[i] = events[i].location;
                  timestamps[i] = events[i].timestamp;
                  temperatures[i] = events[i].temperature;
                  humidities[i] = events[i].humidity;
                  ipfsHashes[i] = events[i].ipfsHash;
              }

              return (locations, timestamps, temperatures, humidities, ipfsHashes);
          }
      }
    `;

    return {
      name: "SupplyChainTracker",
      description: "Smart contract for tracking supply chain events on blockchain",
      abi,
      bytecode,
    };
  }

  async deployHalalCertificationContract(from: string): Promise<string> {
    try {
      const template = this.getHalalCertificationContractTemplate();
      const result = await this.blockchainService.deployContract(
        template.abi,
        template.bytecode,
        from
      );

      if (result.success) {
        this.logger.log(`HalalCertification contract deployed: ${result.txHash}`);
        return result.txHash;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      this.logger.error("Failed to deploy HalalCertification contract", error);
      throw error;
    }
  }

  async deploySupplyChainTrackerContract(from: string): Promise<string> {
    try {
      const template = this.getSupplyChainTrackerContractTemplate();
      const result = await this.blockchainService.deployContract(
        template.abi,
        template.bytecode,
        from
      );

      if (result.success) {
        this.logger.log(`SupplyChainTracker contract deployed: ${result.txHash}`);
        return result.txHash;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      this.logger.error("Failed to deploy SupplyChainTracker contract", error);
      throw error;
    }
  }

  async issueCertificate(
    contractAddress: string,
    certificateNumber: string,
    productName: string,
    supplier: string,
    expiryDate: number,
    ipfsHash: string,
    from: string,
    privateKey: string
  ): Promise<string> {
    try {
      const template = this.getHalalCertificationContractTemplate();
      const result = await this.blockchainService.sendTransaction(
        contractAddress,
        template.abi,
        "issueCertificate",
        from,
        privateKey,
        [certificateNumber, productName, supplier, expiryDate, ipfsHash]
      );

      if (result.success) {
        this.logger.log(`Certificate issued: ${result.txHash}`);
        return result.txHash;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      this.logger.error("Failed to issue certificate", error);
      throw error;
    }
  }

  async getCertificate(contractAddress: string, certificateNumber: string): Promise<any> {
    try {
      const template = this.getHalalCertificationContractTemplate();
      const result = await this.blockchainService.callContract(
        contractAddress,
        template.abi,
        "getCertificate",
        [certificateNumber]
      );

      return {
        productName: result[0],
        supplier: result[1],
        issueDate: result[2],
        expiryDate: result[3],
        ipfsHash: result[4],
        status: result[5],
      };
    } catch (error) {
      this.logger.error("Failed to get certificate", error);
      throw error;
    }
  }

  async isCertificateValid(contractAddress: string, certificateNumber: string): Promise<boolean> {
    try {
      const template = this.getHalalCertificationContractTemplate();
      const result = await this.blockchainService.callContract(
        contractAddress,
        template.abi,
        "isCertificateValid",
        [certificateNumber]
      );

      return result;
    } catch (error) {
      this.logger.error("Failed to check certificate validity", error);
      throw error;
    }
  }
}
