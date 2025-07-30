"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Search, BookOpen } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { getBookApi } from "@/api/book"

export default function BooksPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [genre, setGenre] = useState("all")

  const { data, isLoading, isError } = useQuery({
    queryFn: getBookApi,
    queryKey: ["books"],
    select: (res) => res.data
  })

  const books = Array.isArray(data) ? data : []

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesGenre = genre === "all" || book.genre === genre

    return matchesSearch && matchesGenre
  })

  if (isLoading) {
    return <>Loading...</>
  }

  console.log(data)

  if (isError) {
    return <>Failed to load books.</>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold text-amber-900">Available Books</h1>
        <p className="text-lg text-amber-800">Browse books available for swapping</p>
      </div>

      {/* Search and Filter */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end">
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
          <Select value={genre} onValueChange={setGenre}>
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
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book) => (
            <Card key={book.id} className="overflow-hidden transition-all hover:shadow-lg">
              <div className="aspect-[2/2] bg-amber-100">
                <img
                  src={book.image ? `${process.env.NEXT_PUBLIC_BACKEND_HOST}${book.image}` : "/placeholder.svg"}
                  alt={book.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <CardHeader className="p-4 pb-0">
                <CardTitle className="line-clamp-1 text-lg">{book.title}</CardTitle>
                <CardDescription>by {book.author}</CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <div className="mb-2 flex items-center">
                  <span className="rounded-full bg-amber-100 px-2 py-1 text-xs text-amber-800">
                    {book.genre}
                  </span>
                  <span className="ml-2 text-xs text-gray-500 capitalize">{book.condition}</span>
                </div>
                <p className="line-clamp-2 text-sm text-gray-600">{book.desc}</p>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button asChild variant="outline" className="w-full border-amber-700 text-amber-700 hover:bg-amber-50">
                  <Link href={`/books/${book.id}`}>View Details</Link>
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-12 text-center">
            <BookOpen className="mx-auto mb-4 h-12 w-12 text-amber-300" />
            <h3 className="mb-2 text-xl font-semibold text-amber-900">No books found</h3>
            <p className="text-amber-800">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  )
}
