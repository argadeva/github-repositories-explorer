import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useQuery } from '@tanstack/react-query'
import { fetchRepositories } from '../utils/api'
import CardDetails from '../DetailUser'

vi.mock('@tanstack/react-query')
vi.mock('../utils/api', () => ({
  fetchRepositories: vi.fn(),
}))

describe('CardDetails Component', () => {
  const login = 'testuser'
  const mockData = [
    { id: 1, name: 'Repo 1' },
    { id: 2, name: 'Repo 2' },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls fetchRepositories on button click', async () => {
    fetchRepositories.mockResolvedValueOnce(mockData)

    useQuery.mockImplementation(({ queryKey, queryFn }) => {
      expect(queryKey).toEqual(['repositories', login])
      return { data: queryFn(), isLoading: false, isError: false, error: null }
    })

    render(<CardDetails login={login} />)
    fireEvent.click(screen.getByRole('button'))

    await waitFor(() => expect(fetchRepositories).toHaveBeenCalledWith(login))
  })

  it('renders fetched repositories', async () => {
    useQuery.mockReturnValue({
      data: mockData,
      isLoading: false,
      isError: false,
      error: null,
    })

    render(<CardDetails login={login} />)
    fireEvent.click(screen.getByRole('button'))

    await waitFor(() => {
      expect(screen.getByText('Repo 1')).toBeInTheDocument()
      expect(screen.getByText('Repo 2')).toBeInTheDocument()
    })
  })

  it('displays loading state when fetching repositories', async () => {
    useQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
    })

    render(<CardDetails login={login} />)
    fireEvent.click(screen.getByRole('button'))

    await waitFor(() =>
      expect(screen.getByText('Loading repositories...')).toBeInTheDocument()
    )
  })

  it('displays message when no repositories are found', async () => {
    useQuery.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      error: null,
    })

    render(<CardDetails login={login} />)
    fireEvent.click(screen.getByRole('button'))

    await waitFor(() =>
      expect(screen.getByText('No repositories found')).toBeInTheDocument()
    )
  })

  it('toggles repository list visibility on button click', async () => {
    useQuery.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      error: null,
    })

    render(<CardDetails login={login} />)
    const button = screen.getByRole('button')

    fireEvent.click(button)
    await waitFor(() =>
      expect(screen.getByText('No repositories found')).toBeInTheDocument()
    )

    fireEvent.click(button)
    expect(screen.queryByText('No repositories found')).not.toBeInTheDocument()
  })

  it('displays error message when fetching fails', async () => {
    const errorMessage = 'Network error'

    useQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error(errorMessage),
    })

    render(<CardDetails login={login} />)
    fireEvent.click(screen.getByRole('button'))

    await waitFor(() =>
      expect(screen.getByText('Please try again later')).toBeInTheDocument()
    )
  })
})
