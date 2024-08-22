import "@testing-library/jest-dom";
import { expect, test, describe, beforeAll, vi } from "vitest";
import { waitFor, fireEvent, render, screen } from "@testing-library/react";
import Countdown from "../../components/countdown/Countdown";
import {
  darkIncubator,
  grassIncubator,
  ghostIncubator,
} from "../__mocks__/MockData";

describe("Countdown  - Calculating Remaining Hatch Time", () => {
  test("Remaining hatch time is 5 hours", () => {
    const remainingTime = grassIncubator.hatchTime;
    render(
      <Countdown deadline={remainingTime} onCountdownComplete={vi.fn()} />
    );
    expect(screen.getByText("04h : 59m : 59s left")).toBeInTheDocument();
  });
  test("Remaining hatch time is 50 mins", () => {
    const remainingTime = darkIncubator.hatchTime;
    render(
      <Countdown deadline={remainingTime} onCountdownComplete={vi.fn()} />
    );
    expect(screen.getByText("00h : 49m : 59s left")).toBeInTheDocument();
  });
  test("Remaining time has elapsed, Ready to Hatch can be seen", () => {
    const remainingTime = ghostIncubator.hatchTime;
    render(
      <Countdown deadline={remainingTime} onCountdownComplete={vi.fn()} />
    );
    expect(screen.getByText("🎉 Ready to hatch")).toBeInTheDocument();
  });
});
