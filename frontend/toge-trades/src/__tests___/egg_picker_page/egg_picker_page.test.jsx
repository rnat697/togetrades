import "@testing-library/jest-dom";
import { expect, test, describe, beforeAll, vi } from "vitest";
import { waitFor, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { AuthContextProvider } from "../../api/auth";
import EggPickerPage from "../../Pages/EggPicker/EggPickerPage";
import { lynneyToken, mockLynneyPayload } from "../__mocks__/MockData";

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

beforeAll(() => {
  axiosMock = new MockAdapter(axios);
});

afterEach(() => {
  axiosMock.reset();
});

// axiosMock.onPatch(`api/v1/incubator/water/create`).reply(204);
describe("Egg Picker Page Renderings", () => {
  test("Initial render - Start Incubating button is disabled", async () => {
    render(
      <MemoryRouter initialEntries={["/egg-picker"]}>
        <AuthContextProvider>
          <EggPickerPage />
        </AuthContextProvider>
      </MemoryRouter>
    );

    const startBtn = screen.getByTestId("start-incubation-btn");
    expect(startBtn).toBeInTheDocument();
    expect(startBtn).toBeDisabled();
  });
  test("Initial render - Clicking on type shows border", async () => {
    render(
      <MemoryRouter initialEntries={["/egg-picker"]}>
        <AuthContextProvider>
          <EggPickerPage />
        </AuthContextProvider>
      </MemoryRouter>
    );
    const expectedBorderColor = "#BFD9FA";
    const waterBtn = screen.queryByTestId("water-btn");
    expect(waterBtn).toBeInTheDocument();
    fireEvent.click(waterBtn);
    waitFor(() => {
      expect(waterBtn).toHaveFocus();
      expect(waterBtn).toHaveStyle(
        `border-color: ${expectedBorderColor}; border-width: 0.4em;`
      );
    });
  });
  test("Initial render - Clicking on type enables start incubation button", async () => {
    render(
      <MemoryRouter initialEntries={["/egg-picker"]}>
        <AuthContextProvider>
          <EggPickerPage />
        </AuthContextProvider>
      </MemoryRouter>
    );
    const startBtn = screen.getByTestId("start-incubation-btn");
    expect(startBtn).toBeInTheDocument();
    expect(startBtn).toBeDisabled();

    const waterBtn = screen.queryByTestId("water-btn");
    expect(waterBtn).toBeInTheDocument();
    fireEvent.click(waterBtn);

    expect(startBtn).toBeEnabled();
  });
  test("On successful click of Start Incubation Button, it should go to Incubator Page", async () => {
    axiosMock.onPost(`api/v1/incubators/water/create`).reply(200);
    render(
      <MemoryRouter initialEntries={["/egg-picker"]}>
        <AuthContextProvider>
          <EggPickerPage />
        </AuthContextProvider>
      </MemoryRouter>
    );
    const startBtn = screen.getByTestId("start-incubation-btn");
    expect(startBtn).toBeInTheDocument();

    const waterBtn = screen.queryByTestId("water-btn");
    expect(waterBtn).toBeInTheDocument();
    fireEvent.click(waterBtn);

    fireEvent.click(startBtn);
    waitFor(() => {
      expect("Incubator").toBeInTheDocument();
    });
  });
  test("On successful click of Start Incubation Button, it should go to Incubator Page", async () => {
    axiosMock.onPost(`api/v1/incubators/water/create`).reply(201);
    render(
      <MemoryRouter initialEntries={["incubator/egg-picker"]}>
        <AuthContextProvider>
          <EggPickerPage />
        </AuthContextProvider>
      </MemoryRouter>
    );
    const startBtn = screen.getByTestId("start-incubation-btn");
    expect(startBtn).toBeInTheDocument();

    const waterBtn = screen.queryByTestId("water-btn");
    expect(waterBtn).toBeInTheDocument();
    fireEvent.click(waterBtn);

    fireEvent.click(startBtn);
    waitFor(() => {
      expect("Incubator").toBeInTheDocument();
    });
  });
  test("On Internal server error, it should show an error msg", async () => {
    axiosMock
      .onPost(`api/v1/incubators/water/create`)
      .reply(500, { message: "Internal Server Error" });
    render(
      <MemoryRouter initialEntries={["/egg-picker"]}>
        <AuthContextProvider>
          <EggPickerPage />
        </AuthContextProvider>
      </MemoryRouter>
    );
    const startBtn = screen.getByTestId("start-incubation-btn");
    expect(startBtn).toBeInTheDocument();

    const waterBtn = screen.queryByTestId("water-btn");
    expect(waterBtn).toBeInTheDocument();
    fireEvent.click(waterBtn);
    fireEvent.click(startBtn);
    waitFor(() => {
      expect(
        "Error when adding incubator: Internal Server Error"
      ).toBeInTheDocument();
    });
  });
});
