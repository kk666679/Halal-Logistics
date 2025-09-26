# Blockchain Agent

The Blockchain Agent is a comprehensive service for managing blockchain operations, smart contracts, IPFS storage, and oracle services in the Halal Logistics Multi AI Agent System.

## Features

### 🔗 Blockchain Operations
- Multi-network support (Ethereum, Polygon, BSC)
- Transaction management and monitoring
- Address validation and balance checking
- Block information retrieval

### 📋 Smart Contracts
- **HalalCertification Contract**: Manages Halal certificates on blockchain
- **SupplyChainTracker Contract**: Tracks supply chain events and conditions
- Contract deployment and interaction
- Certificate issuance and validation

### 📁 IPFS Integration
- File and document storage
- JSON data management
- Certificate and supply chain document handling
- File pinning and verification

### 🔮 Oracle Services
- Price data feeds
- Weather information
- Government data integration
- External API connectivity

## API Endpoints

### Blockchain Endpoints (`/api/v1/blockchain`)
- `GET /network-info` - Get blockchain network information
- `GET /balance/:address` - Get account balance
- `GET /validate-address/:address` - Validate blockchain address
- `GET /block-number` - Get current block number
- `GET /block` - Get block information
- `POST /deploy-contract` - Deploy smart contract
- `POST /call-contract` - Call contract method
- `POST /send-transaction` - Send blockchain transaction
- `GET /transaction/:txHash` - Get transaction receipt

### Smart Contracts Endpoints (`/api/v1/smart-contracts`)
- `GET /halal-certification-template` - Get Halal certification contract template
- `GET /supply-chain-tracker-template` - Get supply chain tracker contract template
- `POST /deploy-halal-certification` - Deploy Halal certification contract
- `POST /deploy-supply-chain-tracker` - Deploy supply chain tracker contract
- `POST /issue-certificate` - Issue Halal certificate
- `GET /certificate/:contractAddress/:certificateNumber` - Get certificate details
- `GET /certificate-validity/:contractAddress/:certificateNumber` - Check certificate validity

### IPFS Endpoints (`/api/v1/ipfs`)
- `POST /upload-json` - Upload JSON data
- `POST /upload-certificate` - Upload certificate document
- `POST /upload-supply-chain` - Upload supply chain document
- `POST /upload-file` - Upload file
- `GET /download/:hash` - Download file by hash
- `GET /download-json/:hash` - Download JSON by hash
- `GET /info/:hash` - Get file information
- `POST /pin/:hash` - Pin file
- `POST /unpin/:hash` - Unpin file
- `GET /pinned/:hash` - Check if file is pinned
- `GET /verify/:hash` - Verify file exists
- `GET /gateway-url/:hash` - Get gateway URL
- `GET /node-info` - Get IPFS node information

### Oracle Endpoints (`/api/v1/oracles`)
- `GET /price?symbol=BTC` - Get price data
- `GET /weather?location=London` - Get weather data
- `GET /government?agency=JAKIM` - Get government data

## Installation

1. Navigate to the blockchain service directory:
```bash
cd services/ai-agents/blockchain
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Build the application:
```bash
npm run build
```

## Usage

### Development Mode
```bash
npm run start:dev
```

### Production Mode
```bash
npm run start:prod
```

### Testing
```bash
npm run test
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `BLOCKCHAIN_RPC_URL` | Blockchain RPC endpoint | `https://polygon-rpc.com` |
| `BLOCKCHAIN_NETWORK` | Network name | `polygon` |
| `CHAIN_ID` | Chain ID | `137` |
| `IPFS_URL` | IPFS node URL | `https://ipfs.infura.io:5001` |
| `IPFS_GATEWAY` | IPFS gateway URL | `https://gateway.pinata.cloud/ipfs/` |
| `PORT` | Server port | `3026` |
| `FRONTEND_URL` | Frontend application URL | `http://localhost:3000` |

## Smart Contract Templates

### HalalCertification Contract
- Issues and manages Halal certificates
- Tracks certificate validity and expiry
- Supports certificate revocation
- Stores certificate metadata on IPFS

### SupplyChainTracker Contract
- Records supply chain events
- Tracks temperature and humidity conditions
- Stores location and timestamp data
- Links to IPFS for detailed documentation

## Integration Examples

### Deploying a Contract
```bash
curl -X POST http://localhost:3026/api/v1/smart-contracts/deploy-halal-certification \
  -H "Content-Type: application/json" \
  -d '{"from": "0xYourAddress"}'
```

### Issuing a Certificate
```bash
curl -X POST http://localhost:3026/api/v1/smart-contracts/issue-certificate \
  -H "Content-Type: application/json" \
  -d '{
    "contractAddress": "0xContractAddress",
    "certificateNumber": "HALAL-2024-001",
    "productName": "Premium Halal Chicken",
    "supplier": "Halal Foods Ltd",
    "expiryDate": 1735689600,
    "ipfsHash": "QmYourIPFSHash",
    "from": "0xYourAddress",
    "privateKey": "0xYourPrivateKey"
  }'
```

### Uploading to IPFS
```bash
curl -X POST http://localhost:3026/api/v1/ipfs/upload-certificate \
  -H "Content-Type: application/json" \
  -d '{
    "certificateNumber": "HALAL-2024-001",
    "productName": "Premium Halal Chicken",
    "supplier": "Halal Foods Ltd",
    "issueDate": "2024-01-01",
    "expiryDate": "2025-01-01",
    "issuer": "JAKIM Certified"
  }'
```

## Security Considerations

- Store private keys securely (use environment variables or key management systems)
- Validate all inputs before blockchain interactions
- Implement rate limiting for API endpoints
- Use HTTPS in production
- Monitor gas usage and transaction costs

## Monitoring and Logging

The service includes comprehensive logging for:
- Blockchain transactions
- Smart contract interactions
- IPFS operations
- Oracle data requests
- API access and errors

## Contributing

1. Follow the existing code structure
2. Add tests for new features
3. Update documentation
4. Ensure all linting checks pass

## License

This project is part of the Halal Logistics Multi AI Agent System.
