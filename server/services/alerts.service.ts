/**
 * Alerts Service
 * 
 * Manages real-time alerts for API failures, performance issues, and system events
 * Supports multiple notification channels: in-app, email, push notifications
 */

export interface Alert {
  id: string;
  type: 'error' | 'warning' | 'info';
  title: string;
  message: string;
  apiName: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  timestamp: Date;
  resolved: boolean;
  resolvedAt?: Date;
}

export interface AlertRule {
  id: string;
  name: string;
  condition: 'latency' | 'error_rate' | 'downtime' | 'cache_miss';
  threshold: number;
  enabled: boolean;
  notificationChannels: ('in-app' | 'email' | 'push')[];
}

export interface AlertHistory {
  alertId: string;
  apiName: string;
  type: 'error' | 'warning' | 'info';
  duration: number; // in milliseconds
  resolvedBy?: string;
  notes?: string;
}

class AlertsService {
  private alerts: Map<string, Alert> = new Map();
  private alertRules: Map<string, AlertRule> = new Map();
  private alertHistory: AlertHistory[] = [];
  private subscribers: Set<(alert: Alert) => void> = new Set();

  constructor() {
    this.initializeDefaultRules();
  }

  /**
   * Initialize default alert rules
   */
  private initializeDefaultRules(): void {
    const defaultRules: AlertRule[] = [
      {
        id: 'latency-high',
        name: 'High Latency',
        condition: 'latency',
        threshold: 500, // ms
        enabled: true,
        notificationChannels: ['in-app', 'email'],
      },
      {
        id: 'error-rate-high',
        name: 'High Error Rate',
        condition: 'error_rate',
        threshold: 5, // percentage
        enabled: true,
        notificationChannels: ['in-app', 'email', 'push'],
      },
      {
        id: 'api-downtime',
        name: 'API Downtime',
        condition: 'downtime',
        threshold: 60000, // 1 minute
        enabled: true,
        notificationChannels: ['in-app', 'email', 'push'],
      },
      {
        id: 'cache-miss-high',
        name: 'High Cache Miss Rate',
        condition: 'cache_miss',
        threshold: 30, // percentage
        enabled: true,
        notificationChannels: ['in-app'],
      },
    ];

    defaultRules.forEach((rule) => {
      this.alertRules.set(rule.id, rule);
    });
  }

  /**
   * Create a new alert
   */
  createAlert(
    apiName: string,
    type: 'error' | 'warning' | 'info',
    title: string,
    message: string,
    severity: 'critical' | 'high' | 'medium' | 'low' = 'medium'
  ): Alert {
    const alert: Alert = {
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      title,
      message,
      apiName,
      severity,
      timestamp: new Date(),
      resolved: false,
    };

    this.alerts.set(alert.id, alert);
    this.notifySubscribers(alert);

    console.log(`[Alert] ${severity.toUpperCase()}: ${title}`, {
      apiName,
      message,
      timestamp: alert.timestamp,
    });

    return alert;
  }

  /**
   * Resolve an alert
   */
  resolveAlert(alertId: string, notes?: string): Alert | null {
    const alert = this.alerts.get(alertId);

    if (!alert) {
      return null;
    }

    alert.resolved = true;
    alert.resolvedAt = new Date();

    // Add to history
    const duration = alert.resolvedAt.getTime() - alert.timestamp.getTime();
    this.alertHistory.push({
      alertId: alert.id,
      apiName: alert.apiName,
      type: alert.type,
      duration,
      notes,
    });

    console.log(`[Alert] Resolved: ${alert.title}`, {
      apiName: alert.apiName,
      duration: `${duration}ms`,
    });

    return alert;
  }

  /**
   * Get active alerts
   */
  getActiveAlerts(): Alert[] {
    return Array.from(this.alerts.values()).filter((alert) => !alert.resolved);
  }

