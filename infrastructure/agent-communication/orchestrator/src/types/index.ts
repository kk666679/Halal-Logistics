export interface AgentInfo {
  id: string;
  name: string;
  type: string;
  version: string;
  capabilities: string[];
  endpoints: {
    health: string;
    api: string;
    metrics?: string;
  };
  priority: number;
  maxConcurrency: number;
  status: AgentStatus;
  lastHealthCheck: Date;
  metadata?: Record<string, any>;
}

export interface AgentStatus {
  state: 'online' | 'offline' | 'busy' | 'error';
  load: number; // 0-100
  activeRequests: number;
  totalRequests: number;
  errorCount: number;
  lastError?: string;
  uptime: number;
}

export interface AgentRequest {
  id: string;
  agentId: string;
  type: string;
  priority: number;
  payload: any;
  metadata?: Record<string, any>;
  timestamp: Date;
  timeout: number;
  retryCount: number;
  maxRetries: number;
}

export interface AgentResponse {
  requestId: string;
  agentId: string;
  success: boolean;
  data?: any;
  error?: string;
  processingTime: number;
  timestamp: Date;
}

export interface Message {
  id: string;
  topic: string;
  type: 'request' | 'response' | 'event' | 'heartbeat';
  source: string;
  destination?: string;
  payload: any;
  priority: number;
  timestamp: Date;
  ttl?: number;
  headers?: Record<string, string>;
}

export interface HealthCheck {
  agentId: string;
  status: 'healthy' | 'unhealthy' | 'degraded';
  responseTime: number;
  lastCheck: Date;
  consecutiveFailures: number;
  details?: Record<string, any>;
}

export interface Metrics {
  timestamp: Date;
  agentId: string;
  requestCount: number;
  errorCount: number;
  averageResponseTime: number;
  currentLoad: number;
  memoryUsage?: number;
  cpuUsage?: number;
}

export interface LoadBalancerConfig {
  algorithm: 'round-robin' | 'least-connections' | 'weighted' | 'random';
  healthCheckInterval: number;
  failoverThreshold: number;
  maxRetries: number;
  timeout: number;
}

export interface OrchestratorConfig {
  port: number;
  kafka: {
    brokers: string[];
    clientId: string;
    groupId: string;
  };
  redis: {
    host: string;
    port: number;
    password?: string;
    db: number;
  };
  rabbitmq: {
    host: string;
    port: number;
    username: string;
    password: string;
    vhost: string;
  };
  loadBalancer: LoadBalancerConfig;
  agentTimeout: number;
  maxRetries: number;
  logLevel: string;
}

export interface ServiceStatus {
  name: string;
  status: 'running' | 'stopped' | 'error';
  uptime: number;
  version: string;
  dependencies: string[];
  lastHealthCheck: Date;
}

export interface SystemMetrics {
  totalAgents: number;
  activeAgents: number;
  totalRequests: number;
  pendingRequests: number;
  averageResponseTime: number;
  errorRate: number;
  throughput: number;
  memoryUsage: number;
  cpuUsage: number;
}

export interface EventData {
  type: string;
  source: string;
  data: any;
  timestamp: Date;
  correlationId?: string;
}

export interface AgentRegistrationRequest {
  agentInfo: Omit<AgentInfo, 'status' | 'lastHealthCheck'>;
  registrationToken?: string;
}

export interface AgentRegistrationResponse {
  success: boolean;
  agentId?: string;
  error?: string;
  token?: string;
}

export interface RequestRoutingResult {
  agentId: string;
  endpoint: string;
  estimatedWaitTime: number;
  priority: number;
}

export interface FailoverEvent {
  failedAgentId: string;
  backupAgentId: string;
  reason: string;
  timestamp: Date;
  affectedRequests: string[];
}
