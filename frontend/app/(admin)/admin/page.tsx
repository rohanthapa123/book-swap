"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  useAdminStats,
  useApproveBook,
  useBooks,
  usePendingBooks,
  useRejectBook,
  useSwaps,
  useUsers,
} from "@/lib/queries"
import type { BookFilters, SwapFilters, UserFilters } from "@/lib/types"
import { AlertTriangle, ArrowLeft, BookOpen, RefreshCw, Search, ThumbsUp, Users } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

import { logout } from "@/api/auth"
import AllBooksSection from "@/components/admin/all-book-section"
import AnalyticsSection from "@/components/admin/analytics"
import PendingBooksSection from "@/components/admin/pending-book-section"
import StatsCard from "@/components/admin/stats-cards"
import SwapsSection from "@/components/admin/swaps-section"
import UsersSection from "@/components/admin/users-section"
import { useRouter } from "next/navigation"

export default function AdminPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [bookFilters, setBookFilters] = useState<BookFilters>({})
  const [userFilters, setUserFilters] = useState<UserFilters>({})
  const [swapFilters, setSwapFilters] = useState<SwapFilters>({})
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [selectedBookId, setSelectedBookId] = useState<string>("")
  const [rejectReason, setRejectReason] = useState("")
  const router = useRouter()

  // Queries
  const { data: stats, isLoading: statsLoading } = useAdminStats()
  const { data: pendingBooksData, isLoading: pendingLoading } = usePendingBooks()
  const { data: allBooksData, isLoading: booksLoading } = useBooks(bookFilters)
  const { data: usersData, isLoading: usersLoading } = useUsers(userFilters)
  const { data: swapsData, isLoading: swapsLoading } = useSwaps(swapFilters)

  // Mutations
  const approveBookMutation = useApproveBook({
    onSuccess: () => {
      console.log("Book approved successfully")
    },
    onError: (error) => {
      console.error("Failed to approve book:", error)
    },
  })

  const rejectBookMutation = useRejectBook({
    onSuccess: () => {
      setRejectDialogOpen(false)
      setRejectReason("")
      setSelectedBookId("")
      console.log("Book rejected successfully")
    },
    onError: (error) => {
      console.error("Failed to reject book:", error)
    },
  })

  const handleApproveBook = (bookId: string) => {
    approveBookMutation.mutate(bookId)
  }

  const handleRejectBook = () => {
    if (selectedBookId) {
      rejectBookMutation.mutate({ id: selectedBookId, reason: rejectReason })
    }
  }

  const openRejectDialog = (bookId: string) => {
    setSelectedBookId(bookId)
    setRejectDialogOpen(true)
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-amber-900">Admin Dashboard</h1>
            <p className="text-amber-800">Manage books, users, and swap requests</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              asChild
              variant="outline"
              className="border-amber-700 text-amber-700 hover:bg-amber-50 bg-transparent"
            >
              <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to User Dashboard
              </Link>
            </Button>
            <Button
              variant="outline"
              className="border-red-600 text-red-600 hover:bg-red-50 bg-transparent"
              onClick={async () => {
                await logout();
                window.location.href = "/admin"
              }}
            >
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Books"
            value={stats?.totalBooks}
            change={`+${stats?.booksAddedThisMonth || 0} this month`}
            icon={<BookOpen className="h-4 w-4 text-amber-700" />}
            isLoading={statsLoading}
          />
          <StatsCard
            title="Active Users"
            value={stats?.activeUsers}
            change={`+${stats?.usersJoinedThisMonth || 0} this month`}
            icon={<Users className="h-4 w-4 text-amber-700" />}
            isLoading={statsLoading}
          />
          <StatsCard
            title="Completed Swaps"
            value={stats?.completedSwaps}
            change="This month"
            icon={<RefreshCw className="h-4 w-4 text-amber-700" />}
            isLoading={statsLoading}
          />
          <StatsCard
            title="Pending Approvals"
            value={stats?.pendingApprovals}
            change="Needs attention"
            icon={<ThumbsUp className="h-4 w-4 text-amber-700" />}
            isLoading={statsLoading}
            urgent={true}
          />
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="pending-approvals" className="space-y-4">
          <TabsList className="bg-amber-50">
            <TabsTrigger
              value="pending-approvals"
              className="data-[state=active]:bg-amber-100 data-[state=active]:text-amber-900"
            >
              Pending Approvals
              {stats?.pendingApprovals && stats.pendingApprovals > 0 && (
                <Badge className="ml-2 bg-red-500 text-white" variant="secondary">
                  {stats.pendingApprovals}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="all-books"
              className="data-[state=active]:bg-amber-100 data-[state=active]:text-amber-900"
            >
              All Books
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-amber-100 data-[state=active]:text-amber-900">
              Users
            </TabsTrigger>
            <TabsTrigger value="swaps" className="data-[state=active]:bg-amber-100 data-[state=active]:text-amber-900">
              Swap Requests
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-amber-100 data-[state=active]:text-amber-900"
            >
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Pending Approvals Tab */}
          <TabsContent value="pending-approvals" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-amber-900">Books Pending Approval</h2>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                  placeholder="Search books or users..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <PendingBooksSection
              books={pendingBooksData?.data || []}
              isLoading={pendingLoading}
              onApprove={handleApproveBook}
              onReject={openRejectDialog}
              searchQuery={searchQuery}
            />
          </TabsContent>

          {/* All Books Tab */}
          <TabsContent value="all-books" className="space-y-4">
            <AllBooksSection
              books={allBooksData?.data || []}
              isLoading={booksLoading}
              filters={bookFilters}
              onFiltersChange={setBookFilters}
            />
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <UsersSection
              users={usersData?.data || []}
              isLoading={usersLoading}
              filters={userFilters}
              onFiltersChange={setUserFilters}
            />
          </TabsContent>

          {/* Swaps Tab */}
          <TabsContent value="swaps" className="space-y-4">
            <SwapsSection
              swaps={swapsData?.data || []}
              isLoading={swapsLoading}
              filters={swapFilters}
              onFiltersChange={setSwapFilters}
            />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            <AnalyticsSection stats={stats} isLoading={statsLoading} />
          </TabsContent>
        </Tabs>

        {/* Reject Book Dialog */}
        <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <AlertTriangle className="mr-2 h-5 w-5 text-red-500" />
                Reject Book
              </DialogTitle>
              <DialogDescription>
                Please provide a reason for rejecting this book. This will help the user understand what needs to be
                improved.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="reason" className="text-sm font-medium">
                  Rejection Reason
                </label>
                <Textarea
                  id="reason"
                  placeholder="e.g., Poor image quality, incomplete information, inappropriate content..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700"
                onClick={handleRejectBook}
                disabled={rejectBookMutation.isPending}
              >
                {rejectBookMutation.isPending ? "Rejecting..." : "Reject Book"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}
