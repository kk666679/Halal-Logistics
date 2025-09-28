# Global Logistics Freight System (GLFS) Service Blueprint

This is an upgraded Mermaid flowchart representing the three-tier architecture (Core Business Services → Microservices → Infrastructure), enhanced with:

- **Swimlanes**: Stacked subgraphs separating Customer Journey Touchpoints (top), Core (Customer-Facing), Microservices (Backstage/Operations), and Infrastructure (Tech Stack).
- **Directional Flow**: Top-down (TD) to show customer interactions triggering Core services, which rely on Microservices, depending on Infrastructure.
- **Icons/Emojis**: Added for quick scanning (e.g., 👤 for Shipper, 🚛 for Freight).
- **4th Layer**: Customer Journey Touchpoints (yellow) showing flow: Shipper → Carrier → Customs → Warehouse → Delivery → Billing, connecting to Core.
- **Styling**: Distinct colors (Touchpoints: yellow, Core: blue, Microservices: green, Infrastructure: gray) via classDef.
- **Connections**: Logically consistent, extending base (Touchpoints → Core → Micro → Infra).

```mermaid
flowchart TD
    %% Layer 1: Customer Journey Touchpoints (Yellow)
    subgraph Touch["👥 Customer Journey Touchpoints"]
        SHIPPER["👤 Shipper"]
        CARRIER["🚛 Carrier"]
        CUSTOMS["🛃 Customs"]
        WAREHOUSE["🏭 Warehouse"]
        DELIVERY["🚚 Delivery"]
        BILLING["💰 Billing"]
    end

    %% Layer 2: Core Business Services (Blue)
    subgraph Core["🌍 Core Business Services"]
        FF["🚛 Freight Forwarding"]
        TRK["📡 Shipment Tracking & Visibility"]
        CUST["🛃 Customs & Compliance"]
        WH["🏭 Warehousing & Inventory"]
        LM["🚚 Last-Mile Delivery"]
        BILL["💰 Billing & Payments"]
        PORTAL["🧑‍🤝‍🧑 Customer & Partner Portal"]
    end

    %% Layer 3: Microservices (Green)
    subgraph Micro["🛠️ Microservices Layer"]
        ID["🔐 Identity & Access"]
        BOOK["📋 Freight Booking"]
        SHIPM["📦 Shipment Management"]
        TELE["📡 Tracking & Telemetry"]
        DOCS["📄 Customs Documentation"]
        WMS["🏭 Warehouse MS"]
        DMS["🚚 Delivery MS"]
        INV["💰 Billing & Invoicing MS"]
        NOTI["🔔 Notification MS"]
        ANALYTICS["📊 Analytics & Reporting"]
        INTEG["🔗 Integration MS"]
    end

    %% Layer 4: Infrastructure (Gray)
    subgraph Infra["🔐 Infrastructure & Integrations"]
        FRONT["🌐 Frontend: React/Angular"]
        BACK["⚙️ Backend: Node.js / Java"]
        MSG["📨 Messaging: Kafka/RabbitMQ"]
        DB["🗄️ Databases: PostgreSQL, MongoDB, ElasticSearch"]
        BC["🔗 Blockchain: Hyperledger/Ethereum"]
        CLOUD["☁️ Cloud: AWS/Azure/GCP (K8s)"]
        AI["🤖 AI/ML: TensorFlow, PyTorch"]
        IOT["📶 IoT: MQTT Brokers"]
    end

    %% Touchpoints Flow (Horizontal Chain)
    SHIPPER --> CARRIER
    CARRIER --> CUSTOMS
    CUSTOMS --> WAREHOUSE
    WAREHOUSE --> DELIVERY
    DELIVERY --> BILLING

    %% Connections: Touchpoints → Core
    SHIPPER --> FF
    SHIPPER --> PORTAL
    CARRIER --> FF
    CUSTOMS --> CUST
    CUSTOMS --> PORTAL
    WAREHOUSE --> WH
    DELIVERY --> LM
    DELIVERY --> TRK
    BILLING --> BILL
    BILLING --> PORTAL

    %% Connections: Core → Micro (Extended from Base)
    FF --> BOOK
    FF --> SHIPM
    TRK --> TELE
    TRK --> ANALYTICS
    CUST --> DOCS
    CUST --> ID
    WH --> WMS
    LM --> DMS
    BILL --> INV
    PORTAL --> ID
    PORTAL --> NOTI
    PORTAL --> INTEG

    %% Connections: Micro → Infra (From Base)
    ID --> BACK
    BOOK --> BC
    SHIPM --> DB
    TELE --> IOT
    DOCS --> BC
    WMS --> DB
    DMS --> MSG
    INV --> DB
    NOTI --> MSG
    ANALYTICS --> AI
    INTEG --> BACK

    %% Infra Foundation Links (To Cloud)
    BACK --> CLOUD
    DB --> CLOUD
    MSG --> CLOUD
    BC --> CLOUD
    AI --> CLOUD
    IOT --> CLOUD
    FRONT --> CLOUD

    %% Styling Classes
    classDef touch fill:#ffff00,stroke:#333,stroke-width:2px,color:#000
    classDef core fill:#add8e6,stroke:#333,stroke-width:2px,color:#000
    classDef micro fill:#90ee90,stroke:#333,stroke-width:2px,color:#000
    classDef infra fill:#d3d3d3,stroke:#333,stroke-width:2px,color:#000

    %% Apply Classes to Nodes
    class SHIPPER,CARRIER,CUSTOMS,WAREHOUSE,DELIVERY,BILLING touch
    class FF,TRK,CUST,WH,LM,BILL,PORTAL core
    class ID,BOOK,SHIPM,TELE,DOCS,WMS,DMS,INV,NOTI,ANALYTICS,INTEG micro
    class FRONT,BACK,MSG,DB,BC,CLOUD,AI,IOT infra
