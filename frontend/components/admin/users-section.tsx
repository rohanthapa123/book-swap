"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, Eye, UserCheck, UserX } from "lucide-react"
import type { User, UserFilters } from "@/lib/types"

interface UsersSectionProps {
  users: User[]
  isLoading: boolean
  filters: UserFilters
  onFiltersChange: (filters: UserFilters) => void
}

export default function UsersSection({ users, isLoading, filters, onFiltersChange }: UsersSectionProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    onFiltersChange({ ...filters, search: value || undefined })
  }

  const handleRoleChange = (value: string) => {
    onFiltersChange({
      ...filters,
      role: value === "all" ? undefined : (value as any),
    })
  }

  const handleStatusChange = (value: string) => {
    onFiltersChange({
      ...filters,
      isActive: value === "all" ? undefined : value === "active",
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-amber-900">User Management</h2>
        <div className="flex items-center space-x-4">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              placeholder="Search users..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
          <Select value={filters.role || "all"} onValueChange={handleRoleChange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={filters.isActive === undefined ? "all" : filters.isActive ? "active" : "inactive"}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>Manage user accounts and permissions</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <UsersTableSkeleton />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-2 pr-4 pt-2 font-medium">Avatar</th>
                    <th className="pb-2 pr-4 pt-2 font-medium">Name</th>
                    <th className="pb-2 pr-4 pt-2 font-medium">Email</th>
                    <th className="pb-2 pr-4 pt-2 font-medium">Role</th>
                    <th className="pb-2 pr-4 pt-2 font-medium">Books</th>
                    <th className="pb-2 pr-4 pt-2 font-medium">Swaps</th>
                    <th className="pb-2 pr-4 pt-2 font-medium">Joined</th>
                    <th className="pb-2 pr-4 pt-2 font-medium">Status</th>
                    <th className="pb-2 pr-4 pt-2 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b">
                      <td className="py-3 pr-4">
                        <div className="h-10 w-10 overflow-hidden rounded-full bg-amber-100">
                          <img
                            src={user.avatar || "/placeholder.svg?height=40&width=40"}
                            alt={user.fullName}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="py-3 pr-4">
                        <div>
                          <p className="font-medium">{user.fullName}</p>
                          <p className="text-sm text-gray-500">ID: {user.id.slice(0, 8)}...</p>
                        </div>
                      </td>
                      <td className="py-3 pr-4">{user.email}</td>
                      <td className="py-3 pr-4">
                        <Badge
                          className={
                            user.role === "admin" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"
                          }
                        >
                          {user.role}
                        </Badge>
                      </td>
                      <td className="py-3 pr-4">{user.booksCount}</td>
                      <td className="py-3 pr-4">{user.swapsCount}</td>
                      <td className="py-3 pr-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 pr-4">
                        <Badge className={user.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                          {user.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="py-3 pr-4">
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 border-amber-700 text-amber-700 hover:bg-amber-50 bg-transparent"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          {user.isActive ? (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 border-red-600 text-red-600 hover:bg-red-50 bg-transparent"
                            >
                              <UserX className="h-3 w-3" />
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 border-green-600 text-green-600 hover:bg-green-50 bg-transparent"
                            >
                              <UserCheck className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function UsersTableSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="flex items-center space-x-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-5 w-16 rounded-full" />
          <div className="flex space-x-2">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      ))}
    </div>
  )
}
