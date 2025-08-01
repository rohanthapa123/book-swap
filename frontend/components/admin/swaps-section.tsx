"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, Eye, CheckCircle, XCircle } from "lucide-react"
import type { SwapRequest, SwapFilters } from "@/lib/types"

interface SwapsSectionProps {
    swaps: SwapRequest[]
    isLoading: boolean
    filters: SwapFilters
    onFiltersChange: (filters: SwapFilters) => void
}

export default function SwapsSection({ swaps, isLoading, filters, onFiltersChange }: SwapsSectionProps) {
    const [searchQuery, setSearchQuery] = useState("")

    const handleSearchChange = (value: string) => {
        setSearchQuery(value)
        // In a real implementation, you'd update the API call with search
    }

    const handleStatusChange = (value: string) => {
        onFiltersChange({
            ...filters,
            status: value === "all" ? undefined : (value as any),
        })
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending":
                return "bg-amber-100 text-amber-800"
            case "accepted":
                return "bg-blue-100 text-blue-800"
            case "completed":
                return "bg-green-100 text-green-800"
            case "rejected":
                return "bg-red-100 text-red-800"
            case "cancelled":
                return "bg-gray-100 text-gray-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-amber-900">Swap Requests</h2>
                <div className="flex items-center space-x-4">
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                        <Input
                            placeholder="Search swaps..."
                            className="pl-10"
                            value={searchQuery}
                            onChange={(e) => handleSearchChange(e.target.value)}
                        />
                    </div>
                    <Select value={filters.status || "all"} onValueChange={handleStatusChange}>
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="accepted">Accepted</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Swap Requests</CardTitle>
                    <CardDescription>Monitor and manage book swap requests</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <SwapsTableSkeleton />
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="border-b text-left">
                                        <th className="pb-2 pr-4 pt-2 font-medium">Book</th>
                                        <th className="pb-2 pr-4 pt-2 font-medium">Requester</th>
                                        <th className="pb-2 pr-4 pt-2 font-medium">Owner</th>
                                        <th className="pb-2 pr-4 pt-2 font-medium">Offered Book</th>
                                        <th className="pb-2 pr-4 pt-2 font-medium">Status</th>
                                        <th className="pb-2 pr-4 pt-2 font-medium">Created</th>
                                        <th className="pb-2 pr-4 pt-2 font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {swaps.map((swap) => (
                                        <tr key={swap.id} className="border-b">
                                            <td className="py-3 pr-4">
                                                <div className="flex items-center">
                                                    <div className="h-12 w-8 overflow-hidden bg-amber-100">
                                                        <img
                                                            src={swap.book.coverUrl || "/placeholder.svg?height=60&width=40"}
                                                            alt={swap.book.title}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="ml-3">
                                                        <p className="font-medium">{swap.book.title}</p>
                                                        <p className="text-sm text-gray-500">by {swap.book.author}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 pr-4">
                                                <div>
                                                    <p className="font-medium">{swap.requester.fullName}</p>
                                                    <p className="text-sm text-gray-500">{swap.requester.email}</p>
                                                </div>
                                            </td>
                                            <td className="py-3 pr-4">
                                                <div>
                                                    <p className="font-medium">{swap.owner.fullName}</p>
                                                    <p className="text-sm text-gray-500">{swap.owner.email}</p>
                                                </div>
                                            </td>
                                            <td className="py-3 pr-4">
                                                {swap.offeredBook ? (
                                                    <div className="flex items-center">
                                                        <div className="h-8 w-6 overflow-hidden bg-amber-100">
                                                            <img
                                                                src={swap.offeredBook.coverUrl || "/placeholder.svg?height=40&width=30"}
                                                                alt={swap.offeredBook.title}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        </div>
                                                        <div className="ml-2">
                                                            <p className="text-sm font-medium">{swap.offeredBook.title}</p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-gray-500">No book offered</span>
                                                )}
                                            </td>
                                            <td className="py-3 pr-4">
                                                <Badge className={getStatusColor(swap.status)}>{swap.status}</Badge>
                                            </td>
                                            <td className="py-3 pr-4">{new Date(swap.createdAt).toLocaleDateString()}</td>
                                            <td className="py-3 pr-4">
                                                <div className="flex space-x-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-8 border-amber-700 text-amber-700 hover:bg-amber-50 bg-transparent"
                                                    >
                                                        <Eye className="h-3 w-3" />
                                                    </Button>
                                                    {swap.status === "pending" && (
                                                        <>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="h-8 border-green-600 text-green-600 hover:bg-green-50 bg-transparent"
                                                            >
                                                                <CheckCircle className="h-3 w-3" />
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="h-8 border-red-600 text-red-600 hover:bg-red-50 bg-transparent"
                                                            >
                                                                <XCircle className="h-3 w-3" />
                                                            </Button>
                                                        </>
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

function SwapsTableSkeleton() {
    return (
        <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex items-center space-x-4">
                    <div className="flex items-center">
                        <Skeleton className="h-12 w-8" />
                        <div className="ml-3 space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-24" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-3 w-36" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-3 w-36" />
                    </div>
                    <div className="flex items-center">
                        <Skeleton className="h-8 w-6" />
                        <Skeleton className="ml-2 h-3 w-20" />
                    </div>
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-4 w-20" />
                    <div className="flex space-x-2">
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                    </div>
                </div>
            ))}
        </div>
    )
}
