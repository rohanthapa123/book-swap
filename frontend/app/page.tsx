"use client"
import { getBookApi } from "@/api/book"
import GenreSections from "@/components/sections/genre-sections"
import RecommendationsSection from "@/components/sections/recommendations-section"
import { Button } from "@/components/ui/button"
import useAuthStore from "@/store/useAuthStore"
import { useQuery } from "@tanstack/react-query"
import { BookCopy, BookOpen, RefreshCw, ThumbsUp } from "lucide-react"
import Link from "next/link"

export interface Book {

  id: string,
  image: string;
  author: string;
  title: string;
  noOfPages: string;
  desc: string;
  genre: string;
  approvalRequest: {
    status: string;
  }

}

export default function Home() {

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const { data, isLoading, isError } = useQuery({
    queryFn: getBookApi,
    queryKey: ["books"],
    select: (res) => res.data,
  })

  console.log(data)



  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-amber-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-6 text-5xl font-bold text-amber-900">BookSwap</h1>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-amber-800">
            Share your books with others and discover new reads from fellow book lovers.
          </p>
          <div className="flex justify-center gap-4">
            {!isAuthenticated && <Button asChild size="lg" className="bg-amber-700 hover:bg-amber-800">
              <Link href="/auth/signup">Join BookSwap</Link>
            </Button>}
            <Button asChild variant="outline" size="lg" className="border-amber-700 text-amber-700 hover:bg-amber-100">
              <Link href="/books">Browse Books</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Recommendations Section */}
      {isAuthenticated && <RecommendationsSection />}

      {/* Genre-based Sections */}
      {/* {isAuthenticated && <GenreSections />} */}

      {/* How It Works */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-amber-900">How BookSwap Works</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-amber-100 p-4">
                <BookOpen className="h-8 w-8 text-amber-700" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-amber-900">Add Your Books</h3>
              <p className="text-amber-800">List the books you're willing to swap with others.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-amber-100 p-4">
                <ThumbsUp className="h-8 w-8 text-amber-700" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-amber-900">Get Approved</h3>
              <p className="text-amber-800">Our admins verify your books to ensure quality.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-amber-100 p-4">
                <BookCopy className="h-8 w-8 text-amber-700" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-amber-900">Browse Books</h3>
              <p className="text-amber-800">Find books you'd like to read from other users.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-amber-100 p-4">
                <RefreshCw className="h-8 w-8 text-amber-700" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-amber-900">Swap Books</h3>
              <p className="text-amber-800">Exchange books with other members and enjoy reading!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Books */}
      {isLoading ? <>Loading...</> : isError ? <>Error ...</> : <section className="bg-amber-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-amber-900">Featured Books</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {data?.map((book: Book) => (
              <div
                key={book?.id}
                className="overflow-hidden rounded-lg bg-white shadow-md transition-transform hover:scale-105"
              >
                <div className="h-48 bg-amber-200">
                  <img
                    src={book?.image ? `${process.env.NEXT_PUBLIC_BACKEND_HOST}${book?.image}` : "/placeholder.svg"}
                    alt={book?.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="mb-1 text-lg font-semibold text-amber-900">{book?.title}</h3>
                  <p className="mb-2 text-sm text-amber-700">by {book?.author}</p>
                  <p className="mb-4 text-sm text-gray-600 line-clamp-2">{book?.desc}</p>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full border-amber-700 text-amber-700 hover:bg-amber-100"
                  >
                    <Link href={`/books/${book?.id}`}>View Details</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button asChild variant="outline" className="border-amber-700 text-amber-700 hover:bg-amber-100">
              <Link href="/books">View All Books</Link>
            </Button>
          </div>
        </div>
      </section>}

      {/* Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-amber-900">What Our Users Say</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="rounded-lg bg-white p-6 shadow-md">
                <p className="mb-4 italic text-gray-600">"{testimonial.text}"</p>
                <div className="flex items-center">
                  <div className="mr-4 h-12 w-12 overflow-hidden rounded-full bg-amber-200">
                    <img
                      src={testimonial.avatarUrl || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-amber-900">{testimonial.name}</p>
                    <p className="text-sm text-amber-700">{testimonial.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-amber-700 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-6 text-3xl font-bold">Ready to Start Swapping?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg">
            Join our community of book lovers today and start exchanging books with readers around you.
          </p>
          <Button asChild size="lg" className="bg-white text-amber-700 hover:bg-amber-100">
            <Link href="/signup">Sign Up Now</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}



const testimonials = [
  {
    text: "BookSwap has completely changed how I read! I've discovered so many amazing books I wouldn't have found otherwise.",
    name: "Sarah Johnson",
    location: "New York, NY",
    avatarUrl: "/placeholder.svg?height=100&width=100",
  },
  {
    text: "I love the community aspect of BookSwap. It's not just about the books, but connecting with fellow readers.",
    name: "Michael Chen",
    location: "San Francisco, CA",
    avatarUrl: "/placeholder.svg?height=100&width=100",
  },
  {
    text: "As an avid reader on a budget, BookSwap has been a game-changer. I've swapped over 30 books in just six months!",
    name: "Emma Williams",
    location: "Chicago, IL",
    avatarUrl: "/placeholder.svg?height=100&width=100",
  },
]
