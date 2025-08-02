"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Search, Plus, Edit, Trash2, Eye, ThumbsUp, Clock, XCircle } from "lucide-react"
import { useAuthStore } from "@/lib/auth"
import { useBooks, useMineBooks } from "@/lib/queries"
import type { BookFilters } from "@/lib/types"
import { useQuery } from "@tanstack/react-query"
import { getOwnBookApi } from "@/api/book"

export default function MyBooksPage() {
    const { user } = useAuthStore()
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [genreFilter, setGenreFilter] = useState("all")

    // Build filters
    const filters: BookFilters = {
        ownerId: user?.id,
        ...(searchQuery && { search: searchQuery }),
        ...(statusFilter !== "all" && { status: statusFilter as any }),
        ...(genreFilter !== "all" && { genre: genreFilter as any }),
    }


    const { data: ownBook, isLoading } = useQuery({
        queryFn: getOwnBookApi,
        queryKey: ["ownBook"],
        select: (res) => res.data
    })

    const books = ownBook || []

    console.log(books, "books data")

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "approved":
                return <ThumbsUp className="h-4 w-4 text-green-600" />
            case "pending":
                return <Clock className="h-4 w-4 text-amber-600" />
            case "rejected":
                return <XCircle className="h-4 w-4 text-red-600" />
            default:
                return <Clock className="h-4 w-4 text-gray-600" />
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "approved":
                return "bg-green-100 text-green-800"
            case "pending":
                return "bg-amber-100 text-amber-800"
            case "rejected":
                return "bg-red-100 text-red-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-amber-900">My Books</h1>
                    <p className="text-amber-800">Manage your book collection</p>
                </div>
                <div className="flex items-center space-x-2">
                    <Button asChild className="bg-amber-700 hover:bg-amber-800">
                        <Link href="/dashboard/add-book">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Book
                        </Link>
                    </Button>
                    <Button
                        asChild
                        variant="outline"
                        className="border-amber-700 text-amber-700 hover:bg-amber-50 bg-transparent"
                    >
                        <Link href="/dashboard">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Dashboard
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end">
                <div className="flex-1 space-y-2">
                    <label htmlFor="search" className="text-sm font-medium text-amber-900">
                        Search Books
                    </label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                        <Input
                            id="search"
                            placeholder="Search by title or author..."
                            className="pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
                <div className="w-full md:w-48">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger>
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="w-full md:w-48">
                    <Select value={genreFilter} onValueChange={setGenreFilter}>
                        <SelectTrigger>
                            <SelectValue placeholder="Genre" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Genres</SelectItem>
                            <SelectItem value="fiction">Fiction</SelectItem>
                            <SelectItem value="non-fiction">Non-Fiction</SelectItem>
                            <SelectItem value="mystery">Mystery</SelectItem>
                            <SelectItem value="sci-fi">Science Fiction</SelectItem>
                            <SelectItem value="fantasy">Fantasy</SelectItem>
                            <SelectItem value="romance">Romance</SelectItem>
                            <SelectItem value="biography">Biography</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Books Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {Array.from({ length: 8 }).map((_, index) => (
                        <BookCardSkeleton key={index} />
                    ))}
                </div>
            ) : books.length === 0 ? (
                <Card className="p-12 text-center">
                    <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-amber-100 flex items-center justify-center">
                        <Plus className="h-8 w-8 text-amber-700" />
                    </div>
                    <h3 className="mb-2 text-xl font-semibold text-amber-900">
                        {searchQuery || statusFilter !== "all" || genreFilter !== "all" ? "No books found" : "No books yet"}
                    </h3>
                    <p className="mb-6 text-amber-800">
                        {searchQuery || statusFilter !== "all" || genreFilter !== "all"
                            ? "Try adjusting your search or filters"
                            : "Start building your collection by adding your first book"}
                    </p>
                    <Button asChild className="bg-amber-700 hover:bg-amber-800">
                        <Link href="/dashboard/add-book">Add Your First Book</Link>
                    </Button>
                </Card>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {books.map((book: any) => (
                        <Card key={book.id} className="overflow-hidden transition-all hover:shadow-lg">
                            <div className="aspect-[2/2] bg-amber-100 relative">
                                <img
                                    src={book.image ? `${process.env.NEXT_PUBLIC_BACKEND_HOST}${book.image}` : "/placeholder.svg"}
                                    alt={book.title}
                                    crossOrigin="use-credentials"
                                    className="h-full w-full object-cover"
                                />
                                <div className="absolute top-2 right-2">
                                    <Badge className={getStatusColor(book.status)}>
                                        {getStatusIcon(book.status)}
                                        <span className="ml-1 capitalize">{book.status}</span>
                                    </Badge>
                                </div>
                            </div>
                            <CardHeader className="p-4 pb-2">
                                <CardTitle className="line-clamp-1 text-lg">{book.title}</CardTitle>
                                <CardDescription>by {book.author}</CardDescription>
                            </CardHeader>
                            <CardContent className="p-4 pt-2">
                                <div className="mb-2 flex items-center space-x-2">
                                    <span className="rounded-full bg-amber-100 px-2 py-1 text-xs text-amber-800">{book.genre}</span>
                                    <span className="text-xs text-gray-500">{book.condition}</span>
                                </div>
                                <p className="line-clamp-2 text-sm text-gray-600">{book.description}</p>
                                <p className="mt-2 text-xs text-gray-500">Added: {new Date(book.createdAt).toLocaleDateString()}</p>
                            </CardContent>
                            <CardFooter className="p-4 pt-0 flex space-x-2">
                                <Button
                                    asChild
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 border-amber-700 text-amber-700 hover:bg-amber-50 bg-transparent"
                                >
                                    <Link href={`/dashboard/books/${book.id}/edit`}>
                                        <Edit className="mr-1 h-4 w-4" />
                                        Edit
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    variant="outline"
                                    size="sm"
                                    className="border-gray-300 text-gray-600 hover:bg-gray-50 bg-transparent"
                                >
                                    <Link href={`/books/${book.id}`}>
                                        <Eye className="h-4 w-4" />
                                    </Link>
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-red-300 text-red-600 hover:bg-red-50 bg-transparent"
                                    onClick={() => {
                                        // TODO: Implement delete functionality
                                        console.log("Delete book:", book.id)
                                    }}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}

function BookCardSkeleton() {
    return (
        <Card className="overflow-hidden">
            <div className="aspect-[2/2] bg-gray-200 animate-pulse" />
            <CardHeader className="p-4 pb-2">
                <div className="h-6 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
            </CardHeader>
            <CardContent className="p-4 pt-2">
                <div className="flex space-x-2 mb-2">
                    <div className="h-5 bg-gray-200 rounded-full animate-pulse w-16" />
                    <div className="h-5 bg-gray-200 rounded animate-pulse w-12" />
                </div>
                <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded animate-pulse" />
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-4/5" />
                </div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-24 mt-2" />
            </CardContent>
            <CardFooter className="p-4 pt-0 flex space-x-2">
                <div className="h-8 bg-gray-200 rounded animate-pulse flex-1" />
                <div className="h-8 bg-gray-200 rounded animate-pulse w-10" />
                <div className="h-8 bg-gray-200 rounded animate-pulse w-10" />
            </CardFooter>
        </Card>
    )
}
