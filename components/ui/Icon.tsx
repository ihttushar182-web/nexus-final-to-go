import {
  Bot,
  Code2,
  Fingerprint,
  LayoutDashboard,
  ListChecks,
  MonitorSmartphone,
  Network,
  Search,
  Server,
  Users,
  Workflow,
  Layers,
  type LucideIcon,
} from "lucide-react";

/**
 * Icon registry — solution and layer icons are referenced from /data by name so
 * content stays data-driven and the bundle only pulls what is used.
 */
const registry: Record<string, LucideIcon> = {
  fingerprint: Fingerprint,
  network: Network,
  "list-checks": ListChecks,
  "monitor-smartphone": MonitorSmartphone,
  users: Users,
  search: Search,
  "layout-dashboard": LayoutDashboard,
  bot: Bot,
  workflow: Workflow,
  server: Server,
  code: Code2,
  layers: Layers,
};

export function Icon({ name, className }: { name: string; className?: string }) {
  const Component = registry[name] ?? Layers;
  return <Component className={className} aria-hidden />;
}
