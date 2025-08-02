"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { BookOpen, RefreshCw, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useBooks, useMineBooks } from "@/lib/queries"
import type { Book } from "@/lib/types"
import useAuthStore from "@/store/useAuthStore"

interface SwapRequestDialogProps {
    isOpen: boolean
    onClose: () => void
    targetBook: Book
    onSubmit: (data: { offeredBookId: string; message: string }) => void
    isSubmitting: boolean
}

export default function SwapRequestDialog({
    isOpen,
    onClose,
    targetBook,
    onSubmit,
    isSubmitting,
}: SwapRequestDialogProps) {

    const { id } = useAuthStore((state) => state.user!)
    const [selectedBookId, setSelectedBookId] = useState<string>("")
    const [message, setMessage] = useState("")
    const [error, setError] = useState("")

    console.log(id, "User ID for swap request")
    // Fetch user's approved books
    const { data: userBooksData, isLoading } = useMineBooks(
        1,
        50, // Get more books for selection
    )

    const userBooks = userBooksData?.data || []

    const handleSubmit = () => {
        if (!selectedBookId) {
            setError("Please select a book to offer in exchange")
            return
        }

        if (!message.trim()) {
            setError("Please add a message to your swap request")
            return
        }

        setError("")
        onSubmit({
            offeredBookId: selectedBookId,
            message: message.trim(),
        })
    }

    const handleClose = () => {
        setSelectedBookId("")
        setMessage("")
        setError("")
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center">
                        <RefreshCw className="mr-2 h-5 w-5 text-amber-700" />
                        Request Book Swap
                    </DialogTitle>
                    <DialogDescription>
                        Select one of your books to offer in exchange for "{targetBook.title}" by {targetBook.author}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {/* Target Book Display */}
                    <div>
                        <h3 className="mb-3 text-lg font-semibold text-amber-900">Book You Want</h3>
                        <Card className="border-amber-200 bg-amber-50">
                            <CardContent className="p-4">
                                <div className="flex items-center space-x-4">
                                    <div className="h-20 w-14 flex-shrink-0 overflow-hidden bg-amber-100">
                                        <img
                                            src={targetBook.coverUrl || "/placeholder.svg?height=100&width=70"}
                                            alt={targetBook.title}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-medium">{targetBook.title}</h4>
                                        <p className="text-sm text-gray-600">by {targetBook.author}</p>
                                        <div className="mt-2 flex items-center space-x-2">
                                            <Badge variant="outline" className="border-amber-200 bg-amber-100 text-amber-800">
                                                {targetBook.genre}
                                            </Badge>
                                            <span className="text-xs text-gray-500">Condition: {targetBook.condition}</span>
                                        </div>
                                        <p className="mt-1 text-xs text-amber-700">
                                            Owner: {targetBook.owner.firstName} {targetBook.owner.lastName}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* User's Books Selection */}
                    <div>
                        <h3 className="mb-3 text-lg font-semibold text-amber-900">Select Your Book to Offer</h3>

                        {isLoading ? (
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                                {Array.from({ length: 6 }).map((_, index) => (
                                    <BookSelectionSkeleton key={index} />
                                ))}
                            </div>
                        ) : userBooks.length === 0 ? (
                            <Card className="p-8 text-center">
                                <BookOpen className="mx-auto mb-4 h-12 w-12 text-amber-300" />
                                <h4 className="mb-2 text-lg font-semibold text-amber-900">No Books Available</h4>
                                <p className="mb-4 text-amber-800">
                                    You need to have approved books to make swap requests. Add some books to your collection first.
                                </p>
                                <Button asChild className="bg-amber-700 hover:bg-amber-800">
                                    <a href="/dashboard/add-book">Add Your First Book</a>
                                </Button>
                            </Card>
                        ) : (
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 max-h-80 overflow-y-auto">
                                {userBooks.map((book) => (
                                    <BookSelectionCard
                                        key={book.id}
                                        book={book}
                                        isSelected={selectedBookId === book.id}
                                        onSelect={() => setSelectedBookId(book.id)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Message */}
                    <div>
                        <h3 className="mb-3 text-lg font-semibold text-amber-900">Message to Owner</h3>
                        <Textarea
                            placeholder="Hi! I'm interested in swapping books. I think you might enjoy my book in exchange for yours. Let me know if you're interested!"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="min-h-[100px]"
                            maxLength={500}
                        />
                        <p className="mt-1 text-xs text-gray-500">{message.length}/500 characters</p>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button
                        className="bg-amber-700 hover:bg-amber-800"
                        onClick={handleSubmit}
                        disabled={isSubmitting || userBooks.length === 0}
                    >
                        {isSubmitting ? (
                            <div className="flex items-center">
                                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                Sending Request...
                            </div>
                        ) : (
                            "Send Swap Request"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

interface BookSelectionCardProps {
    book: Book
    isSelected: boolean
    onSelect: () => void
}

function BookSelectionCard({ book, isSelected, onSelect }: BookSelectionCardProps) {
    return (
        <Card
            className={`cursor-pointer transition-all hover:shadow-md ${isSelected ? "border-amber-500 bg-amber-50 ring-2 ring-amber-200" : "hover:border-amber-300"
                }`}
            onClick={onSelect}
        >
            <CardContent className="p-3">
                <div className="flex items-center space-x-3">
                    <div className="h-16 w-11 flex-shrink-0 overflow-hidden bg-amber-100">
                        <img
                            src={book.coverUrl || "/placeholder.svg?height=80&width=55"}
                            alt={book.title}
                            className="h-full w-full object-cover"
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm line-clamp-1">{book.title}</h4>
                        <p className="text-xs text-gray-600 line-clamp-1">by {book.author}</p>
                        <div className="mt-1 flex items-center space-x-1">
                            <Badge variant="outline" className="text-xs border-amber-200 bg-amber-100 text-amber-800">
                                {book.genre}
                            </Badge>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">Condition: {book.condition}</p>
                    </div>
                    {isSelected && (
                        <div className="flex-shrink-0">
                            <div className="h-5 w-5 rounded-full bg-amber-500 flex items-center justify-center">
                                <div className="h-2 w-2 rounded-full bg-white" />
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

function BookSelectionSkeleton() {
    return (
        <Card>
            <CardContent className="p-3">
                <div className="flex items-center space-x-3">
                    <Skeleton className="h-16 w-11 flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-3 w-3/4" />
                        <Skeleton className="h-4 w-16 rounded-full" />
                        <Skeleton className="h-3 w-20" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
