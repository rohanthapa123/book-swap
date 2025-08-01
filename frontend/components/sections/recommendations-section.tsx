"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { BookOpen, Star, TrendingUp } from "lucide-react"
import { useBookRecommendations } from "@/lib/queries"
import { Book } from "@/lib/types"
import Image from "next/image"

interface RecommendationsSectionProps {
    limit?: number
    showTitle?: boolean
}

export default function RecommendationsSection({ limit = 8, showTitle = true }: RecommendationsSectionProps) {
    const { data: recommendations, isLoading, error } = useBookRecommendations(limit)

    console.log(recommendations, "recommendations")

    if (error) {
        return (
            <section className="py-16">
                <div className="container mx-auto px-4">
                    {showTitle && (
                        <div className="mb-12 text-center">
                            <h2 className="mb-4 text-3xl font-bold text-amber-900">Recommended for You</h2>
                            <p className="text-lg text-amber-800">Discover books tailored to your reading preferences</p>
                        </div>
                    )}
                    <div className="rounded-lg bg-red-50 p-8 text-center">
                        <BookOpen className="mx-auto mb-4 h-12 w-12 text-red-300" />
                        <h3 className="mb-2 text-xl font-semibold text-red-900">Unable to Load Recommendations</h3>
                        <p className="text-red-800">Please try again later</p>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="py-16">
            <div className="container mx-auto px-4">
                {showTitle && (
                    <div className="mb-12 text-center">
                        <div className="mb-4 flex items-center justify-center">
                            <TrendingUp className="mr-2 h-8 w-8 text-amber-700" />
                            <h2 className="text-3xl font-bold text-amber-900">Recommended for You</h2>
                        </div>
                        <p className="text-lg text-amber-800">Discover books tailored to your reading preferences</p>
                    </div>
                )}

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {isLoading
                        ? Array.from({ length: limit }).map((_, index) => <RecommendationCardSkeleton key={index} />)
                        : recommendations?.map((recommendation) => (
                            <RecommendationCard key={recommendation?.id} recommendation={recommendation} />
                        ))}
                </div>

                {!isLoading && recommendations && recommendations.length === 0 && (
                    <div className="py-12 text-center">
                        <BookOpen className="mx-auto mb-4 h-12 w-12 text-amber-300" />
                        <h3 className="mb-2 text-xl font-semibold text-amber-900">No Recommendations Yet</h3>
                        <p className="mb-4 text-amber-800">Add some books to your collection to get personalized recommendations</p>
                        <Button asChild className="bg-amber-700 hover:bg-amber-800">
                            <Link href="/dashboard/add-book">Add Your First Book</Link>
                        </Button>
                    </div>
                )}

                {!isLoading && recommendations && recommendations.length > 0 && (
                    <div className="mt-8 text-center">
                        <Button
                            asChild
                            variant="outline"
                            className="border-amber-700 text-amber-700 hover:bg-amber-100 bg-transparent"
                        >
                            <Link href="/books">View All Books</Link>
                        </Button>
                    </div>
                )}
            </div>
        </section>
    )
}

interface RecommendationCardProps {
    recommendation: Book
}

function RecommendationCard({ recommendation: book }: RecommendationCardProps) {


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
                    <div className="flex items-center">
                        <Star className="mr-1 h-4 w-4 fill-amber-400 text-amber-400" />
                    </div>
                    <span className="rounded-full bg-amber-100 px-2 py-1 text-xs text-amber-800">{book?.genre}</span>
                </div>
                <CardTitle className="line-clamp-1 text-lg">{book?.title}</CardTitle>
                <CardDescription>by {book?.author}</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <p className="line-clamp-2 text-sm text-gray-600">{book?.description}</p>
            </CardContent>
            <CardFooter className="p-4 pt-0">
                <Button
                    asChild
                    variant="outline"
                    className="w-full border-amber-700 text-amber-700 hover:bg-amber-50 bg-transparent"
                >
                    <Link href={`/books/${book?.id}`}>View Details</Link>
                </Button>
            </CardFooter>
        </Card>
    )
}

function RecommendationCardSkeleton() {
    return (
        <Card className="overflow-hidden">
            <div className="aspect-[2/3] bg-gray-200">
                <Skeleton className="h-full w-full" />
            </div>
            <CardHeader className="p-4 pb-2">
                <div className="mb-2 flex items-center justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <Skeleton className="mb-2 h-3 w-full" />
                <Skeleton className="h-3 w-4/5" />
                <Skeleton className="h-3 w-3/5" />
            </CardContent>
            <CardFooter className="p-4 pt-0">
                <Skeleton className="h-9 w-full" />
            </CardFooter>
        </Card>
    )
}
