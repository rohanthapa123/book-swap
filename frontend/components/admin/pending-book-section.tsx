"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ThumbsUp, ThumbsDown, Eye } from "lucide-react"
import type { Book } from "@/lib/types"

interface PendingBooksSectionProps {
    books: Book[]
    isLoading: boolean
    onApprove: (bookId: string) => void
    onReject: (bookId: string) => void
    searchQuery: string
}

export default function PendingBooksSection({
    books,
    isLoading,
    onApprove,
    onReject,
    searchQuery,
}: PendingBooksSectionProps) {
    const filteredBooks = books.filter(
        (book) =>
            book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
            `${book.owner.firstName} ${book.owner.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    if (isLoading) {
        return (
            <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                    <PendingBookSkeleton key={index} />
                ))}
            </div>
        )
    }

    if (filteredBooks.length === 0) {
        return (
            <Card className="p-8 text-center">
                <ThumbsUp className="mx-auto mb-4 h-12 w-12 text-amber-300" />
                <h3 className="mb-2 text-xl font-semibold text-amber-900">
                    {searchQuery ? "No matching books found" : "No Books Pending Approval"}
                </h3>
                <p className="mb-4 text-amber-800">
                    {searchQuery
                        ? "Try adjusting your search terms"
                        : "All books have been reviewed. Check back later for new submissions."}
                </p>
            </Card>
        )
    }

    return (
        <div className="space-y-4">
            {filteredBooks.map((book) => (
                <Card key={book.id} className="overflow-hidden">
                    <div className="flex flex-col p-4 sm:flex-row sm:items-center">
                        <div className="mb-4 flex sm:mb-0 sm:mr-4">
                            <div className="h-24 w-16 flex-shrink-0 overflow-hidden bg-amber-100">
                                <img
                                    src={book.coverUrl || "/placeholder.svg?height=120&width=80"}
                                    alt={book.title}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <div className="ml-4">
                                <h3 className="font-medium">{book.title}</h3>
                                <p className="text-sm text-gray-600">by {book.author}</p>
                                <div className="mt-1 flex items-center space-x-2">
                                    <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-800">
                                        {book.genre}
                                    </Badge>
                                    <span className="text-xs text-gray-500">Condition: {book.condition}</span>
                                </div>
                                <p className="mt-1 text-xs text-amber-700">
                                    Added by: {book.owner.firstName} {book.owner.lastName} •{" "}
                                    {new Date(book.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-1 flex-col space-y-2 sm:flex-row sm:items-center sm:justify-end sm:space-x-2 sm:space-y-0">
                            <Button
                                size="sm"
                                className="flex items-center bg-green-600 hover:bg-green-700"
                                onClick={() => onApprove(book.id)}
                            >
                                <ThumbsUp className="mr-1 h-4 w-4" />
                                Approve
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                className="flex items-center border-red-600 text-red-600 hover:bg-red-50 bg-transparent"
                                onClick={() => onReject(book.id)}
                            >
                                <ThumbsDown className="mr-1 h-4 w-4" />
                                Reject
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                className="flex items-center border-amber-700 text-amber-700 hover:bg-amber-50 bg-transparent"
                            >
                                <Eye className="mr-1 h-4 w-4" />
                                View Details
                            </Button>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    )
}

function PendingBookSkeleton() {
    return (
        <Card className="overflow-hidden">
            <div className="flex flex-col p-4 sm:flex-row sm:items-center">
                <div className="mb-4 flex sm:mb-0 sm:mr-4">
                    <Skeleton className="h-24 w-16 flex-shrink-0" />
                    <div className="ml-4 space-y-2">
                        <Skeleton className="h-5 w-48" />
                        <Skeleton className="h-4 w-32" />
                        <div className="flex items-center space-x-2">
                            <Skeleton className="h-5 w-16 rounded-full" />
                            <Skeleton className="h-3 w-24" />
                        </div>
                        <Skeleton className="h-3 w-40" />
                    </div>
                </div>
                <div className="flex flex-1 flex-col space-y-2 sm:flex-row sm:items-center sm:justify-end sm:space-x-2 sm:space-y-0">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-24" />
                </div>
            </div>
        </Card>
    )
}
