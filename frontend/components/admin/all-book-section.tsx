"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, Eye, Trash2 } from "lucide-react"
import type { Book, BookFilters } from "@/lib/types"

interface AllBooksSectionProps {
  books: Book[]
  isLoading: boolean
  filters: BookFilters
  onFiltersChange: (filters: BookFilters) => void
}

export default function AllBooksSection({ books, isLoading, filters, onFiltersChange }: AllBooksSectionProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    onFiltersChange({ ...filters, search: value || undefined })
  }

  const handleGenreChange = (value: string) => {
    onFiltersChange({
      ...filters,
      genre: value === "all" ? undefined : (value as any),
    })
  }

  const handleStatusChange = (value: string) => {
    onFiltersChange({
      ...filters,
      status: value === "all" ? undefined : (value as any),
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-amber-900">All Books</h2>
        <div className="flex items-center space-x-4">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              placeholder="Search books..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
          <Select value={filters.genre || "all"} onValueChange={handleGenreChange}>
            <SelectTrigger className="w-40">
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
          <Select value={filters.status || "all"} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-40">
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
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Book Inventory</CardTitle>
          <CardDescription>Manage all books in the system</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <BooksTableSkeleton />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-2 pr-4 pt-2 font-medium">Cover</th>
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
                  {books.map((book) => (
                    <tr key={book.id} className="border-b">
                      <td className="py-3 pr-4">
                        <div className="h-12 w-8 overflow-hidden bg-amber-100">
                          <img
                            src={book.coverUrl || "/placeholder.svg?height=60&width=40"}
                            alt={book.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="py-3 pr-4">
                        <div>
                          <p className="font-medium">{book.title}</p>
                          <p className="text-sm text-gray-500 line-clamp-1">{book.description}</p>
                        </div>
                      </td>
                      <td className="py-3 pr-4">{book.author}</td>
                      <td className="py-3 pr-4">
                        <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-800">
                          {book.genre}
                        </Badge>
                      </td>
                      <td className="py-3 pr-4">
                        {book.owner.firstName} {book.owner.lastName}
                      </td>
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
                      <td className="py-3 pr-4">{new Date(book.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 pr-4">
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 border-amber-700 text-amber-700 hover:bg-amber-50 bg-transparent"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 border-red-600 text-red-600 hover:bg-red-50 bg-transparent"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function BooksTableSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="flex items-center space-x-4">
          <Skeleton className="h-12 w-8" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3 w-32" />
          </div>
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-4 w-20" />
          <div className="flex space-x-2">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      ))}
    </div>
  )
}
