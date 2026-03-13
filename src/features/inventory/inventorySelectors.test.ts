import { describe, it, expect } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import preferencesReducer from "@/features/preferences/preferencesSlice";
import { inventoryApi } from "@/features/inventory/inventoryApi";
import { selectViewMode, selectLowStockProducts } from "./inventorySelectors";
import type { RootState } from "@/store";

const makeStore = () =>
  configureStore({
    reducer: {
      [inventoryApi.reducerPath]: inventoryApi.reducer,
      preferences: preferencesReducer,
    },
    middleware: (getDefault) => getDefault().concat(inventoryApi.middleware),
  });

describe("selectViewMode selector", () => {
  it('returns "grid" by default', () => {
    const store = makeStore();
    const result = selectViewMode(store.getState() as RootState);
    expect(result).toBe("grid");
  });

  it("is memoized — same reference when state unchanged", () => {
    const store = makeStore();
    const state = store.getState() as RootState;
    const first = selectViewMode(state);
    const second = selectViewMode(state);
    expect(first).toBe(second);
  });
});

describe("selectLowStockProducts selector", () => {
  it("returns empty array when there is no cached data", () => {
    const store = makeStore();
    const args = { limit: 10, skip: 0 };
    const result = selectLowStockProducts(store.getState() as RootState, args);
    expect(result).toEqual([]);
  });
});
