import "@testing-library/jest-dom";
import { expect, test, describe, beforeAll } from "vitest";
import { waitFor, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

import { AuthContextProvider } from "../../api/auth";
import AuthorisationPage from "../../Pages/Authorisation/AuthorisationPage";
import PokeBoxPage from "../../Pages/Pokebox/PokeBoxPage";

let axiosMock;

beforeAll(() => {
  axiosMock = new MockAdapter(axios);
});

afterEach(() => {
  axiosMock.reset();
});

describe("Authorisation Page renderings", () => {
  test("Rendering Login Page correctly", () => {
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <AuthContextProvider>
          <AuthorisationPage isLogin={true} />
        </AuthContextProvider>
      </MemoryRouter>
    );
    const loginElements = screen.getAllByText("Login");
    expect(loginElements.length).toBeGreaterThanOrEqual(2);

    const signUpElements = screen.getAllByText("Sign up");
    expect(signUpElements.length).lessThanOrEqual(1);

    // Email input shouldn't be seen [changed by login-form css]
    const emailInput = screen.getByLabelText("email-input-container");
    expect(emailInput.className).toBe("input-container login-form");

    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByText("Not registered yet?")).toBeInTheDocument();
  });

  test("Rendering Sign up Page correctly", () => {
    render(
      <MemoryRouter initialEntries={["/signup"]}>
        <AuthContextProvider>
          <AuthorisationPage isLogin={false} />
        </AuthContextProvider>
      </MemoryRouter>
    );
    const loginElements = screen.getAllByText("Login");
    expect(loginElements.length).toBeGreaterThanOrEqual(1);

    const signUpElements = screen.getAllByText("Sign up");
    expect(signUpElements.length).lessThanOrEqual(2);

    // Email input should be seen [changed by signup-form css]
    const emailInput = screen.getByLabelText("email-input-container");
    expect(emailInput.className).toBe("input-container signup-form");

    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByText("Already have an account?")).toBeInTheDocument();
  });

  test("Transition from login screen to sign up screen", () => {
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <AuthContextProvider>
          <AuthorisationPage isLogin={true} />
        </AuthContextProvider>
      </MemoryRouter>
    );
    // Login Page tests
    const loginElements = screen.getAllByText("Login");
    expect(loginElements.length).toBeGreaterThanOrEqual(2);

    const signUpElements = screen.getAllByText("Sign up");
    expect(signUpElements.length).lessThanOrEqual(1);

    // Email input shouldn't be seen [changed by login-form css]
    const emailInput = screen.getByLabelText("email-input-container");
    expect(emailInput.className).toBe("input-container login-form");

    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByText("Not registered yet?")).toBeInTheDocument();

    // Transition to Sign up page
    const link = screen.getByRole("link", { name: "Sign up" });
    expect(link).toBeInTheDocument();
    fireEvent.click(link);

    // Sign up Page tests
    expect(loginElements.length).toBeGreaterThanOrEqual(1);
    expect(signUpElements.length).lessThanOrEqual(2);
    expect(emailInput.className).toBe("input-container signup-form");
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByText("Already have an account?")).toBeInTheDocument();
  });

  test("Transition from sign up screen to login screen", () => {
    render(
      <MemoryRouter initialEntries={["/signup"]}>
        <AuthContextProvider>
          <AuthorisationPage isLogin={false} />
        </AuthContextProvider>
      </MemoryRouter>
    );
    // Sign up Page tests
    const loginElements = screen.getAllByText("Sign up");
    expect(loginElements.length).toBeGreaterThanOrEqual(2);

    const signUpElements = screen.getAllByText("Login");
    expect(signUpElements.length).lessThanOrEqual(1);

    // Email input shouldn't be seen [changed by login-form css]
    const emailInput = screen.getByLabelText("email-input-container");
    expect(emailInput.className).toBe("input-container signup-form");

    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByText("Already have an account?")).toBeInTheDocument();

    // Transition to Sign up page
    const link = screen.getByRole("link", { name: "Login" });
    expect(link).toBeInTheDocument();
    fireEvent.click(link);

    // Login Page tests
    expect(loginElements.length).toBeGreaterThanOrEqual(2);
    expect(signUpElements.length).lessThanOrEqual(1);
    expect(emailInput.className).toBe("input-container login-form");
    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByText("Not registered yet?")).toBeInTheDocument();
  });
});

