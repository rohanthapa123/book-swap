import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { TrendingUp, Calendar, BarChart3, PieChart } from "lucide-react"
import type { DashboardStats } from "@/lib/types"

interface AnalyticsSectionProps {
  stats?: DashboardStats
  isLoading: boolean
}

export default function AnalyticsSection({ stats, isLoading }: AnalyticsSectionProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-amber-900">Analytics & Reports</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-80 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-amber-900">Analytics & Reports</h2>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">+12.5%</div>
            <p className="text-xs text-muted-foreground">vs last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg. Books per User</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats ? Math.round((stats.totalBooks / stats.totalUsers) * 10) / 10 : 0}
            </div>
            <p className="text-xs text-muted-foreground">books per user</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <PieChart className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {stats ? Math.round((stats.completedSwaps / stats.totalSwaps) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">swap success rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
            <Calendar className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {stats ? Math.round(((stats.totalBooks - stats.pendingApprovals) / stats.totalBooks) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">books approved</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Book Activity</CardTitle>
            <CardDescription>Books added and swapped over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-80 items-center justify-center bg-amber-50 text-center">
              <div>
                <BarChart3 className="mx-auto mb-4 h-12 w-12 text-amber-300" />
                <p className="text-amber-700">Chart visualization would go here</p>
                <p className="text-sm text-amber-600">Integration with charting library needed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>New user registrations over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-80 items-center justify-center bg-amber-50 text-center">
              <div>
                <TrendingUp className="mx-auto mb-4 h-12 w-12 text-amber-300" />
                <p className="text-amber-700">User growth chart would go here</p>
                <p className="text-sm text-amber-600">Integration with charting library needed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Popular Genres</CardTitle>
            <CardDescription>Distribution of books by genre</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-80 items-center justify-center bg-amber-50 text-center">
              <div>
                <PieChart className="mx-auto mb-4 h-12 w-12 text-amber-300" />
                <p className="text-amber-700">Genre distribution chart would go here</p>
                <p className="text-sm text-amber-600">Integration with charting library needed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Swap Success Rate</CardTitle>
            <CardDescription>Percentage of successful swap requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-80 items-center justify-center bg-amber-50 text-center">
              <div>
                <Calendar className="mx-auto mb-4 h-12 w-12 text-amber-300" />
                <p className="text-amber-700">Success rate chart would go here</p>
                <p className="text-sm text-amber-600">Integration with charting library needed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Stats */}
      <Card>
        <CardHeader>
          <CardTitle>System Summary</CardTitle>
          <CardDescription>Overview of platform performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-900">{stats?.totalBooks || 0}</div>
              <p className="text-sm text-gray-600">Total Books</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-900">{stats?.totalUsers || 0}</div>
              <p className="text-sm text-gray-600">Total Users</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-900">{stats?.totalSwaps || 0}</div>
              <p className="text-sm text-gray-600">Total Swaps</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-900">{stats?.activeUsers || 0}</div>
              <p className="text-sm text-gray-600">Active Users</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
