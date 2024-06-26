import "@testing-library/jest-dom";
import { expect, test, describe, beforeAll, vi } from "vitest";
import { waitFor, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

import { AuthContextProvider } from "../../api/auth";
import PokeBoxPage from "../../Pages/Pokebox/PokeBoxPage";
import {
  lynneyUser,
  lynneyToken,
  mockLynneyPayload,
  lynneyPokemon,
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

beforeAll(() => {
  axiosMock = new MockAdapter(axios);
});

afterEach(() => {
  axiosMock.reset();
});
describe("Pokemon Details Renderings", () => {
  test("Pokemon Details Modal Renders correctly", async () => {
    axiosMock
      .onGet(`api/v1/users/${mockLynneyPayload._id}`)
      .reply(200, lynneyUser);
    axiosMock
      .onGet(`api/v1/users/${mockLynneyPayload._id}/pokemon`)
      .reply(200, lynneyPokemon);
    render(
      <MemoryRouter initialEntries={["/pokebox"]}>
        <AuthContextProvider>
          <PokeBoxPage />
        </AuthContextProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Misdreavus")).toBeInTheDocument();
      expect(screen.getByText("Gabite")).toBeInTheDocument();
      expect(screen.getByText("Wo-chien")).toBeInTheDocument();
      expect(screen.getByText("Vullaby")).toBeInTheDocument();
    });
    const misdreavusPoke = screen.getByText("Misdreavus");
    fireEvent.click(misdreavusPoke);
    expect(screen.getAllByText("Misdreavus").length).equal(2);
    expect(screen.getByText("Ghost")).toBeInTheDocument();

    expect(screen.getByText("Height")).toBeInTheDocument();
    expect(screen.getByText("0.7m")).toBeInTheDocument();
    expect(screen.getByText("Weight")).toBeInTheDocument();
    expect(screen.getByText("1kg")).toBeInTheDocument();

    expect(screen.getByText("Pokedex Entry")).toBeInTheDocument();
    expect(screen.getByText("Original Trainer")).toBeInTheDocument();
    expect(screen.getAllByText("Lynney").length).equal(2);
  });

  test("Pokemon Details Modal closes correctly", async () => {
    axiosMock
      .onGet(`api/v1/users/${mockLynneyPayload._id}`)
      .reply(200, lynneyUser);
    axiosMock
      .onGet(`api/v1/users/${mockLynneyPayload._id}/pokemon`)
      .reply(200, lynneyPokemon);
    render(
      <MemoryRouter initialEntries={["/pokebox"]}>
        <AuthContextProvider>
          <PokeBoxPage />
        </AuthContextProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Misdreavus")).toBeInTheDocument();
      expect(screen.getByText("Gabite")).toBeInTheDocument();
      expect(screen.getByText("Wo-chien")).toBeInTheDocument();
      expect(screen.getByText("Vullaby")).toBeInTheDocument();
    });
    const misdreavusPoke = screen.getByText("Misdreavus");
    fireEvent.click(misdreavusPoke);
    expect(screen.getAllByText("Misdreavus").length).equal(2);
    expect(screen.getAllByText("Lynney").length).equal(2);

    const closeButton = await screen.findByTestId("details-close");
    expect(closeButton).toBeInTheDocument();
    fireEvent.click(closeButton);
    expect(screen.getAllByText("Misdreavus").length).equal(1);
    expect(screen.getAllByText("Lynney").length).equal(1);
  });
});
