'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Product, Category } from '@/types';
import { useGetCategoriesQuery } from './inventoryApi';

const productSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  price: z.number().min(0.01, 'Price must be greater than 0'),
  stock: z.number().int().min(0, 'Stock cannot be negative'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  initialData?: Partial<Product>;
  onSubmit: (data: ProductFormData) => void;
  isLoading?: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({ initialData, onSubmit, isLoading }) => {
    const { data: categories } = useGetCategoriesQuery();
    
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ProductFormData>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            title: initialData?.title || '',
            price: initialData?.price || 0,
            stock: initialData?.stock || 0,
            category: initialData?.category || '',
            description: initialData?.description || '',
        },
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <label className="text-sm font-medium text-dashsuba-primary">Product Title</label>
                <Input {...register('title')} placeholder="iPhone 15 Pro" />
                {errors.title && <p className="text-xs text-dashsuba-error">{errors.title.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-dashsuba-primary">Price ($)</label>
                    <Input 
                        type="number" 
                        step="0.01" 
                        {...register('price', { valueAsNumber: true })} 
                    />
                    {errors.price && <p className="text-xs text-dashsuba-error">{errors.price.message}</p>}
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-dashsuba-primary">Stock Quantity</label>
                    <Input 
                        type="number" 
                        {...register('stock', { valueAsNumber: true })} 
                    />
                    {errors.stock && <p className="text-xs text-dashsuba-error">{errors.stock.message}</p>}
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-dashsuba-primary">Category</label>
                <select
                    className="flex h-9 w-full rounded-md border border-dashsuba-border bg-white px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-dashsuba-accent"
                    {...register('category')}
                >
                    <option value="">Select a category</option>
                    {categories?.map((cat: Category) => (
                        <option key={cat.slug} value={cat.slug}>
                            {cat.name}
                        </option>
                    ))}
                </select>
                {errors.category && <p className="text-xs text-dashsuba-error">{errors.category.message}</p>}
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-dashsuba-primary">Description</label>
                <textarea
                    className="flex min-h-[80px] w-full rounded-md border border-dashsuba-border bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-dashsuba-secondary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-dashsuba-accent"
                    {...register('description')}
                    placeholder="Provide a detailed description of the product"
                />
                {errors.description && <p className="text-xs text-dashsuba-error">{errors.description.message}</p>}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-dashsuba-border">
                <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                    {isLoading ? 'Saving...' : initialData ? 'Update Product' : 'Create Product'}
                </Button>
            </div>
        </form>
    );
};
