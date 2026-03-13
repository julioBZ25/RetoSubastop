import { describe, it, expect } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import preferencesReducer, {
  setViewMode,
  preferencesSlice,
} from "@/features/preferences/preferencesSlice";

const makeStore = () =>
  configureStore({ reducer: { preferences: preferencesReducer } });

describe("preferencesSlice reducer", () => {
  it('should have "grid" as the initial viewMode', () => {
    const store = makeStore();
    expect(store.getState().preferences.viewMode).toBe("grid");
  });

  it('setViewMode("table") should switch viewMode to "table"', () => {
    const store = makeStore();
    store.dispatch(setViewMode("table"));
    expect(store.getState().preferences.viewMode).toBe("table");
  });

  it('setViewMode("grid") after table should revert to "grid"', () => {
    const store = makeStore();
    store.dispatch(setViewMode("table"));
    store.dispatch(setViewMode("grid"));
    expect(store.getState().preferences.viewMode).toBe("grid");
  });

  it("should return the current state for unknown actions", () => {
    const state = preferencesReducer(undefined, { type: "UNKNOWN_ACTION" });
    expect(state).toEqual({ viewMode: "grid" });
  });
});

describe("preferencesSlice actions", () => {
  it("setViewMode should create the correct action", () => {
    const action = setViewMode("table");
    expect(action).toEqual({
      type: `${preferencesSlice.name}/setViewMode`,
      payload: "table",
    });
  });
});
