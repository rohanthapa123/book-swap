"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Upload, BookOpen, AlertCircle, CheckCircle, Clock, XCircle } from "lucide-react"

import { useBook, useUpdateBook } from "@/lib/queries"
import type { UpdateBookRequest } from "@/lib/types"
import useAuthStore from "@/store/useAuthStore"

export default function EditBookPage() {
  const params = useParams()
  const router = useRouter()
  const { id } = useAuthStore((state) => state.user!)
  const bookId = params.id as string

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    genre: "",
    condition: "",
    language: "English",
    publishedYear: "",
    pages: "",
  })
  const [coverImage, setCoverImage] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)

  // Fetch book data
  const { data: book, isLoading, error: fetchError } = useBook(bookId)

  // Update book mutation
  const updateBookMutation = useUpdateBook({
    onSuccess: () => {
      setSuccess("Book updated successfully!")
      setError("")
      setTimeout(() => {
        router.push("/dashboard/books")
      }, 2000)
    },
    onError: (error: any) => {
      setError(error.response?.data?.message || "Failed to update book. Please try again.")
      setSuccess("")
    },
  })

  // Populate form when book data is loaded
  useEffect(() => {
    if (book) {
      console.log(book)
      console.log(book.owner.id, id, "book owner id and current user id")
      // Check if user owns this book
      if (book.owner.id !== id) {
        router.push("/dashboard/books")
        return
      }

      setFormData({
        title: book.title,
        author: book.author,
        description: book.description,
        genre: book.genre,
        condition: book.condition,
        language: book.language || "English",
        publishedYear: book.publishedYear?.toString() || "",
        pages: book.pages?.toString() || "",
      })
      setCoverPreview(book.coverUrl || null)
    }
  }, [book, id, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setCoverImage(file)

      // Create preview URL
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setCoverPreview(event.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    setSuccess("")

    try {
      const updateData: UpdateBookRequest = {
        id: bookId,
        title: formData.title,
        author: formData.author,
        description: formData.description,
        genre: formData.genre as any,
        condition: formData.condition as any,
        language: formData.language,
        publishedYear: formData.publishedYear ? Number.parseInt(formData.publishedYear) : undefined,
        pages: formData.pages ? Number.parseInt(formData.pages) : undefined,
        ...(coverImage && { coverImage }),
      }

      updateBookMutation.mutate(updateData)
    } catch (error) {
      setError("Failed to update book. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "approved":
        return {
          icon: <CheckCircle className="h-5 w-5 text-green-600" />,
          text: "Approved",
          description: "Your book is live and available for swapping",
          color: "bg-green-50 border-green-200",
        }
      case "pending":
        return {
          icon: <Clock className="h-5 w-5 text-amber-600" />,
          text: "Pending Review",
          description: "Your book is being reviewed by our admins",
          color: "bg-amber-50 border-amber-200",
        }
      case "rejected":
        return {
          icon: <XCircle className="h-5 w-5 text-red-600" />,
          text: "Rejected",
          description: "Your book needs some changes before it can be approved",
          color: "bg-red-50 border-red-200",
        }
      default:
        return {
          icon: <Clock className="h-5 w-5 text-gray-600" />,
          text: "Unknown",
          description: "Status unknown",
          color: "bg-gray-50 border-gray-200",
        }
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-3xl">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-48" />
            <div className="h-96 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    )
  }

  if (fetchError || !book) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-md text-center">
          <BookOpen className="mx-auto mb-4 h-16 w-16 text-amber-300" />
          <h1 className="mb-2 text-2xl font-bold text-amber-900">Book Not Found</h1>
          <p className="mb-6 text-amber-800">
            The book you're trying to edit doesn't exist or you don't have permission to edit it.
          </p>
          <Button
            asChild
            variant="outline"
            className="border-amber-700 text-amber-700 hover:bg-amber-50 bg-transparent"
          >
            <Link href="/dashboard/books">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to My Books
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  const statusInfo = getStatusInfo(book.status)

  return (
    <div className="container mx-auto px-4 py-8">
      <Button asChild variant="ghost" className="mb-6 text-amber-700 hover:bg-amber-50">
        <Link href="/dashboard/books">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to My Books
        </Link>
      </Button>

      <div className="mx-auto max-w-3xl">
        {/* Status Alert */}
        <Alert className={`mb-6 ${statusInfo.color}`}>
          <div className="flex items-center">
            {statusInfo.icon}
            <div className="ml-3">
              <h4 className="font-medium">Status: {statusInfo.text}</h4>
              <p className="text-sm">{statusInfo.description}</p>
            </div>
          </div>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Edit Book</CardTitle>
            <CardDescription>
              Update your book information. Changes will need admin approval if the book is already approved.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {/* Success/Error Messages */}
              {success && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">{success}</AlertDescription>
                </Alert>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Book Cover Upload */}
              <div className="space-y-2">
                <Label htmlFor="cover">Book Cover</Label>
                <div className="flex items-start space-x-4">
                  <div className="flex h-40 w-32 flex-col items-center justify-center rounded-md border border-dashed border-gray-300 bg-gray-50">
                    {coverPreview ? (
                      <img
                        src={coverPreview || "/placeholder.svg"}
                        alt="Book cover preview"
                        className="h-full w-full rounded-md object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center p-4 text-center">
                        <BookOpen className="mb-2 h-8 w-8 text-amber-300" />
                        <p className="text-xs text-gray-500">No cover image</p>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-center">
                      <Label
                        htmlFor="cover-upload"
                        className="flex w-full cursor-pointer items-center justify-center rounded-md border border-amber-700 bg-white px-4 py-2 text-sm font-medium text-amber-700 hover:bg-amber-50"
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        {coverPreview ? "Change Image" : "Upload Image"}
                      </Label>
                      <Input
                        id="cover-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </div>
                    <p className="text-xs text-gray-500">Recommended: JPEG or PNG, at least 500x800 pixels.</p>
                  </div>
                </div>
              </div>

              {/* Book Details */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Book Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Enter book title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="author">Author *</Label>
                  <Input
                    id="author"
                    name="author"
                    placeholder="Enter author name"
                    value={formData.author}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Brief description of the book"
                  className="min-h-[100px]"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="genre">Genre *</Label>
                  <Select value={formData.genre} onValueChange={(value) => handleSelectChange("genre", value)}>
                    <SelectTrigger id="genre">
                      <SelectValue placeholder="Select genre" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fiction">Fiction</SelectItem>
                      <SelectItem value="non-fiction">Non-Fiction</SelectItem>
                      <SelectItem value="mystery">Mystery</SelectItem>
                      <SelectItem value="sci-fi">Science Fiction</SelectItem>
                      <SelectItem value="fantasy">Fantasy</SelectItem>
                      <SelectItem value="romance">Romance</SelectItem>
                      <SelectItem value="biography">Biography</SelectItem>
                      <SelectItem value="history">History</SelectItem>
                      <SelectItem value="self-help">Self-Help</SelectItem>
                      <SelectItem value="children">Children's</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="condition">Condition *</Label>
                  <Select value={formData.condition} onValueChange={(value) => handleSelectChange("condition", value)}>
                    <SelectTrigger id="condition">
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="like-new">Like New</SelectItem>
                      <SelectItem value="very-good">Very Good</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                      <SelectItem value="poor">Poor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Input
                    id="language"
                    name="language"
                    placeholder="e.g., English"
                    value={formData.language}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="publishedYear">Published Year</Label>
                  <Input
                    id="publishedYear"
                    name="publishedYear"
                    type="number"
                    placeholder="e.g., 2020"
                    value={formData.publishedYear}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pages">Number of Pages</Label>
                  <Input
                    id="pages"
                    name="pages"
                    type="number"
                    placeholder="e.g., 320"
                    value={formData.pages}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Book Status Info */}
              <div className="rounded-lg bg-gray-50 p-4">
                <h4 className="mb-2 font-medium text-gray-900">Current Status</h4>
                <div className="flex items-center space-x-2">
                  <Badge className={statusInfo.color.replace("bg-", "bg-").replace("border-", "border-")}>
                    {statusInfo.icon}
                    <span className="ml-1">{statusInfo.text}</span>
                  </Badge>
                  <span className="text-sm text-gray-600">{statusInfo.description}</span>
                </div>
                {book.status === "approved" && (
                  <p className="mt-2 text-xs text-amber-600">
                    Note: Changes to approved books will require admin re-approval.
                  </p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="border-amber-700 text-amber-700 hover:bg-amber-50 bg-transparent"
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-amber-700 hover:bg-amber-800" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Book"}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <div className="mt-4 text-center text-sm text-gray-500">
          <p>* Required fields</p>
          <p className="mt-2">Last updated: {new Date(book.updatedAt).toLocaleString()}</p>
        </div>
      </div>
    </div>
  )
}
