"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { BookOpen, ChevronRight } from "lucide-react"
import { useGenreSections } from "@/lib/queries"
import type { GenreSection, Book } from "@/lib/types"
import Image from "next/image"

const genreIcons: Record<string, string> = {
    fiction: "📚",
    "non-fiction": "📖",
    mystery: "🔍",
    "sci-fi": "🚀",
    fantasy: "🐉",
    romance: "💕",
    biography: "👤",
    history: "🏛️",
    "self-help": "💪",
    children: "🧸",
    other: "📝",
}

const genreColors: Record<string, string> = {
    fiction: "bg-blue-100 text-blue-800",
    "non-fiction": "bg-green-100 text-green-800",
    mystery: "bg-purple-100 text-purple-800",
    "sci-fi": "bg-cyan-100 text-cyan-800",
    fantasy: "bg-pink-100 text-pink-800",
    romance: "bg-red-100 text-red-800",
    biography: "bg-yellow-100 text-yellow-800",
    history: "bg-orange-100 text-orange-800",
    "self-help": "bg-indigo-100 text-indigo-800",
    children: "bg-emerald-100 text-emerald-800",
    other: "bg-gray-100 text-gray-800",
}

export default function GenreSections() {
    const { data: genreSections, isLoading, error } = useGenreSections()

    if (error) {
        return (
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="rounded-lg bg-red-50 p-8 text-center">
                        <BookOpen className="mx-auto mb-4 h-12 w-12 text-red-300" />
                        <h3 className="mb-2 text-xl font-semibold text-red-900">Unable to Load Genre Sections</h3>
                        <p className="text-red-800">Please try again later</p>
                    </div>
                </div>
            </section>
        )
    }

    if (isLoading) {
        return (
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="space-y-16">
                        {Array.from({ length: 3 }).map((_, index) => (
                            <GenreSectionSkeleton key={index} />
                        ))}
                    </div>
                </div>
            </section>
        )
    }

    if (!genreSections || genreSections.length === 0) {
        return (
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="py-12 text-center">
                        <BookOpen className="mx-auto mb-4 h-12 w-12 text-amber-300" />
                        <h3 className="mb-2 text-xl font-semibold text-amber-900">No Books Available</h3>
                        <p className="mb-4 text-amber-800">Be the first to add books to our collection</p>
                        <Button asChild className="bg-amber-700 hover:bg-amber-800">
                            <Link href="/dashboard/add-book">Add a Book</Link>
                        </Button>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="py-16">
            <div className="container mx-auto px-4">
                <div className="space-y-16">
                    {genreSections.map((section) => (
                        <GenreSectionComponent key={section.genre} section={section} />
                    ))}
                </div>
            </div>
        </section>
    )
}

interface GenreSectionComponentProps {
    section: GenreSection
}

function GenreSectionComponent({ section }: GenreSectionComponentProps) {
    const { genre, displayName, books, totalCount } = section
    const icon = genreIcons[genre] || "📚"
    const colorClass = genreColors[genre] || "bg-gray-100 text-gray-800"

    return (
        <div>
            <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center">
                    <span className="mr-3 text-3xl">{icon}</span>
                    <div>
                        <h2 className="text-2xl font-bold text-amber-900">{displayName}</h2>
                        <p className="text-amber-800">
                            {totalCount} book{totalCount !== 1 ? "s" : ""} available
                        </p>
                    </div>
                </div>
                <Button asChild variant="outline" className="border-amber-700 text-amber-700 hover:bg-amber-100 bg-transparent">
                    <Link href={`/books?genre=${genre}`} className="flex items-center">
                        View All
                        <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {books.map((book) => (
                    <GenreBookCard key={book.id} book={book} genre={genre} colorClass={colorClass} />
                ))}
            </div>
        </div>
    )
}

interface GenreBookCardProps {
    book: Book
    genre: string
    colorClass: string
}

function GenreBookCard({ book, genre, colorClass }: GenreBookCardProps) {
    return (
        <Card className="group overflow-hidden transition-all hover:shadow-lg hover:scale-105">
            <div className="aspect-[2/2] bg-amber-100">
                <Image
                    width={500}
                    height={500}
                    src={`${process.env.NEXT_PUBLIC_BACKEND_HOST}${book?.image}` || "/placeholder.svg?height=300&width=200"}
                    alt={book?.title}
                    crossOrigin="use-credentials"
                    className="h-full w-full object-cover transition-transform group-hover:scale-110"
                />
            </div>
            <CardHeader className="p-4 pb-2">
                <div className="mb-2 flex items-center justify-between">
                    <span className={`rounded-full px-2 py-1 text-xs ${colorClass}`}>{book.genre}</span>
                    <span className="text-xs text-gray-500">{book.condition}</span>
                </div>
                <CardTitle className="line-clamp-1 text-lg">{book.title}</CardTitle>
                <CardDescription>by {book.author}</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <p className="line-clamp-2 text-sm text-gray-600">{book.description}</p>
                <div className="mt-2 flex items-center text-xs text-amber-700">
                    <span>
                        Owner: {book.owner.firstName} {book.owner.lastName}
                    </span>
                </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
                <Button
                    asChild
                    variant="outline"
                    className="w-full border-amber-700 text-amber-700 hover:bg-amber-50 bg-transparent"
                >
                    <Link href={`/books/${book.id}`}>View Details</Link>
                </Button>
            </CardFooter>
        </Card>
    )
}

function GenreSectionSkeleton() {
    return (
        <div>
            <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center">
                    <Skeleton className="mr-3 h-8 w-8 rounded" />
                    <div>
                        <Skeleton className="mb-2 h-8 w-48" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                </div>
                <Skeleton className="h-10 w-24" />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => (
                    <Card key={index} className="overflow-hidden">
                        <div className="aspect-[2/3] bg-gray-200">
                            <Skeleton className="h-full w-full" />
                        </div>
                        <CardHeader className="p-4 pb-2">
                            <div className="mb-2 flex items-center justify-between">
                                <Skeleton className="h-5 w-16 rounded-full" />
                                <Skeleton className="h-4 w-12" />
                            </div>
                            <Skeleton className="h-6 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <Skeleton className="mb-1 h-3 w-full" />
                            <Skeleton className="mb-2 h-3 w-4/5" />
                            <Skeleton className="h-3 w-24" />
                        </CardContent>
                        <CardFooter className="p-4 pt-0">
                            <Skeleton className="h-9 w-full" />
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}
