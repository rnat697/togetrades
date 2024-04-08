import "@testing-library/jest-dom";
import { expect, test, describe, beforeAll, vi } from "vitest";
import { waitFor, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

import { AuthContextProvider, AuthContext } from "../../api/auth";
import PokeBoxPage from "../../Pages/Pokebox/PokeBoxPage";
import {
  lynneyUser,
  lynneyToken,
  mockLynneyPayload,
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
describe("Global Navigation Renderings", () => {
  test("Rendering Global Navigation", async () => {
    axiosMock
      .onGet(`api/v1/users/${mockLynneyPayload._id}`)
      .reply(200, lynneyUser);
    render(
      <MemoryRouter initialEntries={["/pokebox"]}>
        <AuthContextProvider>
          <PokeBoxPage />
        </AuthContextProvider>
      </MemoryRouter>
    );
    expect(screen.getAllByText("Poke Box").length).equal(2);
    expect(screen.getAllByText("Incubator").length).equal(1);
    expect(screen.getAllByText("Trade Hub").length).equal(1);
    expect(screen.getAllByText("Pokedex").length).equal(1);
    await waitFor(() => {
      const usernameTxt = screen.getByText("Lynney");
      expect(usernameTxt).toBeInTheDocument();
    });
  });

  test("Rendering user dropdown in global navigation", async () => {
    axiosMock
      .onGet(`api/v1/users/${mockLynneyPayload._id}`)
      .reply(200, lynneyUser);
    render(
      <MemoryRouter initialEntries={["/pokebox"]}>
        <AuthContextProvider>
          <PokeBoxPage />
        </AuthContextProvider>
      </MemoryRouter>
    );
    await waitFor(() => {
      const usernameTxt = screen.getByText("Lynney");
      expect(usernameTxt).toBeInTheDocument();
      // Click on username to open drop down
      fireEvent.click(usernameTxt);

      const emailTxt = screen.getByText("lynney@email.com");
      expect(emailTxt).toBeInTheDocument();
      const logoutbtn = screen.getAllByText("Log out");
      expect(logoutbtn.length).equal(2);
    });
  });
});
// TODO: redirections to other pages