describe("Login Page Inputs", () => {
  test("Login with correct username and password", async () => {
    axiosMock.onPost("api/v1/users/login").reply(200, { success: true });
    render(
      <AuthContextProvider>
        <MemoryRouter initialEntries={["/login"]}>
          <Routes>
            <Route
              path="login"
              element={<AuthorisationPage isLogin={true} />}
            />
            <Route path="pokebox" element={<PokeBoxPage />} />
          </Routes>
        </MemoryRouter>
      </AuthContextProvider>
    );

    const usernameInput = screen.getByPlaceholderText("Username");
    const passwordInput = screen.getByPlaceholderText("Password");
    const loginButton = screen.getByRole("button", { name: "Login" });

    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "testpassword" } });
    expect(usernameInput.value).toBe("testuser");
    expect(passwordInput.value).toBe("testpassword");

    fireEvent.click(loginButton);

    await waitFor(() => {
      const pokebox = screen.getByText("Poke Box");
      expect(pokebox).toBeInTheDocument();
    });
  });

  test("Login with non-existent username", async () => {
    axiosMock
      .onPost("api/v1/users/login")
      .reply(401, "Username does not exist.");
    render(
      <AuthContextProvider>
        <MemoryRouter initialEntries={["/login"]}>
          <Routes>
            <Route
              path="login"
              element={<AuthorisationPage isLogin={true} />}
            />
            <Route path="pokebox" element={<PokeBoxPage />} />
          </Routes>
        </MemoryRouter>
      </AuthContextProvider>
    );

    const usernameInput = screen.getByPlaceholderText("Username");
    const passwordInput = screen.getByPlaceholderText("Password");
    const loginButton = screen.getByRole("button", { name: "Login" });

    fireEvent.change(usernameInput, { target: { value: "idontexist" } });
    fireEvent.change(passwordInput, { target: { value: "testpassword" } });
    expect(usernameInput.value).toBe("idontexist");
    expect(passwordInput.value).toBe("testpassword");

    fireEvent.click(loginButton);

    await waitFor(() => {
      const error = screen.getByText(
        "Error when logging in: Username does not exist."
      );
      expect(error).toBeInTheDocument();
    });
  });

  test("Login with wrong password", async () => {
    axiosMock
      .onPost("api/v1/users/login")
      .reply(401, "Incorrect password. Please try again.");
    render(
      <AuthContextProvider>
        <MemoryRouter initialEntries={["/login"]}>
          <Routes>
            <Route
              path="login"
              element={<AuthorisationPage isLogin={true} />}
            />
            <Route path="pokebox" element={<PokeBoxPage />} />
          </Routes>
        </MemoryRouter>
      </AuthContextProvider>
    );

    const usernameInput = screen.getByPlaceholderText("Username");
    const passwordInput = screen.getByPlaceholderText("Password");
    const loginButton = screen.getByRole("button", { name: "Login" });

    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });
    expect(usernameInput.value).toBe("testuser");
    expect(passwordInput.value).toBe("wrongpassword");

    fireEvent.click(loginButton);

    await waitFor(() => {
      const error = screen.getByText(
        "Error when logging in: Incorrect password. Please try again."
      );
      expect(error).toBeInTheDocument();
    });
  });
});

describe("Sign up Page Inputs", () => {
  test("Sign up with correct username and password", async () => {
    axiosMock.onPost("api/v1/users/register").reply(200, { success: true });
    render(
      <AuthContextProvider>
        <MemoryRouter initialEntries={["/signup"]}>
          <Routes>
            <Route
              path="signup"
              element={<AuthorisationPage isLogin={false} />}
            />
            <Route path="pokebox" element={<PokeBoxPage />} />
          </Routes>
        </MemoryRouter>
      </AuthContextProvider>
    );

    const emailInput = screen.getByPlaceholderText("Email");
    const usernameInput = screen.getByPlaceholderText("Username");
    const passwordInput = screen.getByPlaceholderText("Password");
    const signupButton = screen.getByRole("button", { name: "Sign up" });

    fireEvent.change(emailInput, { target: { value: "testemail@email.com" } });
    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "testpassword" } });

    expect(emailInput.value).toBe("testemail@email.com");
    expect(usernameInput.value).toBe("testuser");
    expect(passwordInput.value).toBe("testpassword");

    fireEvent.click(signupButton);

    await waitFor(() => {
      const pokebox = screen.getByText("Poke Box");
      expect(pokebox).toBeInTheDocument();
    });
  });

  test("Sign up with existing username", async () => {
    axiosMock
      .onPost("api/v1/users/register")
      .reply(409, "Email or username already exists.");
    render(
      <AuthContextProvider>
        <MemoryRouter initialEntries={["/signup"]}>
          <Routes>
            <Route
              path="signup"
              element={<AuthorisationPage isLogin={false} />}
            />
            <Route path="pokebox" element={<PokeBoxPage />} />
          </Routes>
        </MemoryRouter>
      </AuthContextProvider>
    );

    const emailInput = screen.getByPlaceholderText("Email");
    const usernameInput = screen.getByPlaceholderText("Username");
    const passwordInput = screen.getByPlaceholderText("Password");
    const signupButton = screen.getByRole("button", { name: "Sign up" });

    fireEvent.change(emailInput, { target: { value: "testemail@email.com" } });
    fireEvent.change(usernameInput, { target: { value: "ialreadyexist" } });
    fireEvent.change(passwordInput, { target: { value: "testpassword" } });

    expect(emailInput.value).toBe("testemail@email.com");
    expect(usernameInput.value).toBe("ialreadyexist");
    expect(passwordInput.value).toBe("testpassword");

    fireEvent.click(signupButton);

    await waitFor(() => {
      const error = screen.getByText(
        "Error when signing up: Email or username already exists."
      );
      expect(error).toBeInTheDocument();
    });
  });

  test("Sign up with existing email", async () => {
    axiosMock
      .onPost("api/v1/users/register")
      .reply(409, "Email or username already exists.");
    render(
      <AuthContextProvider>
        <MemoryRouter initialEntries={["/signup"]}>
          <Routes>
            <Route
              path="signup"
              element={<AuthorisationPage isLogin={false} />}
            />
            <Route path="pokebox" element={<PokeBoxPage />} />
          </Routes>
        </MemoryRouter>
      </AuthContextProvider>
    );

    const emailInput = screen.getByPlaceholderText("Email");
    const usernameInput = screen.getByPlaceholderText("Username");
    const passwordInput = screen.getByPlaceholderText("Password");
    const signupButton = screen.getByRole("button", { name: "Sign up" });

    fireEvent.change(emailInput, {
      target: { value: "existingemail@email.com" },
    });
    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });

    expect(emailInput.value).toBe("existingemail@email.com");
    expect(usernameInput.value).toBe("testuser");
    expect(passwordInput.value).toBe("wrongpassword");

    fireEvent.click(signupButton);

    await waitFor(() => {
      const error = screen.getByText(
        "Error when signing up: Email or username already exists."
      );
      expect(error).toBeInTheDocument();
    });
  });
});
