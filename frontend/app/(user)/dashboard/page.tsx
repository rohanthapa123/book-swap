"use client"

import { getOwnBookApi, getRecommendedBookApi } from "@/api/book"
import { Book } from "@/app/(user)/page"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useApproveSwap, useBooks, useCancelSwap, useDeclineSwap, useSwaps, useUsers } from "@/lib/queries"
import { useQuery } from "@tanstack/react-query"
import { Bell, BookOpen, Clock, Plus, RefreshCw, ThumbsUp } from "lucide-react"
import Link from "next/link"

export default function DashboardHome() {
  // In a real app, this data would come from your API
  const userStats = {
    booksAdded: 12,
    swapsCompleted: 8,
    pendingRequests: 3,
  }


  const { data, isLoading, isError } = useQuery({
    queryFn: getRecommendedBookApi,
    queryKey: ["recommendation"],
    select: (res) => res.data
  })

  const { data: ownBook } = useQuery({
    queryFn: getOwnBookApi,
    queryKey: ["ownBook"],
    select: (res) => res.data
  })



  const { data: allBooksData, isLoading: booksLoading } = useBooks()
  const { data: usersData, isLoading: usersLoading } = useUsers()
  const { data: swapsData, isLoading: swapsLoading } = useSwaps()

  const { mutate: approveSwap } = useApproveSwap()
  const { mutate: cancelSwap } = useCancelSwap()
  const { mutate: declineSwap } = useDeclineSwap()

  const handleApprove = (id: string) => {
    approveSwap({ id })
  }

  const handleCancel = (id: string) => {
    cancelSwap({ id })
  }

  const handleDecline = (id: string) => {
    declineSwap({ id })
  }

  console.log(allBooksData, usersData, swapsData)


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-amber-900">Dashboard</h1>
        <p className="text-amber-800">Manage your books and swap requests</p>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Books Added</CardTitle>
            <BookOpen className="h-4 w-4 text-amber-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ownBook?.length}</div>
            <p className="text-xs text-muted-foreground">+2 in the last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Swaps Completed</CardTitle>
            <RefreshCw className="h-4 w-4 text-amber-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.swapsCompleted}</div>
            <p className="text-xs text-muted-foreground">+3 in the last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Bell className="h-4 w-4 text-amber-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ownBook?.filter((i: Book) => i.approvalRequest.status === "pending").length}</div>
            <p className="text-xs text-muted-foreground">2 incoming, 1 outgoing</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold text-amber-900">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Button asChild className="bg-amber-700 hover:bg-amber-800">
            <Link href="/dashboard/add-book">
              <Plus className="mr-2 h-4 w-4" />
              Add New Book
            </Link>
          </Button>
          <Button asChild variant="outline" className="border-amber-700 text-amber-700 hover:bg-amber-50">
            <Link href="/books">
              <BookOpen className="mr-2 h-4 w-4" />
              Browse Books
            </Link>
          </Button>
          {/* <Button asChild variant="outline" className="border-amber-700 text-amber-700 hover:bg-amber-50">
            <Link href="/dashboard/swaps">
              <RefreshCw className="mr-2 h-4 w-4" />
              Manage Swaps
            </Link>
          </Button> */}
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="my-books" className="space-y-4">
        <TabsList className="bg-amber-50">
          <TabsTrigger value="my-books" className="data-[state=active]:bg-amber-100 data-[state=active]:text-amber-900">
            My Books
          </TabsTrigger>
          <TabsTrigger
            value="swap-requests"
            className="data-[state=active]:bg-amber-100 data-[state=active]:text-amber-900"
          >
            Swap Requests
          </TabsTrigger>
          <TabsTrigger
            value="recommendations"
            className="data-[state=active]:bg-amber-100 data-[state=active]:text-amber-900"
          >
            Recommendations
          </TabsTrigger>
        </TabsList>

        {/* My Books Tab */}
        <TabsContent value="my-books" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-amber-900">My Books</h2>
            <Button asChild variant="outline" size="sm" className="border-amber-700 text-amber-700 hover:bg-amber-50">
              <Link href="/dashboard/books">View All</Link>
            </Button>
          </div>

          {/* Books Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {ownBook && ownBook?.map((book: Book) => (
              <Card key={book?.id} className="overflow-hidden">
                <div className="aspect-[2/2] bg-amber-100">
                  <img
                    src={book.image ? `${process.env.NEXT_PUBLIC_BACKEND_HOST}${book.image}` : "/placeholder.svg"}
                    alt={book?.title}
                    crossOrigin="use-credentials"
                    className="h-full w-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="line-clamp-1 font-medium">{book?.title}</h3>
                  <p className="mb-2 text-sm text-gray-600">by {book?.author}</p>
                  <div className="flex items-center">
                    {book?.approvalRequest?.status === "approved" ? (
                      <span className="flex items-center text-xs text-green-600">
                        <ThumbsUp className="mr-1 h-3 w-3" /> Approved
                      </span>
                    ) : book?.approvalRequest?.status === "pending" ? (
                      <span className="flex items-center text-xs text-amber-600">
                        <Clock className="mr-1 h-3 w-3" /> Pending Approval
                      </span>
                    ) : (
                      <span className="flex items-center text-xs text-red-600">
                        <Clock className="mr-1 h-3 w-3" /> Rejected
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Add Book Card */}
            <Card className="flex aspect-[3/4] flex-col items-center justify-center border-2 border-dashed border-amber-200 bg-amber-50 p-6 text-center">
              <div className="mb-4 rounded-full bg-amber-100 p-3">
                <Plus className="h-6 w-6 text-amber-700" />
              </div>
              <h3 className="mb-2 font-medium text-amber-900">Add New Book</h3>
              <p className="mb-4 text-sm text-amber-700">Share a book from your collection</p>
              <Button asChild size="sm" className="bg-amber-700 hover:bg-amber-800">
                <Link href="/dashboard/add-book">Add Book</Link>
              </Button>
            </Card>
          </div>
        </TabsContent>

        {/* Swap Requests Tab */}
        <TabsContent value="swap-requests" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-amber-900">Swap Requests</h2>
            <Button asChild variant="outline" size="sm" className="border-amber-700 text-amber-700 hover:bg-amber-50">
              <Link href="/dashboard/swaps">View All</Link>
            </Button>
          </div>

          {/* Requests List */}
          <div className="space-y-4">
            {swapsData && Array.isArray(swapsData.data) && swapsData.data.length > 0 ? (
              swapsData.data.map((request: any) => {
                const backendHost = process.env.NEXT_PUBLIC_BACKEND_HOST || "";

                const bookCoverUrl = request.bookRequested?.image
                  ? `${backendHost}${request.bookRequested.image}`
                  : "/placeholder.svg";

                const bookTitle = request.bookRequested?.title || "Unknown Book";
                const bookAuthor = request.bookRequested?.author || "Unknown Author";

                const currentUserId = "57da85d6-fbbc-4b34-bc39-4637f404ab61"; // replace with your actual user id from context/auth
                const isRequester = request.requester?.id === currentUserId;
                const type = isRequester ? "outgoing" : "incoming";

                const otherUser = isRequester
                  ? request.receiver?.name || "Unknown User"
                  : request.requester?.name || "Unknown User";

                return (
                  <Card key={request.id} className="overflow-hidden">
                    <div className="flex flex-col p-4 sm:flex-row sm:items-center">
                      <div className="mb-4 flex sm:mb-0 sm:mr-4">
                        <div className="h-16 w-12 flex-shrink-0 overflow-hidden bg-amber-100">
                          <img
                            src={bookCoverUrl}
                            alt={bookTitle}
                            className="h-full w-full object-cover"
                            crossOrigin="use-credentials"
                          />
                        </div>
                        <div className="ml-4">
                          <h3 className="font-medium">{bookTitle}</h3>
                          <p className="text-sm text-gray-600">by {bookAuthor}</p>
                          <p className="text-xs text-amber-700">
                            {type === "incoming" ? "From" : "To"}: {otherUser}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-1 flex-col space-y-2 sm:flex-row sm:items-center sm:justify-end sm:space-x-2 sm:space-y-0">
                        {request.status === 'cancelled' ? "Cancelled" : type === "incoming" ? (
                          <>
                            <Button size="sm" className="bg-amber-700 hover:bg-amber-800"
                              onClick={() => { handleApprove(request.id) }}
                            >
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-amber-700 text-amber-700 hover:bg-amber-50"
                              onClick={() => { handleDecline(request.id) }}

                            >
                              Decline
                            </Button>
                          </>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-amber-700 text-amber-700 hover:bg-amber-50"
                            onClick={() => { handleCancel(request.id) }}

                          >
                            Cancel Request
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })
            ) : (
              <Card className="p-8 text-center">
                <RefreshCw className="mx-auto mb-4 h-12 w-12 text-amber-300" />
                <h3 className="mb-2 text-xl font-semibold text-amber-900">No Swap Requests</h3>
                <p className="mb-4 text-amber-800">You don't have any pending swap requests at the moment.</p>
                <Button asChild className="bg-amber-700 hover:bg-amber-800">
                  <Link href="/books">Browse Books</Link>
                </Button>
              </Card>
            )}
          </div>

        </TabsContent>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-4">
          <h2 className="text-xl font-semibold text-amber-900">Recommended for You</h2>
          <p className="text-amber-800">Based on your reading preferences</p>

          {/* Recommendations Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {isLoading ? <>Loading...</> : isError ? <>Error...</> : data.map((book: Book) => (
              <Card key={book.id} className="overflow-hidden">
                <div className="aspect-[2/2] bg-amber-100">
                  <img
                    src={book.image ? `${process.env.NEXT_PUBLIC_BACKEND_HOST}${book.image}` : "/placeholder.svg"}
                    alt={book.title}
                    className="h-full w-full object-cover"
                    crossOrigin="use-credentials"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="line-clamp-1 font-medium">{book.title}</h3>
                  <p className="mb-2 text-sm text-gray-600">by {book.author}</p>
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-amber-100 px-2 py-1 text-xs text-amber-800">{book.genre}</span>
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="h-8 border-amber-700 text-amber-700 hover:bg-amber-50"
                    >
                      <Link href={`/books/${book.id}`}>View</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}


