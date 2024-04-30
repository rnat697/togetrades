import "@testing-library/jest-dom";
import { expect, test, describe, beforeAll, vi } from "vitest";
import { waitFor, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

import { AuthContextProvider } from "../../api/auth";
import TradeableButton from "../../components/tradeable/TradeableButton";
import {
  lynneyUser,
  lynneyToken,
  mockLynneyPayload,
  lynneyPokemon,
} from "../__mocks__/MockData";
import PokeBoxContents from "../../components/pokebox/pokebox-contents/PokeBoxContents";
import PokeBoxPage from "../../Pages/Pokebox/PokeBoxPage";

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
describe("Tradeable Button Renderings", () => {
  test("Tradeable button toggles correctly", async () => {
    const misdrevus = lynneyPokemon[0];
    axiosMock
      .onPatch(`api/v1/pokemons/${misdrevus._id}/setTradeable`)
      .reply(204);
    render(
      <MemoryRouter initialEntries={["/pokebox"]}>
        <AuthContextProvider>
          <TradeableButton />
        </AuthContextProvider>
      </MemoryRouter>
    );

    const button = screen.getByTestId("tradeable-button");
    expect(button.className).equal("tradeable-container ");

    fireEvent.click(button);
    waitFor(() =>
      expect(button.className).equal("tradeable-container selected-container")
    );
  });

  test("An error is shown when maximum tradable pokemon has been reached", async () => {
    axiosMock
      .onGet(`api/v1/users/${mockLynneyPayload._id}`)
      .reply(200, lynneyUser);
    axiosMock
      .onGet(`api/v1/users/${mockLynneyPayload._id}/pokemon`)
      .reply(200, lynneyPokemon);

    const misdrevus = lynneyPokemon[0];

    axiosMock
      .onPatch(`api/v1/pokemons/${misdrevus._id}/setTradeable`)
      .reply(
        403,
        "Maximum tradeable Pokemon limit reached. Only 6 Pokemon can be marked as tradeable."
      );
    render(
      <MemoryRouter initialEntries={["/pokebox"]}>
        <AuthContextProvider>
          <PokeBoxContents />
        </AuthContextProvider>
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText("Misdreavus")).toBeInTheDocument();
      expect(screen.getByText("Gabite")).toBeInTheDocument();
      expect(screen.getByText("Wo-chien")).toBeInTheDocument();
      expect(screen.getByText("Vullaby")).toBeInTheDocument();
    });
    const button = screen
      .getByText("Misdreavus")
      .closest(".cards-container")
      .querySelector('[data-testid="tradeable-button"]');
    expect(button.className).equal("tradeable-container ");

    fireEvent.click(button);
    waitFor(() =>
      expect(screen.getByRole("alert")).equal(
        "Error when toggling pokemon's tradeability: Maximum tradeable Pokemon limit reached. Only 6 Pokemon can be marked as tradeable."
      )
    );
  });
});
