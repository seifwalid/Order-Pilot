import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, TrendingDown, Clock, DollarSign } from "lucide-react"

const alerts = [
  {
    type: "critical",
    icon: AlertTriangle,
    title: "Low Stock Alert",
    message: "15 items below minimum threshold",
    time: "2 min ago",
  },
  {
    type: "warning",
    icon: TrendingDown,
    title: "Declining Sales",
    message: "Dairy category down 8% this week",
    time: "1 hour ago",
  },
  {
    type: "info",
    icon: Clock,
    title: "Peak Hours",
    message: "High demand expected 6-8 PM",
    time: "3 hours ago",
  },
  {
    type: "success",
    icon: DollarSign,
    title: "Revenue Target",
    message: "Monthly target achieved 95%",
    time: "5 hours ago",
  },
]

export function AlertsPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Alerts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.map((alert, index) => {
            const Icon = alert.icon
            return (
              <div key={index} className="flex items-start space-x-3">
                <div
                  className={`p-2 rounded-full ${
                    alert.type === "critical"
                      ? "bg-destructive/10 text-destructive"
                      : alert.type === "warning"
                        ? "bg-accent text-accent-foreground"
                        : alert.type === "success"
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm">{alert.title}</p>
                    <Badge
                      variant={
                        alert.type === "critical"
                          ? "destructive"
                          : alert.type === "warning"
                            ? "secondary"
                            : alert.type === "success"
                              ? "default"
                              : "outline"
                      }
                    >
                      {alert.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{alert.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
