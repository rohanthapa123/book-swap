"use client"

import { getRecommendedBookApi } from "@/api/book"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useQuery } from "@tanstack/react-query"
import { Bell, BookOpen, Clock, Plus, RefreshCw, ThumbsUp } from "lucide-react"
import Link from "next/link"
import useAuthStore from "@/store/useAuthStore"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Book } from "@/app/(user)/page"
import Image from "next/image"

export const DashboardHome = () => {
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

    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.replace('/login'); // or push()
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) return null; // optional: loading state


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
                        <div className="text-2xl font-bold">{userStats.booksAdded}</div>
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
                        <div className="text-2xl font-bold">{userStats.pendingRequests}</div>
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
                    <Button asChild variant="outline" className="border-amber-700 text-amber-700 hover:bg-amber-50">
                        <Link href="/dashboard/swaps">
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Manage Swaps
                        </Link>
                    </Button>
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
                        {userBooks && userBooks?.map((book) => (
                            <Card key={book?.id} className="overflow-hidden">
                                <div className="aspect-[2/2] bg-amber-100">
                                    <img
                                        src={book?.coverUrl || "/placeholder.svg"}
                                        alt={book?.title}
                                        crossOrigin="use-credentials"
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                <CardContent className="p-4">
                                    <h3 className="line-clamp-1 font-medium">{book?.title}</h3>
                                    <p className="mb-2 text-sm text-gray-600">by {book?.author}</p>
                                    <div className="flex items-center">
                                        {book?.status === "approved" ? (
                                            <span className="flex items-center text-xs text-green-600">
                                                <ThumbsUp className="mr-1 h-3 w-3" /> Approved
                                            </span>
                                        ) : book?.status === "pending" ? (
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
                        {swapRequests.length > 0 ? (
                            swapRequests.map((request) => (
                                <Card key={request.id} className="overflow-hidden">
                                    <div className="flex flex-col p-4 sm:flex-row sm:items-center">
                                        <div className="mb-4 flex sm:mb-0 sm:mr-4">
                                            <div className="h-16 w-12 flex-shrink-0 overflow-hidden bg-amber-100">
                                                <img
                                                    src={request.bookCoverUrl || "/placeholder.svg"}
                                                    alt={request.bookTitle}
                                                    crossOrigin="use-credentials"
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                            <div className="ml-4">
                                                <h3 className="font-medium">{request.bookTitle}</h3>
                                                <p className="text-sm text-gray-600">by {request.bookAuthor}</p>
                                                <p className="text-xs text-amber-700">
                                                    {request.type === "incoming" ? "From" : "To"}: {request.otherUser}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex flex-1 flex-col space-y-2 sm:flex-row sm:items-center sm:justify-end sm:space-x-2 sm:space-y-0">
                                            {request.type === "incoming" ? (
                                                <>
                                                    <Button size="sm" className="bg-amber-700 hover:bg-amber-800">
                                                        Accept
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="border-amber-700 text-amber-700 hover:bg-amber-50"
                                                    >
                                                        Decline
                                                    </Button>
                                                </>
                                            ) : (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="border-amber-700 text-amber-700 hover:bg-amber-50"
                                                >
                                                    Cancel Request
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            ))
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
                                    <Image
                                        src={book.image ? `${process.env.NEXT_PUBLIC_BACKEND_HOST}${book.image}` : "/placeholder.svg"}
                                        alt={book.title}
                                        crossOrigin="use-credentials"
                                        className="h-full w-full object-cover"
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

// Sample user books
const userBooks = [
    {
        id: 101,
        title: "The Alchemist",
        author: "Paulo Coelho",
        coverUrl: "/placeholder.svg?height=200&width=150",
        status: "approved",
    },
    {
        id: 102,
        title: "Dune",
        author: "Frank Herbert",
        coverUrl: "/placeholder.svg?height=200&width=150",
        status: "approved",
    },
    {
        id: 103,
        title: "The Catcher in the Rye",
        author: "J.D. Salinger",
        coverUrl: "/placeholder.svg?height=200&width=150",
        status: "approved",
    },
    {
        id: 104,
        title: "The Midnight Library",
        author: "Matt Haig",
        coverUrl: "/placeholder.svg?height=200&width=150",
        status: "pending",
    },
    {
        id: 105,
        title: "Educated",
        author: "Tara Westover",
        coverUrl: "/placeholder.svg?height=200&width=150",
        status: "approved",
    },
]

// Sample swap requests
const swapRequests = [
    {
        id: 201,
        type: "incoming",
        bookTitle: "The Great Gatsby",
        bookAuthor: "F. Scott Fitzgerald",
        bookCoverUrl: "/placeholder.svg?height=100&width=70",
        otherUser: "Sarah Johnson",
        date: "2023-05-15",
    },
    {
        id: 202,
        type: "outgoing",
        bookTitle: "To Kill a Mockingbird",
        bookAuthor: "Harper Lee",
        bookCoverUrl: "/placeholder.svg?height=100&width=70",
        otherUser: "Michael Chen",
        date: "2023-05-12",
    },
    {
        id: 203,
        type: "incoming",
        bookTitle: "1984",
        bookAuthor: "George Orwell",
        bookCoverUrl: "/placeholder.svg?height=100&width=70",
        otherUser: "Emma Williams",
        date: "2023-05-10",
    },
]

// Sample recommended books
const recommendedBooks = [
    {
        id: 3,
        title: "1984",
        author: "George Orwell",
        genre: "Dystopian",
        coverUrl: "/placeholder.svg?height=200&width=150",
    },
    {
        id: 7,
        title: "The Silent Patient",
        author: "Alex Michaelides",
        genre: "Mystery",
        coverUrl: "/placeholder.svg?height=200&width=150",
    },
    {
        id: 8,
        title: "Sapiens",
        author: "Yuval Noah Harari",
        genre: "Non-Fiction",
        coverUrl: "/placeholder.svg?height=200&width=150",
    },
    {
        id: 5,
        title: "The Hobbit",
        author: "J.R.R. Tolkien",
        genre: "Fantasy",
        coverUrl: "/placeholder.svg?height=200&width=150",
    },
]