  /**
   * Get all alerts
   */
  getAllAlerts(): Alert[] {
    return Array.from(this.alerts.values());
  }

  /**
   * Get alerts by API
   */
  getAlertsByApi(apiName: string): Alert[] {
    return Array.from(this.alerts.values()).filter((alert) => alert.apiName === apiName);
  }

  /**
   * Get alerts by severity
   */
  getAlertsBySeverity(severity: 'critical' | 'high' | 'medium' | 'low'): Alert[] {
    return Array.from(this.alerts.values()).filter((alert) => alert.severity === severity);
  }

  /**
   * Get alert history
   */
  getAlertHistory(apiName?: string, limit: number = 100): AlertHistory[] {
    let history = this.alertHistory;

    if (apiName) {
      history = history.filter((h) => h.apiName === apiName);
    }

    return history.slice(-limit);
  }

  /**
   * Get alert statistics
   */
  getAlertStats(): {
    total: number;
    active: number;
    byType: Record<string, number>;
    bySeverity: Record<string, number>;
    avgResolutionTime: number;
  } {
    const allAlerts = Array.from(this.alerts.values());
    const activeAlerts = allAlerts.filter((a) => !a.resolved);

    const byType: Record<string, number> = { error: 0, warning: 0, info: 0 };
    const bySeverity: Record<string, number> = { critical: 0, high: 0, medium: 0, low: 0 };

    allAlerts.forEach((alert) => {
      byType[alert.type]++;
      bySeverity[alert.severity]++;
    });

    const avgResolutionTime =
      this.alertHistory.length > 0
        ? this.alertHistory.reduce((sum, h) => sum + h.duration, 0) / this.alertHistory.length
        : 0;

    return {
      total: allAlerts.length,
      active: activeAlerts.length,
      byType,
      bySeverity,
      avgResolutionTime,
    };
  }

  /**
   * Check if alert rule is triggered
   */
  checkAlertRule(
    apiName: string,
    condition: 'latency' | 'error_rate' | 'downtime' | 'cache_miss',
    value: number
  ): AlertRule | null {
    for (const rule of this.alertRules.values()) {
      if (rule.enabled && rule.condition === condition && value > rule.threshold) {
        return rule;
      }
    }

    return null;
  }

  /**
   * Subscribe to alert events
   */
  subscribe(callback: (alert: Alert) => void): () => void {
    this.subscribers.add(callback);

    // Return unsubscribe function
    return () => {
      this.subscribers.delete(callback);
    };
  }

  /**
   * Notify all subscribers
   */
  private notifySubscribers(alert: Alert): void {
    this.subscribers.forEach((callback) => {
      try {
        callback(alert);
      } catch (error) {
        console.error('[Alert] Subscriber error:', error);
      }
    });
  }

  /**
   * Clear resolved alerts older than specified time
   */
  clearOldAlerts(olderThanMs: number = 24 * 60 * 60 * 1000): number {
    const now = Date.now();
    let cleared = 0;

    for (const [id, alert] of this.alerts) {
      if (alert.resolved && alert.resolvedAt && now - alert.resolvedAt.getTime() > olderThanMs) {
        this.alerts.delete(id);
        cleared++;
      }
    }

    return cleared;
  }

  /**
   * Export alerts as JSON
   */
  exportAlerts(): {
    alerts: Alert[];
    history: AlertHistory[];
    stats: ReturnType<AlertsService['getAlertStats']>;
  } {
    return {
      alerts: this.getAllAlerts(),
      history: this.getAlertHistory(),
      stats: this.getAlertStats(),
    };
  }
}

// Export singleton instance
let alertsService: AlertsService | null = null;

export function initAlertsService(): AlertsService {
  if (!alertsService) {
    alertsService = new AlertsService();
  }
  return alertsService;
}

export function getAlertsService(): AlertsService {
  if (!alertsService) {
    alertsService = new AlertsService();
  }
  return alertsService;
}

export default AlertsService;
