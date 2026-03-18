import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useAuth } from "@/hooks/use-auth";
import { signIn as signInAction, signUp as signUpAction } from "@/actions";
import { getAnonWorkData, clearAnonWork } from "@/lib/anon-work-tracker";
import { getProjects } from "@/actions/get-projects";
import { createProject } from "@/actions/create-project";

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock("@/actions", () => ({
  signIn: vi.fn(),
  signUp: vi.fn(),
}));

vi.mock("@/lib/anon-work-tracker", () => ({
  getAnonWorkData: vi.fn(),
  clearAnonWork: vi.fn(),
}));

vi.mock("@/actions/get-projects", () => ({
  getProjects: vi.fn(),
}));

vi.mock("@/actions/create-project", () => ({
  createProject: vi.fn(),
}));

const mockSignIn = vi.mocked(signInAction);
const mockSignUp = vi.mocked(signUpAction);
const mockGetAnonWorkData = vi.mocked(getAnonWorkData);
const mockClearAnonWork = vi.mocked(clearAnonWork);
const mockGetProjects = vi.mocked(getProjects);
const mockCreateProject = vi.mocked(createProject);

beforeEach(() => {
  vi.clearAllMocks();
  mockGetAnonWorkData.mockReturnValue(null);
  mockGetProjects.mockResolvedValue([]);
  mockCreateProject.mockResolvedValue({
    id: "new-project-id",
    name: "New Design",
    userId: "user-1",
    messages: "[]",
    fileSystemData: "{}",
    createdAt: new Date(),
    updatedAt: new Date(),
  });
});

