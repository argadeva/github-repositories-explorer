import { useEffect, useRef, useState } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import CardDetails from './DetailUser'
import { fetchUsers } from './utils/api'

export default function FindUsers() {
  const loadMoreRef = useRef(null)
  const [username, setUsername] = useState('')

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    isLoading,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['users', username],
    queryFn: ({ pageParam = 1 }) => fetchUsers(username, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      const totalPages = Math.ceil(lastPage.total_count / 10)
      const nextPage = pages.length + 1
      return nextPage <= totalPages ? nextPage : undefined
    },
    enabled: false,
  })

  const handleSearch = () => {
    if (username.trim() !== '') {
      refetch()
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 0.5 }
    )

    const currentElement = loadMoreRef.current
    if (currentElement) {
      observer.observe(currentElement)
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement)
      }
    }
  }, [loadMoreRef, hasNextPage, fetchNextPage, isFetchingNextPage])

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLDivElement>
  ) => {
    if (e.key === 'Enter' && document.activeElement?.tagName === 'INPUT') {
      handleSearch()
    }
  }

  return (
    <section className="bg-gray-100" data-testid="find-users">
      <div className="mx-auto min-h-lvh w-full bg-white p-6 md:max-w-lg">
        <div className="mb-4 flex flex-col gap-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter username"
            className="rounded border-3 border-gray-200 bg-gray-100 p-4"
            aria-label="Search GitHub users"
          />
          <button
            onClick={handleSearch}
            className="cursor-pointer rounded bg-sky-500 py-4 text-white"
            disabled={isLoading}
            aria-label="Search"
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
          {status === 'error' && (
            <p className="text-red-500">
              Error fetching users. Please try again.
            </p>
          )}
          {status === 'success' && data.pages[0].total_count === 0 && (
            <p className="text-gray-600">No users found for "{username}"</p>
          )}
          {status === 'success' && data.pages[0].total_count > 0 && (
            <p className="text-gray-600">Showing users for "{username}"</p>
          )}
          <div className="flex flex-col gap-4">
            {data?.pages?.map((page, pageIndex) => {
              return (
                <div key={pageIndex} className="flex flex-col gap-4">
                  {page?.items?.map((user, index) => (
                    <CardDetails key={index} login={user?.login} />
                  ))}
                </div>
              )
            })}
          </div>
          {isFetchingNextPage && (
            <p className="py-4 text-center text-sky-600">Loading more...</p>
          )}
          {hasNextPage && <div ref={loadMoreRef} className="h-10" />}
        </div>
      </div>
    </section>
  )
}
