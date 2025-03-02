import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import ChevronUpIcon from './assets/chevron_up.svg'
import ChevronDownIcon from './assets/chevron_down.svg'
import StarIcon from './assets/star.svg'
import { User } from './types/github'
import { fetchRepositories } from './utils/api'

export default function CardDetails({ login }: User) {
  const [isOpen, setIsOpen] = useState(false)

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['repositories', login],
    queryFn: () => fetchRepositories(login),
    enabled: !!login && isOpen,
    retry: 1,
  })

  const toggleAccordion = () => setIsOpen(!isOpen)

  return (
    <>
      <div className="flex items-center justify-between bg-gray-100">
        <h2 className="pl-4 text-xl">{login}</h2>
        <button className="cursor-pointer px-2 py-2" onClick={toggleAccordion}>
          {isOpen ? (
            <img src={ChevronUpIcon} alt="Collapse Up" className="h-8 w-8" />
          ) : (
            <img
              src={ChevronDownIcon}
              alt="Collapse Down"
              className="h-8 w-8"
            />
          )}
        </button>
      </div>

      {isOpen && (
        <div className="flex flex-col gap-4 pl-6">
          {isLoading && (
            <div className="bg-gray-200 p-4">
              <p>Loading repositories...</p>
            </div>
          )}
          {isError ? (
            <div className="bg-red-100 p-4 text-red-700">
              <p>Error: {error.message}</p>
              <p className="mt-2 text-sm">Please try again later</p>
            </div>
          ) : data?.length === 0 ? (
            <div className="bg-gray-200 p-4">
              <p>No repositories found</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {data?.map((repo, index) => (
                <div
                  key={index}
                  className="flex flex-row justify-between gap-4 bg-gray-200 p-4"
                >
                  <div className="flex flex-1 flex-col">
                    <h2 className="text-2xl font-bold">{repo.name}</h2>
                    <p className="text-md">
                      {repo.description || 'No description available'}
                    </p>
                  </div>
                  <div className="flex flex-row gap-2 font-bold">
                    <p>{repo.stargazers_count}</p>
                    <img
                      src={StarIcon}
                      alt="Collapse Down"
                      className="mt-[0.1rem] h-5 w-5"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  )
}
