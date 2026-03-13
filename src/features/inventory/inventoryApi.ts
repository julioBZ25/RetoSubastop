import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Product, PaginatedResponse, Category } from '@/types';

export const inventoryApi = createApi({
  reducerPath: 'inventoryApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://dummyjson.com/' }),
  tagTypes: ['Product', 'Category'],
  endpoints: (builder) => ({
    getProducts: builder.query<PaginatedResponse<Product>, { limit?: number; skip?: number; search?: string; category?: string }>({
      query: ({ limit = 10, skip = 0, search = '', category = '' }) => {
        if (search) {
          return `products/search?q=${search}&limit=${limit}&skip=${skip}`;
        }
        if (category) {
          return `products/category/${category}?limit=${limit}&skip=${skip}`;
        }
        return `products?limit=${limit}&skip=${skip}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.products.map(({ id }) => ({ type: 'Product' as const, id })),
              { type: 'Product', id: 'LIST' },
            ]
          : [{ type: 'Product', id: 'LIST' }],
    }),
    getCategories: builder.query<Category[], void>({
      query: () => 'products/categories',
      providesTags: ['Category'],
    }),
    getProduct: builder.query<Product, number>({
      query: (id) => `products/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Product', id }],
    }),
    addProduct: builder.mutation<Product, Partial<Product>>({
      query: (body) => ({
        url: 'products/add',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Product', id: 'LIST' }],
    }),
    updateProduct: builder.mutation<Product, { id: number; patch: Partial<Product> }>({
      query: ({ id, patch }) => ({
        url: `products/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      async onQueryStarted({ id, patch }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          inventoryApi.util.updateQueryData('getProducts', { limit: 10, skip: 0 }, (draft) => {
            const product = draft.products.find((p) => p.id === id);
            if (product) {
              Object.assign(product, patch);
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Product', id }],
    }),
    deleteProduct: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Product', id: 'LIST' }],
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
