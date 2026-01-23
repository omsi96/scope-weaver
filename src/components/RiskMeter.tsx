import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RiskItem {
  feature: string;
  level: 'medium' | 'high';
}

interface RiskMeterProps {
  riskItems: RiskItem[];
}

const FEATURE_LABELS: Record<string, string> = {
  realtime: 'Real-time Features',
  live_location: 'Live Location Tracking',
  video_streaming: 'Video Streaming',
  live_streaming: 'Live Streaming',
  multi_tenant: 'Multi-tenant Architecture',
  encryption: 'End-to-end Encryption',
  ai_enabled: 'AI Features',
  ai_knowledge_base: 'RAG/Knowledge Base',
  offline_mode: 'Offline Mode',
  payments_enabled: 'Payment Processing',
  compliance_requirements: 'Compliance Requirements',
  org_structure: 'Complex Org Structure',
  feed_type: 'Algorithmic Feed',
  video_type: 'Video Handling',
  realtime_other: 'Real-time Collaboration',
  chat_type: 'Chat System',
  booking_features: 'Booking System',
  geofencing: 'Geofencing',
  admin_features: 'Advanced Admin',
  device_integrations: 'Hardware Integration'
};

export function RiskMeter({ riskItems }: RiskMeterProps) {
  if (riskItems.length === 0) return null;

  const highRiskCount = riskItems.filter(r => r.level === 'high').length;
  const mediumRiskCount = riskItems.filter(r => r.level === 'medium').length;

  return (
    <div className="card-section">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-5 h-5 text-warning" />
        <h3 className="font-semibold text-foreground">Scope Complexity</h3>
      </div>
      
      <div className="flex gap-4 mb-4 text-sm">
        {highRiskCount > 0 && (
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-destructive" />
            <span>{highRiskCount} High</span>
          </div>
        )}
        {mediumRiskCount > 0 && (
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-warning" />
            <span>{mediumRiskCount} Medium</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        {riskItems.slice(0, 6).map((item) => (
          <div 
            key={item.feature}
            className={cn(
              "flex items-center justify-between py-1.5 px-2 rounded text-sm",
              item.level === 'high' ? "bg-destructive/10" : "bg-warning/10"
            )}
          >
            <span className="text-foreground">
              {FEATURE_LABELS[item.feature] || item.feature}
            </span>
            <span className={cn(
              "text-xs font-medium px-2 py-0.5 rounded",
              item.level === 'high' 
                ? "bg-destructive/20 text-destructive" 
                : "bg-warning/20 text-warning"
            )}>
              {item.level}
            </span>
          </div>
        ))}
        {riskItems.length > 6 && (
          <p className="text-xs text-muted-foreground text-center pt-1">
            +{riskItems.length - 6} more high-complexity features
          </p>
        )}
      </div>
      
      <p className="text-xs text-muted-foreground mt-4">
        These features add significant development time and complexity. Consider phasing them.
      </p>
    </div>
  );
}
