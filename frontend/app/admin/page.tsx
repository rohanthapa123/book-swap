"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Users, RefreshCw, ThumbsUp, ThumbsDown, Search, ArrowLeft } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function AdminPage() {
  const [searchQuery, setSearchQuery] = useState("")

  // Filter books based on search query
  const filteredPendingBooks = pendingBooks.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.owner.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-amber-900">Admin Dashboard</h1>
          <p className="text-amber-800">Manage books, users, and swap requests</p>
        </div>
        <Button asChild variant="outline" className="border-amber-700 text-amber-700 hover:bg-amber-50">
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to User Dashboard
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Books</CardTitle>
            <BookOpen className="h-4 w-4 text-amber-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">248</div>
            <p className="text-xs text-muted-foreground">+12 this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-amber-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,024</div>
            <p className="text-xs text-muted-foreground">+86 this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed Swaps</CardTitle>
            <RefreshCw className="h-4 w-4 text-amber-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">+32 this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <ThumbsUp className="h-4 w-4 text-amber-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingBooks.length}</div>
            <p className="text-xs text-muted-foreground">Updated just now</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="pending-approvals" className="space-y-4">
        <TabsList className="bg-amber-50">
          <TabsTrigger
            value="pending-approvals"
            className="data-[state=active]:bg-amber-100 data-[state=active]:text-amber-900"
          >
            Pending Approvals
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
          <TabsTrigger value="reports" className="data-[state=active]:bg-amber-100 data-[state=active]:text-amber-900">
            Reports
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

          {/* Pending Books List */}
          <div className="space-y-4">
            {filteredPendingBooks.length > 0 ? (
              filteredPendingBooks.map((book) => (
                <Card key={book.id} className="overflow-hidden">
                  <div className="flex flex-col p-4 sm:flex-row sm:items-center">
                    <div className="mb-4 flex sm:mb-0 sm:mr-4">
                      <div className="h-24 w-16 flex-shrink-0 overflow-hidden bg-amber-100">
                        <img
                          src={book.coverUrl || "/placeholder.svg"}
                          alt={book.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="ml-4">
                        <h3 className="font-medium">{book.title}</h3>
                        <p className="text-sm text-gray-600">by {book.author}</p>
                        <div className="mt-1 flex items-center">
                          <Badge variant="outline" className="mr-2 border-amber-200 bg-amber-50 text-amber-800">
                            {book.genre}
                          </Badge>
                          <span className="text-xs text-gray-500">Condition: {book.condition}</span>
                        </div>
                        <p className="mt-1 text-xs text-amber-700">
                          Added by: {book.owner} • {book.dateAdded}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col space-y-2 sm:flex-row sm:items-center sm:justify-end sm:space-x-2 sm:space-y-0">
                      <Button
                        size="sm"
                        className="flex items-center bg-green-600 hover:bg-green-700"
                        onClick={() => console.log(`Approved book: ${book.id}`)}
                      >
                        <ThumbsUp className="mr-1 h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex items-center border-red-600 text-red-600 hover:bg-red-50"
                        onClick={() => console.log(`Rejected book: ${book.id}`)}
                      >
                        <ThumbsDown className="mr-1 h-4 w-4" />
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-amber-700 text-amber-700 hover:bg-amber-50"
                        onClick={() => console.log(`View details: ${book.id}`)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="p-8 text-center">
                <ThumbsUp className="mx-auto mb-4 h-12 w-12 text-amber-300" />
                <h3 className="mb-2 text-xl font-semibold text-amber-900">No Books Pending Approval</h3>
                <p className="mb-4 text-amber-800">
                  All books have been reviewed. Check back later for new submissions.
                </p>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* All Books Tab */}
        <TabsContent value="all-books" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-amber-900">All Books</h2>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input placeholder="Search books..." className="pl-10" />
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Book Inventory</CardTitle>
              <CardDescription>Manage all books in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="pb-2 pr-4 pt-2 font-medium">Title</th>
                      <th className="pb-2 pr-4 pt-2 font-medium">Author</th>
                      <th className="pb-2 pr-4 pt-2 font-medium">Genre</th>
                      <th className="pb-2 pr-4 pt-2 font-medium">Owner</th>
                      <th className="pb-2 pr-4 pt-2 font-medium">Status</th>
                      <th className="pb-2 pr-4 pt-2 font-medium">Added</th>
                      <th className="pb-2 pr-4 pt-2 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allBooks.map((book) => (
                      <tr key={book.id} className="border-b">
                        <td className="py-3 pr-4">{book.title}</td>
                        <td className="py-3 pr-4">{book.author}</td>
                        <td className="py-3 pr-4">
                          <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-800">
                            {book.genre}
                          </Badge>
                        </td>
                        <td className="py-3 pr-4">{book.owner}</td>
                        <td className="py-3 pr-4">
                          <Badge
                            className={
                              book.status === "approved"
                                ? "bg-green-100 text-green-800"
                                : book.status === "pending"
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-red-100 text-red-800"
                            }
                          >
                            {book.status}
                          </Badge>
                        </td>
                        <td className="py-3 pr-4">{book.dateAdded}</td>
                        <td className="py-3 pr-4">
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 border-amber-700 text-amber-700 hover:bg-amber-50"
                            >
                              View
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 border-red-600 text-red-600 hover:bg-red-50"
                            >
                              Remove
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-amber-900">User Management</h2>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input placeholder="Search users..." className="pl-10" />
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Users</CardTitle>
              <CardDescription>Manage user accounts and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="pb-2 pr-4 pt-2 font-medium">Name</th>
                      <th className="pb-2 pr-4 pt-2 font-medium">Email</th>
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
                        <td className="py-3 pr-4">{user.name}</td>
                        <td className="py-3 pr-4">{user.email}</td>
                        <td className="py-3 pr-4">{user.books}</td>
                        <td className="py-3 pr-4">{user.swaps}</td>
                        <td className="py-3 pr-4">{user.joined}</td>
                        <td className="py-3 pr-4">
                          <Badge
                            className={
                              user.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }
                          >
                            {user.status}
                          </Badge>
                        </td>
                        <td className="py-3 pr-4">
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 border-amber-700 text-amber-700 hover:bg-amber-50"
                            >
                              View
                            </Button>
                            {user.status === "active" ? (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 border-red-600 text-red-600 hover:bg-red-50"
                              >
                                Suspend
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 border-green-600 text-green-600 hover:bg-green-50"
                              >
                                Activate
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-4">
          <h2 className="text-xl font-semibold text-amber-900">System Reports</h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Book Activity</CardTitle>
                <CardDescription>Books added and swapped over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 bg-amber-50 p-4 text-center">[Book Activity Chart Placeholder]</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>New user registrations over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 bg-amber-50 p-4 text-center">[User Growth Chart Placeholder]</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Popular Genres</CardTitle>
                <CardDescription>Distribution of books by genre</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 bg-amber-50 p-4 text-center">[Genre Distribution Chart Placeholder]</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Swap Success Rate</CardTitle>
                <CardDescription>Percentage of successful swap requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 bg-amber-50 p-4 text-center">[Swap Success Chart Placeholder]</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Sample pending books data
const pendingBooks = [
  {
    id: 301,
    title: "The Midnight Library",
    author: "Matt Haig",
    genre: "Fiction",
    condition: "Like New",
    coverUrl: "/placeholder.svg?height=100&width=70",
    owner: "Emma Williams",
    dateAdded: "2023-05-15",
  },
  {
    id: 302,
    title: "Atomic Habits",
    author: "James Clear",
    genre: "Self-Help",
    condition: "Good",
    coverUrl: "/placeholder.svg?height=100&width=70",
    owner: "Michael Chen",
    dateAdded: "2023-05-14",
  },
  {
    id: 303,
    title: "Project Hail Mary",
    author: "Andy Weir",
    genre: "Sci-Fi",
    condition: "Like New",
    coverUrl: "/placeholder.svg?height=100&width=70",
    owner: "Sarah Johnson",
    dateAdded: "2023-05-13",
  },
]

// Sample all books data
const allBooks = [
  {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    genre: "Fiction",
    owner: "Sarah Johnson",
    status: "approved",
    dateAdded: "2023-04-10",
  },
  {
    id: 2,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    genre: "Fiction",
    owner: "Michael Chen",
    status: "approved",
    dateAdded: "2023-04-12",
  },
  {
    id: 3,
    title: "1984",
    author: "George Orwell",
    genre: "Sci-Fi",
    owner: "Emma Williams",
    status: "approved",
    dateAdded: "2023-04-15",
  },
  {
    id: 301,
    title: "The Midnight Library",
    author: "Matt Haig",
    genre: "Fiction",
    owner: "Emma Williams",
    status: "pending",
    dateAdded: "2023-05-15",
  },
  {
    id: 302,
    title: "Atomic Habits",
    author: "James Clear",
    genre: "Self-Help",
    owner: "Michael Chen",
    status: "pending",
    dateAdded: "2023-05-14",
  },
]

// Sample users data
const users = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    books: 5,
    swaps: 3,
    joined: "2023-03-15",
    status: "active",
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "michael.c@example.com",
    books: 8,
    swaps: 6,
    joined: "2023-03-20",
    status: "active",
  },
  {
    id: 3,
    name: "Emma Williams",
    email: "emma.w@example.com",
    books: 3,
    swaps: 2,
    joined: "2023-04-05",
    status: "active",
  },
  {
    id: 4,
    name: "David Miller",
    email: "david.m@example.com",
    books: 0,
    swaps: 0,
    joined: "2023-05-10",
    status: "inactive",
  },
]
