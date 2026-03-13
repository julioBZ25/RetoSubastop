import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/store";
import { inventoryApi } from "./inventoryApi";

type ProductQueryArgs = {
  limit: number;
  skip: number;
  search?: string;
  category?: string;
};

export const selectPreferences = (state: RootState) => state.preferences;

export const selectViewMode = createSelector(
  selectPreferences,
  (preferences) => preferences.viewMode,
);

const selectorsCache = new Map<
  string,
  ReturnType<typeof inventoryApi.endpoints.getProducts.select>
>();

const getProductsSelector = (args: ProductQueryArgs) => {
  const key = JSON.stringify(args);
  if (!selectorsCache.has(key)) {
    selectorsCache.set(key, inventoryApi.endpoints.getProducts.select(args));
  }
  return selectorsCache.get(key)!;
};

export const selectLowStockProducts = createSelector(
  (state: RootState, args: ProductQueryArgs) =>
    getProductsSelector(args)(state),
  (queryResult) => queryResult.data?.products.filter((p) => p.stock < 10) ?? [],
);

export const selectProductsTotal = createSelector(
  (state: RootState, args: ProductQueryArgs) =>
    getProductsSelector(args)(state),
  (queryResult) => queryResult.data?.total ?? 0,
);
