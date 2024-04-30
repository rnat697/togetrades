import "@testing-library/jest-dom";
import { expect, test, describe, beforeAll, vi } from "vitest";
import { waitFor, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";

import { AuthContextProvider } from "../../api/auth";
import FavoriteButton from "../../components/favourite/FavoriteButton";
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
describe("Favorite Button Renderings", () => {
  test("Favorite button toggles correctly", async () => {
    const misdrevus = lynneyPokemon[0];
    axiosMock
      .onPatch(`api/v1/pokemons/${misdrevus._id}/setTradeable`)
      .reply(204);
    render(
      <MemoryRouter initialEntries={["/pokebox"]}>
        <AuthContextProvider>
          <FavoriteButton />
        </AuthContextProvider>
      </MemoryRouter>
    );

    const outlineButton = screen.getByTestId("fav-icon-outline");
    expect(outlineButton).toBeInTheDocument();

    fireEvent.click(outlineButton);
    waitFor(() => {
      const fullButton = screen.getByTestId("fav-icon-full");
      expect(fullButton).toBeInTheDocument();
    });
  });
});
