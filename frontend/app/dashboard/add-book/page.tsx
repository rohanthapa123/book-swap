"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import Link from "next/link"

import { ArrowLeft, Upload, BookOpen } from "lucide-react"
import { useState } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createBookApi } from "@/api/book"

// Validation schema
const BookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  desc: z.string().min(1, "Description is required"),
  genre: z.string().min(1, "Genre is required"),
  condition: z.string().min(1, "Condition is required"),
  language: z.string().min(1),
  publishedYear: z
    .string()
    .min(4)
    .regex(/^\d{4}$/, "Enter a valid year"),
  noOfPages: z.string().regex(/^\d+$/, "Enter a valid number"),
  isbn: z.string().min(10, "Enter valid ISBN").max(13, "ISBN too long"),
})

type BookFormData = z.infer<typeof BookSchema>

export default function AddBookPage() {
  const router = useRouter()
  const [coverImage, setCoverImage] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<BookFormData>({
    resolver: zodResolver(BookSchema),
    defaultValues: {
      language: "English",
    },
  })

  const mutation = useMutation({
    mutationFn: createBookApi,
    onSuccess: () => {
      router.push("/dashboard?success=book-added")
    },
    onError: (error) => {
      console.error("Error submitting book:", error)
    },
  })

  const onSubmit = async (data: BookFormData) => {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value)
    })
    if (coverImage) formData.append("image", coverImage)

    mutation.mutate(formData)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setCoverImage(file)

      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setCoverPreview(event.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button asChild variant="ghost" className="mb-6 text-amber-700 hover:bg-amber-50">
        <Link href="/dashboard">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </Button>

      <div className="mx-auto max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Add a New Book</CardTitle>
            <CardDescription>Share a book from your collection that you'd like to swap with others.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              {/* Image Upload */}
              <div className="space-y-2">
                <Label htmlFor="cover">Book Cover</Label>
                <div className="flex items-start space-x-4">
                  <div className="h-40 w-32 border border-dashed bg-gray-50 rounded-md flex items-center justify-center">
                    {coverPreview ? (
                      <img
                        src={coverPreview}
                        alt="Cover Preview"
                        className="h-full w-full object-cover rounded-md"
                      />
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        <BookOpen className="mx-auto h-8 w-8 text-amber-300" />
                        <p className="text-xs">Upload cover image</p>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="cover-upload" className="cursor-pointer">
                      <div className="inline-flex items-center border border-amber-700 text-amber-700 hover:bg-amber-50 px-4 py-2 rounded-md">
                        <Upload className="mr-2 h-4 w-4" />
                        {coverPreview ? "Change Image" : "Upload Image"}
                      </div>
                      <Input type="file" id="cover-upload" className="hidden" accept="image/*" onChange={handleImageChange} />
                    </Label>
                    <p className="text-xs text-gray-500 mt-2">Recommended: JPEG/PNG, min 500x800px.</p>
                  </div>
                </div>
              </div>

              {/* Text Fields */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input id="title" {...register("title")} placeholder="Book title" />
                  {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
                </div>
                <div>
                  <Label htmlFor="author">Author *</Label>
                  <Input id="author" {...register("author")} placeholder="Author name" />
                  {errors.author && <p className="text-xs text-red-500">{errors.author.message}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="desc">Description *</Label>
                <Textarea id="desc" {...register("desc")} placeholder="Describe the book" />
                {errors.desc && <p className="text-xs text-red-500">{errors.desc.message}</p>}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="genre">Genre *</Label>
                  <Select onValueChange={(val: string) => setValue("genre", val)} defaultValue="">
                    <SelectTrigger>
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
                  {errors.genre && <p className="text-xs text-red-500">{errors.genre.message}</p>}
                </div>
                <div>
                  <Label htmlFor="condition">Condition *</Label>
                  <Select onValueChange={(val: string) => setValue("condition", val)} defaultValue="">
                    <SelectTrigger>
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
                  {errors.condition && <p className="text-xs text-red-500">{errors.condition.message}</p>}
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="language">Language</Label>
                  <Input id="language" {...register("language")} />
                </div>
                <div>
                  <Label htmlFor="publishedYear">Published Year</Label>
                  <Input id="publishedYear" {...register("publishedYear")} />
                  {errors.publishedYear && <p className="text-xs text-red-500">{errors.publishedYear.message}</p>}
                </div>
                <div>
                  <Label htmlFor="noOfPages">Pages</Label>
                  <Input id="noOfPages" {...register("noOfPages")} />
                  {errors.noOfPages && <p className="text-xs text-red-500">{errors.noOfPages.message}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="isbn">ISBN Number *</Label>
                <Input id="isbn" {...register("isbn")} />
                {errors.isbn && <p className="text-xs text-red-500">{errors.isbn.message}</p>}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="border-amber-700 text-amber-700 hover:bg-amber-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-amber-700 hover:bg-amber-800"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Submitting..." : "Add Book"}
              </Button>
            </CardFooter>
          </form>
        </Card>
        <div className="mt-4 text-center text-sm text-gray-500">
          <p>* Required fields</p>
          <p className="mt-2">Note: All books will be reviewed by our admins before being listed publicly.</p>
        </div>
      </div>
    </div>
  )
}
