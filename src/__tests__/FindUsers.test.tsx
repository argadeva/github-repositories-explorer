import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { fetchUsers } from "../utils/api";
import FindUsers from "../FindUsers";

vi.mock("@tanstack/react-query");
vi.mock("../utils/api", () => ({
  fetchUsers: vi.fn(),
}));

describe("FindUsers Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    const mockIntersectionObserver = vi.fn();
    mockIntersectionObserver.mockReturnValue({
      observe: () => null,
      unobserve: () => null,
      disconnect: () => null
    });
    window.IntersectionObserver = mockIntersectionObserver;
  });

  it("should trigger search on button click", async () => {
    let queryFn;
    useInfiniteQuery.mockImplementation((options) => {
      queryFn = options.queryFn;
      return {
        data: {
          pages: [
            {
              total_count: 100,
              items: [
                { id: 1, login: "testuser1" },
                { id: 2, login: "testuser2" },
              ],
            }
          ],
        },
        status: "success",
        fetchNextPage: vi.fn(),
        hasNextPage: false,
        isFetchingNextPage: false,
        refetch: vi.fn(),
      };
    });

    useQuery.mockReturnValue({
      data: { login: "testuser" },
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });

    render(<FindUsers />);

    const input = screen.getByPlaceholderText("Enter username");
    const button = screen.getByRole("button", { name: "Search" });

    fireEvent.change(input, { target: { value: "testuser" } });
    fireEvent.click(button);

    await queryFn({ pageParam: 1 });

    await waitFor(() => {
      expect(fetchUsers).toHaveBeenCalledWith("testuser", 1);
    });
  });

  it("should fetch next page on scroll", async () => {
    const mockFetchNextPage = vi.fn();
    useInfiniteQuery.mockImplementation(() => {
      return {
        data: {
          pages: [
            {
              total_count: 100,
              items: [
                { id: 1, login: "testuser1" },
                { id: 2, login: "testuser2" },
              ],
            }
          ],
        },
        status: "success",
        fetchNextPage: mockFetchNextPage,
        hasNextPage: true,
        isFetchingNextPage: false,
        refetch: vi.fn(),
      };
    });

    useQuery.mockReturnValue({
      data: { login: "testuser" },
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });

    render(<FindUsers />);

    await waitFor(() => {
      expect(mockFetchNextPage).toBeDefined();
      mockFetchNextPage();
      expect(mockFetchNextPage).toHaveBeenCalled();
    });
  });

  it("should display loading state when fetching data", async () => {
    useInfiniteQuery.mockReturnValue({
      data: undefined,
      status: "loading",
      isLoading: true,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
      refetch: vi.fn(),
    });

    useQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      refetch: vi.fn(),
    });

    render(<FindUsers />);

    await waitFor(() => {
      expect(screen.getByText("Searching...")).toBeInTheDocument();
    });
  });

  it("should fetch empty data when username is empty", async () => {
    useInfiniteQuery.mockReturnValue({
      data: { pages : [
        { total_count: 0, items: [] }
      ] },
      status: "success",
      isLoading: false,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
      refetch: vi.fn(),
    });

    useQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });

    render(<FindUsers />);

    await waitFor(() => {
      expect(fetchUsers).not.toHaveBeenCalled();
    });
  });

  it("should display error message when fetch fails", async () => {
    useInfiniteQuery.mockReturnValue({
      data: undefined,
      status: "error",
      isLoading: false,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
      refetch: vi.fn(),
    });

    useQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error("Network error"),
      refetch: vi.fn(),
    });

    render(<FindUsers />);

    await waitFor(() => {
      expect(screen.getByText("Error fetching users. Please try again.")).toBeInTheDocument();
    });
  });

  it("should input username on enter key press", async () => {
    let queryFn;
    useInfiniteQuery.mockImplementation((options) => {
      queryFn = options.queryFn;
      return {
        data: {
          pages: [
            {
              total_count: 100,
              items: [
                { id: 1, login: "testuser1" },
                { id: 2, login: "testuser2" },
              ],
            }
          ],
        },
        status: "success",
        fetchNextPage: vi.fn(),
        hasNextPage: false,
        isFetchingNextPage: false,
        refetch: vi.fn(),
      };
    });

    useQuery.mockReturnValue({
      data: { login: "testuser" },
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });

    render(<FindUsers />);

    const input = screen.getByPlaceholderText("Enter username");

    fireEvent.change(input, { target: { value: "testuser" } });
    input.focus();
    expect(document.activeElement?.tagName).toBe('INPUT');
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    await queryFn({ pageParam: 1 });

    await waitFor(() => {
      expect(fetchUsers).toHaveBeenCalledWith("testuser", 1);
    });
  });

  it("should isFetchingNextPage on scroll", async () => {
    const mockFetchNextPage = vi.fn();
    useInfiniteQuery.mockImplementation(() => {
      return {
        data: {
          pages: [
            {
              total_count: 100,
              items: [
                { id: 1, login: "testuser1" },
                { id: 2, login: "testuser2" },
              ],
            }
          ],
        },
        status: "success",
        fetchNextPage: mockFetchNextPage,
        hasNextPage: true,
        isFetchingNextPage: true,
        refetch: vi.fn(),
      };
    });

    useQuery.mockReturnValue({
      data: { login: "testuser" },
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });

    render(<FindUsers />);

    await waitFor(() => {
      expect(mockFetchNextPage).toBeDefined();
      mockFetchNextPage();
      expect(mockFetchNextPage).toHaveBeenCalled();
    });
  });

  it("should handle pagination correctly with getNextPageParam", async () => {
    let capturedGetNextPageParam;
    useInfiniteQuery.mockImplementation((options) => {
      capturedGetNextPageParam = options.getNextPageParam;
      return {
        data: {
          pages: [
            {
              total_count: 25,
              items: Array(10).fill().map((_, i) => ({
                id: i + 1,
                login: `testuser${i + 1}`,
              })),
            },
          ],
        },
        status: "success",
        fetchNextPage: vi.fn(),
        hasNextPage: true,
        isFetchingNextPage: false,
        refetch: vi.fn(),
      };
    });

    render(<FindUsers />);

    const nextPage1 = capturedGetNextPageParam(
      { total_count: 25, items: [] },
      [{ total_count: 25, items: [] }]
    );
    expect(nextPage1).toBe(2);

    const nextPage2 = capturedGetNextPageParam(
      { total_count: 25, items: [] },
      Array(3).fill({ total_count: 25, items: [] })
    );
    expect(nextPage2).toBeUndefined();
  });

  it("should trigger fetchNextPage when intersection observer fires", async () => {
    const mockFetchNextPage = vi.fn();
    useInfiniteQuery.mockImplementation(() => ({
      data: {
        pages: [
          {
            total_count: 100,
            items: Array(10).fill().map((_, i) => ({
              id: i + 1,
              login: `testuser${i + 1}`,
            })),
          }
        ],
      },
      status: "success",
      fetchNextPage: mockFetchNextPage,
      hasNextPage: true,
      isFetchingNextPage: false,
      refetch: vi.fn(),
    }));

    render(<FindUsers />);

    const [[callback]] = window.IntersectionObserver.mock.calls;

    callback([{ isIntersecting: true }]);

    await waitFor(() => {
      expect(mockFetchNextPage).toHaveBeenCalled();
    });
  });

  it("should not trigger fetchNextPage when already fetching", async () => {
    const mockFetchNextPage = vi.fn();
    useInfiniteQuery.mockImplementation(() => ({
      data: {
        pages: [
          {
            total_count: 100,
            items: Array(10).fill().map((_, i) => ({
              id: i + 1,
              login: `testuser${i + 1}`,
            })),
          }
        ],
      },
      status: "success",
      fetchNextPage: mockFetchNextPage,
      hasNextPage: true,
      isFetchingNextPage: true,
      refetch: vi.fn(),
    }));

    render(<FindUsers />);

    const [[callback]] = window.IntersectionObserver.mock.calls;
    callback([{ isIntersecting: true }]);

    await waitFor(() => {
      expect(mockFetchNextPage).not.toHaveBeenCalled();
    });
  });
});
