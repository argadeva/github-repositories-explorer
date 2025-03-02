import { FindUsers, Repository } from '../types/github';

const headers = {
  'Authorization': `Bearer ${import.meta.env.VITE_GITHUB_API_KEY}`,
};

export const fetchRepositories = async (username: string): Promise<Repository[]> => {
  const response = await fetch(`https://api.github.com/users/${username}/repos`, {
    headers
  });
  if (!response.ok) {
    throw new Error('Failed to fetch repositories');
  }
  return response.json();
};

export const fetchUsers = async (username: string='', pageParam: number=1): Promise<FindUsers> => {
  const response = await fetch(
    `https://api.github.com/search/users?q=${username}&page=${pageParam}&per_page=10`,
    {
      headers
    }
  );
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  return response.json();
};