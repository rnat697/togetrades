import "@testing-library/jest-dom";
import { expect, test, describe, beforeAll, vi } from "vitest";
import { waitFor, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

import { AuthContextProvider } from "../../api/auth";
import LockButton from "../../components/lock/LockButton";
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
describe("Lock Button Renderings", () => {
  test("Lock button toggles correctly", async () => {
    const misdrevus = lynneyPokemon[0];
    axiosMock
      .onPatch(`api/v1/pokemons/${misdrevus._id}/setTradeable`)
      .reply(204);
    render(
      <MemoryRouter initialEntries={["/pokebox"]}>
        <AuthContextProvider>
          <LockButton />
        </AuthContextProvider>
      </MemoryRouter>
    );

    const outlineButton = screen.getByTestId("lock-icon-outline");
    expect(outlineButton).toBeInTheDocument();

    fireEvent.click(outlineButton);
    waitFor(() => {
      const fullButton = screen.getByTestId("lock-icon-full");
      expect(fullButton).toBeInTheDocument();
    });
  });
});