describe("useAuth", () => {
  it("returns signIn, signUp, and isLoading", () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.signIn).toBeInstanceOf(Function);
    expect(result.current.signUp).toBeInstanceOf(Function);
    expect(result.current.isLoading).toBe(false);
  });

  describe("signIn", () => {
    it("returns the auth result on success", async () => {
      mockSignIn.mockResolvedValue({ success: true });

      const { result } = renderHook(() => useAuth());

      let authResult: { success: boolean; error?: string } | undefined;
      await act(async () => {
        authResult = await result.current.signIn("test@test.com", "password");
      });

      expect(mockSignIn).toHaveBeenCalledWith("test@test.com", "password");
      expect(authResult).toEqual({ success: true });
    });

    it("returns the auth result on failure without navigating", async () => {
      mockSignIn.mockResolvedValue({
        success: false,
        error: "Invalid credentials",
      });

      const { result } = renderHook(() => useAuth());

      let authResult: { success: boolean; error?: string } | undefined;
      await act(async () => {
        authResult = await result.current.signIn("test@test.com", "wrong");
      });

      expect(authResult).toEqual({
        success: false,
        error: "Invalid credentials",
      });
      expect(mockPush).not.toHaveBeenCalled();
    });

    it("sets isLoading to true during sign in and resets after", async () => {
      let resolveSignIn: (value: { success: boolean }) => void;
      mockSignIn.mockReturnValue(
        new Promise((resolve) => {
          resolveSignIn = resolve;
        })
      );

      const { result } = renderHook(() => useAuth());

      expect(result.current.isLoading).toBe(false);

      let signInPromise: Promise<unknown>;
      act(() => {
        signInPromise = result.current.signIn("test@test.com", "password");
      });

      expect(result.current.isLoading).toBe(true);

      await act(async () => {
        resolveSignIn!({ success: false });
        await signInPromise;
      });

      expect(result.current.isLoading).toBe(false);
    });

    it("resets isLoading even when signIn action throws", async () => {
      mockSignIn.mockRejectedValue(new Error("Network error"));

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await expect(
          result.current.signIn("test@test.com", "password")
        ).rejects.toThrow("Network error");
      });

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe("signUp", () => {
    it("returns the auth result on success", async () => {
      mockSignUp.mockResolvedValue({ success: true });

      const { result } = renderHook(() => useAuth());

      let authResult: { success: boolean; error?: string } | undefined;
      await act(async () => {
        authResult = await result.current.signUp("new@test.com", "password");
      });

      expect(mockSignUp).toHaveBeenCalledWith("new@test.com", "password");
      expect(authResult).toEqual({ success: true });
    });

    it("returns the auth result on failure without navigating", async () => {
      mockSignUp.mockResolvedValue({
        success: false,
        error: "Email already exists",
      });

      const { result } = renderHook(() => useAuth());

      let authResult: { success: boolean; error?: string } | undefined;
      await act(async () => {
        authResult = await result.current.signUp("taken@test.com", "password");
      });

      expect(authResult).toEqual({
        success: false,
        error: "Email already exists",
      });
      expect(mockPush).not.toHaveBeenCalled();
    });

    it("resets isLoading even when signUp action throws", async () => {
      mockSignUp.mockRejectedValue(new Error("Server error"));

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await expect(
          result.current.signUp("new@test.com", "password")
        ).rejects.toThrow("Server error");
      });

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe("post sign-in navigation", () => {
    it("saves anonymous work as a project and navigates to it", async () => {
      mockSignIn.mockResolvedValue({ success: true });
      mockGetAnonWorkData.mockReturnValue({
        messages: [{ role: "user", content: "hello" }],
        fileSystemData: { "/App.tsx": "code" },
      });
      mockCreateProject.mockResolvedValue({
        id: "anon-project-id",
        name: "Design from 10:00:00 AM",
        userId: "user-1",
        messages: "[]",
        fileSystemData: "{}",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.signIn("test@test.com", "password");
      });

      expect(mockCreateProject).toHaveBeenCalledWith({
        name: expect.stringContaining("Design from"),
        messages: [{ role: "user", content: "hello" }],
        data: { "/App.tsx": "code" },
      });
      expect(mockClearAnonWork).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith("/anon-project-id");
    });

    it("skips anonymous work when messages are empty", async () => {
      mockSignIn.mockResolvedValue({ success: true });
      mockGetAnonWorkData.mockReturnValue({
        messages: [],
        fileSystemData: {},
      });
      mockGetProjects.mockResolvedValue([]);

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.signIn("test@test.com", "password");
      });

      expect(mockClearAnonWork).not.toHaveBeenCalled();
      // Should fall through to create a new project
      expect(mockCreateProject).toHaveBeenCalled();
    });

    it("navigates to most recent project when no anon work exists", async () => {
      mockSignIn.mockResolvedValue({ success: true });
      mockGetAnonWorkData.mockReturnValue(null);
      mockGetProjects.mockResolvedValue([
        {
          id: "existing-project",
          name: "My Project",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.signIn("test@test.com", "password");
      });

      expect(mockCreateProject).not.toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith("/existing-project");
    });

    it("creates a new project when user has no existing projects", async () => {
      mockSignIn.mockResolvedValue({ success: true });
      mockGetAnonWorkData.mockReturnValue(null);
      mockGetProjects.mockResolvedValue([]);
      mockCreateProject.mockResolvedValue({
        id: "fresh-project",
        name: "New Design #42",
        userId: "user-1",
        messages: "[]",
        fileSystemData: "{}",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.signIn("test@test.com", "password");
      });

      expect(mockCreateProject).toHaveBeenCalledWith({
        name: expect.stringMatching(/^New Design #\d+$/),
        messages: [],
        data: {},
      });
      expect(mockPush).toHaveBeenCalledWith("/fresh-project");
    });

    it("uses the same post-sign-in flow for signUp", async () => {
      mockSignUp.mockResolvedValue({ success: true });
      mockGetAnonWorkData.mockReturnValue(null);
      mockGetProjects.mockResolvedValue([
        {
          id: "proj-1",
          name: "Project",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.signUp("new@test.com", "password");
      });

      expect(mockPush).toHaveBeenCalledWith("/proj-1");
    });
  });
});
