import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import ChevronUpIcon from "./assets/chevron_up.svg";
import ChevronDownIcon from "./assets/chevron_down.svg";
import StarIcon from "./assets/star.svg";
import { User } from './types/github';
import { fetchRepositories } from './utils/api';

export default function CardDetails({ login }: User) {
  const [isOpen, setIsOpen] = useState(false);

  const { 
    data, 
    isLoading, 
    isError, 
    error 
  } = useQuery({
    queryKey: ['repositories', login],
    queryFn: () => fetchRepositories(login),
    enabled: !!login && isOpen,
    retry: 1,
  });

  const toggleAccordion = () => setIsOpen(!isOpen);

  return (
    <>
      <div className="bg-gray-100 flex justify-between items-center">
        <h2 className="pl-4 text-xl">{login}</h2>
        <button
          className="cursor-pointer py-2 px-2"
          onClick={toggleAccordion}
        >
          {isOpen ? (
            <img src={ChevronUpIcon} alt="Collapse Up" className="h-8 w-8" />
          ) : (
            <img src={ChevronDownIcon} alt="Collapse Down" className="h-8 w-8" />
          )}
        </button>
      </div>

      {isOpen && (
        <div className="flex flex-col gap-4 pl-6">
          {isLoading && (
            <div className="p-4 bg-gray-200">
              <p>Loading repositories...</p>
            </div>
          )}
          {isError ? (
            <div className="p-4 bg-red-100 text-red-700">
              <p>Error: {error.message}</p>
              <p className="text-sm mt-2">Please try again later</p>
            </div>
          ) : data?.length === 0 ? (
            <div className="p-4 bg-gray-200">
              <p>No repositories found</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {data?.map((repo, index) => (
                <div key={index} className="bg-gray-200 p-4 flex flex-row justify-between gap-4">
                  <div className="flex flex-col flex-1">
                    <h2 className="font-bold text-2xl">
                      {repo.name}
                    </h2>
                    <p className="text-md">
                      {repo.description || 'No description available'}
                    </p>
                  </div>
                  <div className="flex flex-row gap-2 font-bold">
                    <p>{repo.stargazers_count}</p>
                    <img src={StarIcon} alt="Collapse Down" className="h-5 w-5 mt-[0.1rem]" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}