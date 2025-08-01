import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import type { ReactNode } from "react"

interface StatsCardProps {
    title: string
    value?: number
    change: string
    icon: ReactNode
    isLoading: boolean
    urgent?: boolean
}

export default function StatsCard({ title, value, change, icon, isLoading, urgent = false }: StatsCardProps) {
    if (isLoading) {
        return (
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="mb-1 h-8 w-16" />
                    <Skeleton className="h-3 w-32" />
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className={urgent && value && value > 0 ? "border-red-200 bg-red-50" : ""}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="flex items-center space-x-2">
                    <div className="text-2xl font-bold">{value ?? 0}</div>
                    {urgent && value && value > 0 && (
                        <Badge variant="destructive" className="text-xs">
                            Urgent
                        </Badge>
                    )}
                </div>
                <p className="text-xs text-muted-foreground">{change}</p>
            </CardContent>
        </Card>
    )
}
