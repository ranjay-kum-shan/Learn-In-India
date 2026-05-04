import type { LucideIcon } from 'lucide-react'
import {
  Smartphone,
  Server,
  Database,
  HardDrive,
  Zap,
  ShieldCheck,
  Globe,
  Layers,
  GitBranch,
  Cog,
  StickyNote,
} from 'lucide-react'

export type ShapeType =
  | 'client'
  | 'gateway'
  | 'load_balancer'
  | 'service'
  | 'database'
  | 'cache'
  | 'queue'
  | 'storage'
  | 'cdn'
  | 'worker'
  | 'note'

export interface ShapeDefinition {
  type: ShapeType
  label: string
  icon: LucideIcon
  /** Tailwind color tokens; we use HSL inline so dark/light both work */
  accent: string
  defaultProps: Record<string, unknown>
  description: string
}

export const SHAPES: Record<ShapeType, ShapeDefinition> = {
  client: {
    type: 'client',
    label: 'Client',
    icon: Smartphone,
    accent: '210 100% 60%',
    description: 'Web, mobile, IoT or CLI client',
    defaultProps: { name: 'Client', kind: 'web' },
  },
  gateway: {
    type: 'gateway',
    label: 'Gateway',
    icon: ShieldCheck,
    accent: '170 80% 45%',
    description: 'API gateway / authn / TLS termination',
    defaultProps: { name: 'API Gateway', auth: 'JWT' },
  },
  load_balancer: {
    type: 'load_balancer',
    label: 'Load Balancer',
    icon: GitBranch,
    accent: '186 88% 50%',
    description: 'L4 / L7 traffic distribution',
    defaultProps: { name: 'LB', algorithm: 'round_robin' },
  },
  service: {
    type: 'service',
    label: 'Service',
    icon: Server,
    accent: '199 89% 55%',
    description: 'Stateless application service',
    defaultProps: { name: 'Service', instances: 1 },
  },
  database: {
    type: 'database',
    label: 'Database',
    icon: Database,
    accent: '26 90% 55%',
    description: 'SQL / NoSQL / KV / time-series',
    defaultProps: { name: 'Database', kind: 'sql', replicas: 1 },
  },
  cache: {
    type: 'cache',
    label: 'Cache',
    icon: Zap,
    accent: '0 80% 60%',
    description: 'Redis / Memcached / in-memory',
    defaultProps: { name: 'Redis', kind: 'redis', ttl_s: 3600 },
  },
  queue: {
    type: 'queue',
    label: 'Queue',
    icon: Layers,
    accent: '42 88% 55%',
    description: 'Kafka / SQS / RabbitMQ',
    defaultProps: { name: 'Queue', kind: 'kafka' },
  },
  storage: {
    type: 'storage',
    label: 'Object Storage',
    icon: HardDrive,
    accent: '252 60% 65%',
    description: 'S3 / GCS / blob / file storage',
    defaultProps: { name: 'S3', kind: 's3' },
  },
  cdn: {
    type: 'cdn',
    label: 'CDN',
    icon: Globe,
    accent: '300 60% 65%',
    description: 'Edge caching / static delivery',
    defaultProps: { name: 'CDN', kind: 'edge' },
  },
  worker: {
    type: 'worker',
    label: 'Worker',
    icon: Cog,
    accent: '90 60% 50%',
    description: 'Background / async worker',
    defaultProps: { name: 'Worker', instances: 1 },
  },
  note: {
    type: 'note',
    label: 'Note',
    icon: StickyNote,
    accent: '50 90% 70%',
    description: 'Capacity numbers / annotations',
    defaultProps: { text: 'note' },
  },
}

export const SHAPE_ORDER: ShapeType[] = [
  'client',
  'gateway',
  'load_balancer',
  'service',
  'cache',
  'database',
  'queue',
  'storage',
  'cdn',
  'worker',
  'note',
]
