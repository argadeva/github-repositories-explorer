export interface Repository {
  id: number;
  name: string;
  description: string;
  stargazers_count: number;
  html_url: string;
}

export interface User {
  login: string;
}

export interface FindUsers {
  total_count: number;
  items: User[];
}