"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, BookOpen, User, Star, ShieldCheck, AlertCircle, CheckCircle } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { getBookByIdApi } from "@/api/book"
import useAuthStore from "@/store/useAuthStore"
import { useCreateSwapRequest } from "@/lib/queries"
import { Alert, AlertDescription } from "@/components/ui/alert"
import SwapRequestDialog from "@/components/swap/swap-request-dialog"

export default function BookDetailPage() {
  const params = useParams()
  const id = params.id as string

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const { data, isLoading, isError } = useQuery({
    queryFn: () => getBookByIdApi({ id }),
    queryKey: ["books", id],
    enabled: !!id,
    select: (res) => res.data,
  })

  const [isSwapDialogOpen, setIsSwapDialogOpen] = useState(false)
  const [swapMessage, setSwapMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [successMessage, setSuccessMessage] = useState("")

  // Swap request mutation
  const createSwapMutation = useCreateSwapRequest({
    onSuccess: () => {
      setIsSwapDialogOpen(false)
      setSuccessMessage("Swap request sent successfully! The book owner will be notified.")
      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(""), 5000)
    },
    onError: (error) => {
      console.error("Failed to create swap request:", error)
    },
  })




  const handleSwapRequest = (data1: { offeredBookId: string; message: string }) => {
    if (!data1) return

    createSwapMutation.mutate({
      bookId: data.id,
      offeredBookId: data1.offeredBookId,
      message: data1.message,
    })


  }

  const canRequestSwap = () => {
    if (!isAuthenticated) return false

    // Book must be approved
    if (data?.approvalRequest?.status !== "approved") return false
    return true
  }

  if (isLoading) {
    return <div className="text-center py-20 text-amber-700">Loading book details...</div>
  }

  if (isError || !data) {
    return (
      <div className="container mx-auto flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-12">
        <BookOpen className="mb-4 h-16 w-16 text-amber-300" />
        <h1 className="mb-2 text-2xl font-bold text-amber-900">Book Not Found</h1>
        <p className="mb-6 text-amber-800">The book you're looking for doesn't exist or has been removed.</p>
        <Button asChild variant="outline" className="border-amber-700 text-amber-700 hover:bg-amber-50">
          <Link href="/books">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Books
          </Link>
        </Button>
      </div>
    )
  }

  const {
    title,
    author,
    genre,
    condition,
    description,
    noOfPages,
    language,
    publishedYear,
    image,
    owner,
    approvalStatus,
  } = data

  return (
    <div className="container mx-auto px-4 py-8">
      <Button asChild variant="ghost" className="mb-6 text-amber-700 hover:bg-amber-50">
        <Link href="/books">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Books
        </Link>
      </Button>

      {/* Success Message */}
      {successMessage && (
        <Alert className="mb-6 border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
        </Alert>
      )}


      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Book Cover */}
        <div className="md:col-span-1">
          <Card className="overflow-hidden">
            <div className="aspect-[2/2] bg-amber-100">
              <img src={image ? `${process.env.NEXT_PUBLIC_BACKEND_HOST}${image}` : "/placeholder.svg"} alt={title} className="h-full w-full object-cover" crossOrigin="use-credentials" />
            </div>
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <User className="h-4 w-4 text-amber-700" />
                <span>Owner: {owner?.name || "Unknown"}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Star className="h-4 w-4 text-amber-500" />
                <span>Condition: {condition}</span>
              </div>
              {approvalStatus && (
                <div className="flex items-center gap-2 text-gray-600">
                  <ShieldCheck className="h-4 w-4 text-amber-600" />
                  <span>Status: {approvalStatus.charAt(0).toUpperCase() + approvalStatus.slice(1)}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Book Details */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{title}</CardTitle>
              <CardDescription className="text-lg">by {author}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-sm text-amber-800">
                  {genre}
                </span>
              </div>

              <div>
                <h3 className="mb-2 text-lg font-semibold text-amber-900">Description</h3>
                <p className="text-gray-600">{description}</p>
              </div>

              <div>
                <h3 className="mb-2 text-lg font-semibold text-amber-900">Details</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>
                    <span className="font-medium">Condition:</span> {condition}
                  </li>
                  <li>
                    <span className="font-medium">Pages:</span> {noOfPages ?? "Unknown"}
                  </li>
                  <li>
                    <span className="font-medium">Language:</span> {language ?? "English"}
                  </li>
                  <li>
                    <span className="font-medium">Published:</span> {publishedYear ?? "Unknown"}
                  </li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              {!isAuthenticated ? (
                <div className="w-full space-y-2">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>You need to be logged in to request book swaps.</AlertDescription>
                  </Alert>
                  <Button asChild className="w-full bg-amber-700 hover:bg-amber-800">
                    <Link href="/login">Login to Request Swap</Link>
                  </Button>
                </div>
              ) : !canRequestSwap() ? (
                <div className="w-full">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {data?.approvalRequest?.status !== "approved"
                        ? "This book is not available for swapping yet."
                        : "This book is not available for swapping."}
                    </AlertDescription>
                  </Alert>
                </div>
              ) : (
                <Button className="w-full bg-amber-700 hover:bg-amber-800" onClick={() => setIsSwapDialogOpen(true)}>
                  Request Book Swap
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
      {data && (
        <SwapRequestDialog
          isOpen={isSwapDialogOpen}
          onClose={() => setIsSwapDialogOpen(false)}
          targetBook={data}
          onSubmit={handleSwapRequest}
          isSubmitting={createSwapMutation.isPending}
        />
      )}
    </div>
  )
}
