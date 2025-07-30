import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Book recommendation function
export function getRecommendedBooks(userBooks: any[], allBooks: any[], limit = 4) {
  // In a real app, this would be a more sophisticated algorithm
  // For now, we'll just filter out books the user already owns and return some random ones

  // Get the genres the user seems to like
  const userGenres = userBooks.map((book) => book.genre)

  // Filter books that the user doesn't own and prioritize matching genres
  const filteredBooks = allBooks.filter((book) => !userBooks.some((userBook) => userBook.id === book.id))

  // Sort by genre match (books with genres the user likes come first)
  const sortedBooks = filteredBooks.sort((a, b) => {
    const aGenreMatch = userGenres.includes(a.genre) ? 1 : 0
    const bGenreMatch = userGenres.includes(b.genre) ? 1 : 0
    return bGenreMatch - aGenreMatch
  })

  // Return the top N recommendations
  return sortedBooks.slice(0, limit)
}

// Format date helper
export function formatDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}
