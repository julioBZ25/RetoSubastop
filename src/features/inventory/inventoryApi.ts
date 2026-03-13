import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Product, PaginatedResponse, Category } from "@/types";

type ProductQueryArgs = {
  limit?: number;
  skip?: number;
  search?: string;
  category?: string;
};

export const inventoryApi = createApi({
  reducerPath: "inventoryApi",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL }),
  tagTypes: ["Product", "Category"],
  endpoints: (builder) => ({
    getProducts: builder.query<PaginatedResponse<Product>, ProductQueryArgs>({
      query: ({ limit = 10, skip = 0, search = "", category = "" }) => {
        if (search)
          return `products/search?q=${search}&limit=${limit}&skip=${skip}`;
        if (category)
          return `products/category/${category}?limit=${limit}&skip=${skip}`;
        return `products?limit=${limit}&skip=${skip}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.products.map(({ id }) => ({
                type: "Product" as const,
                id,
              })),
              { type: "Product", id: "LIST" },
            ]
          : [{ type: "Product", id: "LIST" }],
    }),

    getCategories: builder.query<Category[], void>({
      query: () => "products/categories",
      providesTags: ["Category"],
    }),

    getProduct: builder.query<Product, number>({
      query: (id) => `products/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Product", id }],
    }),

    addProduct: builder.mutation<Product, Partial<Product>>({
      query: (body) => ({ url: "products/add", method: "POST", body }),
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),

    updateProduct: builder.mutation<
      Product,
      { id: number; patch: Partial<Product> }
    >({
      query: ({ id, patch }) => ({
        url: `products/${id}`,
        method: "PATCH",
        body: patch,
      }),

      async onQueryStarted(
        { id, patch },
        { dispatch, queryFulfilled, getState },
      ) {
        interface QueryEntry {
          endpointName?: string;
          status?: string;
          originalArgs?: ProductQueryArgs;
        }

        const getActiveProductsQueries = (): {
          endpointName: string;
          status: string;
          originalArgs: ProductQueryArgs;
        }[] => {
          const state = getState() as Record<
            string,
            { queries?: Record<string, QueryEntry | undefined> }
          >;
          const queries = state[inventoryApi.reducerPath]?.queries ?? {};
          return Object.values(queries).filter(
            (
              q,
            ): q is {
              endpointName: string;
              status: string;
              originalArgs: ProductQueryArgs;
            } =>
              q?.endpointName === "getProducts" &&
              q?.status === "fulfilled" &&
              q?.originalArgs !== undefined,
          );
        };

        const patchResults: { undo: () => void }[] = [];

        for (const query of getActiveProductsQueries()) {
          const result = dispatch(
            inventoryApi.util.updateQueryData(
              "getProducts",
              query.originalArgs,
              (draft) => {
                const product = draft.products.find((p) => p.id === id);
                if (product) Object.assign(product, patch);
              },
            ),
          );
          patchResults.push(result);
        }

        const individualPatch = dispatch(
          inventoryApi.util.updateQueryData("getProduct", id, (draft) => {
            Object.assign(draft, patch);
          }),
        );
        patchResults.push(individualPatch);

        try {
          await queryFulfilled;
        } catch {
          patchResults.forEach((pr) => pr.undo());
        }
      },
    }),

    deleteProduct: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({ url: `products/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetCategoriesQuery,
  useGetProductQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = inventoryApi;
