//TODO: INCUBATOR PAGE
// - ADD INCUBATOR --> BUTTON enable/disablement
// - SHOWING THE CORRECT NUMBER OF INCUBATORS
import "@testing-library/jest-dom";
import { expect, test, describe, beforeAll, vi } from "vitest";
import { waitFor, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

import { AuthContextProvider } from "../../api/auth";
import IncubatorPage from "../../Pages/Incubator/IncubatorPage";
import { useIncubators } from "../../controllers/IncubatorController";
import {
  lynneyUser,
  lynneyToken,
  mockLynneyPayload,
  lynneyIncubators,
  grassIncubator,
  ghostIncubator,
  darkIncubator,
} from "../__mocks__/MockData";

let axiosMock;
vi.mock("../../api/auth", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useAuth: vi.fn(() => ({
      token: lynneyToken,
      setToken: vi.fn(),
      user: mockLynneyPayload,
      isExpired: false,
      isAuthenticated: true,
    })),
  };
});

vi.mock("../../controllers/IncubatorController", () => ({
  useIncubators: vi.fn(),
}));

beforeAll(() => {
  axiosMock = new MockAdapter(axios);
});

afterEach(() => {
  axiosMock.reset();
});

describe("Incubator Page renderings", () => {
  test("Incubator Page renders correctly", async () => {
    // Mock the useIncubators hook
    useIncubators.mockImplementation(() => ({
      incubators: lynneyIncubators,
      isLoading: false,
      error: null,
      refresh: vi.fn(),
    }));
    render(
      <MemoryRouter initialEntries={["/incubator"]}>
        <AuthContextProvider>
          <IncubatorPage />
        </AuthContextProvider>
      </MemoryRouter>
    );
    const title = screen.getByText("Incubator");
    expect(title).toBeInTheDocument();

    const addBtn = screen.getByText("Add Incubator");
    expect(addBtn).toBeInTheDocument();

    const incubatorUsage = screen.getByText("2 out of 4 Incubators in use");
    expect(incubatorUsage).toBeInTheDocument();

    const grassEgg = screen.getByText("Grass Type Egg");
    expect(grassEgg).toBeInTheDocument();

    const ghostEgg = screen.getByText("Ghost Type Egg");
    expect(ghostEgg).toBeInTheDocument();
  });

  test("Hatch button is enabled", async () => {
    // Mock the useIncubators hook
    useIncubators.mockImplementation(() => ({
      incubators: [ghostIncubator],
      isLoading: false,
      error: null,
      refresh: vi.fn(),
    }));
    render(
      <MemoryRouter initialEntries={["/incubator"]}>
        <AuthContextProvider>
          <IncubatorPage />
        </AuthContextProvider>
      </MemoryRouter>
    );
    const ghostEgg = screen.getByText("Ghost Type Egg");
    expect(ghostEgg).toBeInTheDocument();
    await waitFor(
      () => {
        const hatchButton = screen.getByTestId(
          `${ghostIncubator._id}-hatch-btn`
        );
        expect(hatchButton).toBeEnabled();
      },
      { timeout: 5000 } // need a time out to register the countdown compeletion
    );
  });

  test("Hatch button is disabled", async () => {
    // Mock the useIncubators hook
    useIncubators.mockImplementation(() => ({
      incubators: [grassIncubator],
      isLoading: false,
      error: null,
      refresh: vi.fn(),
    }));
    render(
      <MemoryRouter initialEntries={["/incubator"]}>
        <AuthContextProvider>
          <IncubatorPage />
        </AuthContextProvider>
      </MemoryRouter>
    );
    const title = screen.getByText("Incubator");
    expect(title).toBeInTheDocument();

    const grassEgg = screen.getByText("Grass Type Egg");
    expect(grassEgg).toBeInTheDocument();
    await waitFor(() => {
      const hatchButton = screen.getByTestId(`${grassIncubator._id}-hatch-btn`);
      expect(hatchButton).toBeDisabled();
    });
  });

  test("Add Incubator button is enabled when less than 4 active incubators", async () => {
    // Mock the useIncubators hook
    useIncubators.mockImplementation(() => ({
      incubators: lynneyIncubators,
      isLoading: false,
      error: null,
      refresh: vi.fn(),
    }));
    render(
      <MemoryRouter initialEntries={["/incubator"]}>
        <AuthContextProvider>
          <IncubatorPage />
        </AuthContextProvider>
      </MemoryRouter>
    );
    await waitFor(() => {
      const addButton = screen.getByText("Add Incubator");
      expect(addButton).toBeEnabled();
    });
  });

  test("Add Incubator button is disabled when there are 4 active incubators", async () => {
    // Mock the useIncubators hook
    useIncubators.mockImplementation(() => ({
      incubators: [
        grassIncubator,
        grassIncubator,
        ghostIncubator,
        darkIncubator,
      ],
      isLoading: false,
      error: null,
      refresh: vi.fn(),
    }));
    render(
      <MemoryRouter initialEntries={["/incubator"]}>
        <AuthContextProvider>
          <IncubatorPage />
        </AuthContextProvider>
      </MemoryRouter>
    );
    await waitFor(() => {
      const addButton = screen.getByText("Add Incubator");
      expect(addButton).toBeDisabled();
    });
  });
});
