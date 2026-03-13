'use client';

import React, { Suspense, useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Search, Plus, LayoutGrid, List as ListIcon, Loader2 } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';
import { Button, cn } from '@/shared/components/ui/button';
import { 
  useGetProductsQuery, 
  useGetCategoriesQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation
} from './inventoryApi';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/shared/components/ui/table';
import { Card, CardContent } from '@/shared/components/ui/card';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setViewMode } from '@/features/preferences/preferencesSlice';
import { Modal } from '@/shared/components/ui/modal';
import { ProductForm } from './ProductForm';
import { Product, Category } from '@/types';
import { useToast } from '@/shared/components/ui/toast';
import { useDebounce } from '@/shared/hooks/useDebounce';

const ProductsListHeader = ({ onAdd }: { onAdd: () => void }) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useAppDispatch();
    const viewMode = useAppSelector((state) => state.preferences.viewMode);

    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') ?? '');
    const debouncedSearch = useDebounce(searchTerm, 500);

    React.useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());
        if (debouncedSearch) {
            params.set('search', debouncedSearch);
        } else {
            params.delete('search');
        }
        params.delete('skip');
        if (debouncedSearch !== (searchParams.get('search') ?? '')) {
            router.push(`${pathname}?${params.toString()}`);
        }
    }, [debouncedSearch, pathname, router, searchParams]);

    const handleSearchChange = (term: string) => {
        setSearchTerm(term);
    };

    const handleCategoryChange = (cat: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (cat) {
            params.set('category', cat);
        } else {
            params.delete('category');
        }
        params.delete('search');
        params.delete('skip');
        router.push(`${pathname}?${params.toString()}`);
    };

    const { data: categories } = useGetCategoriesQuery();

    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 items-center gap-2">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-dashsuba-secondary" />
                    <Input
                        type="search"
                        placeholder="Search products..."
                        className="pl-8 bg-white"
                        value={searchTerm}
                        onChange={(e) => handleSearchChange(e.target.value)}
                    />
                </div>
                <select
                    className="h-9 rounded-md border border-dashsuba-border bg-white px-3 text-sm focus:outline-none focus:ring-1 focus:ring-dashsuba-accent"
                    value={searchParams.get('category') ?? ''}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                >
                    <option value="">All Categories</option>
                    {categories?.map((cat: Category) => (
                        <option key={cat.slug} value={cat.slug}>
                            {cat.name}
                        </option>
                    ))}
                </select>
            </div>
            
            <div className="flex items-center gap-2">
                <div className="flex items-center rounded-lg border border-dashsuba-border bg-white p-1">
                    <Button 
                        variant={viewMode === 'table' ? 'secondary' : 'ghost'} 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => dispatch(setViewMode('table'))}
                    >
                        <ListIcon className="h-4 w-4" />
                    </Button>
                    <Button 
                        variant={viewMode === 'grid' ? 'secondary' : 'ghost'} 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => dispatch(setViewMode('grid'))}
                    >
                        <LayoutGrid className="h-4 w-4" />
                    </Button>
                </div>
                <Button onClick={onAdd} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Product
                </Button>
            </div>
        </div>
    );
};

const ProductsView = ({ onEdit }: { onEdit: (product: Product) => void }) => {
    const searchParams = useSearchParams();
    const viewMode = useAppSelector((state) => state.preferences.viewMode);
    
    const search = searchParams.get('search') ?? undefined;
    const category = searchParams.get('category') ?? undefined;
    const skip = Number(searchParams.get('skip') ?? 0);
    const limit = 10;

    const { data, isLoading, isError } = useGetProductsQuery({ limit, skip, search, category });

    if (isLoading) return <div className="py-20 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-dashsuba-secondary" /></div>;
    if (isError) return <div className="py-20 text-center text-dashsuba-error">Error loading products.</div>;

    if (viewMode === 'table') {
        return (
            <Card className="overflow-hidden border-none shadow-none bg-transparent">
                <Table className="bg-white rounded-xl border border-dashsuba-border">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px]">Image</TableHead>
                            <TableHead>Product</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data?.products.map((product: Product) => (
                            <TableRow key={product.id}>
                                <TableCell>
                                    <img 
                                        src={product.thumbnail} 
                                        alt={product.title} 
                                        className="h-10 w-10 rounded-md object-cover bg-dashsuba-surface"
                                    />
                                </TableCell>
                                <TableCell>
                                    <div className="font-medium text-dashsuba-primary">{product.title}</div>
                                    <div className="text-xs text-dashsuba-secondary truncate max-w-[200px]">{product.description}</div>
                                </TableCell>
                                <TableCell>
                                    <span className="inline-flex items-center rounded-full bg-dashsuba-surface px-2.5 py-0.5 text-xs font-medium text-dashsuba-secondary border border-dashsuba-border">
                                        {product.category}
                                    </span>
                                </TableCell>
                                <TableCell>${product.price.toFixed(2)}</TableCell>
                                <TableCell>
                                    <span className={cn(
                                        "font-medium",
                                        product.stock < 10 ? "text-dashsuba-error" : "text-dashsuba-primary"
                                    )}>
                                        {product.stock}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm" onClick={() => onEdit(product)}>Edit</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {data?.products.map((product: Product) => (
                <Card key={product.id} className="overflow-hidden group hover:border-dashsuba-secondary transition-all">
                    <div className="aspect-square relative overflow-hidden bg-dashsuba-surface">
                        <img 
                            src={product.thumbnail} 
                            alt={product.title} 
                            className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute top-2 right-2">
                             <span className="inline-flex items-center rounded-full bg-white/90 backdrop-blur-sm px-2 py-1 text-xs font-bold text-dashsuba-primary border border-dashsuba-border">
                                ${product.price}
                            </span>
                        </div>
                    </div>
                    <CardContent className="p-4">
                        <div className="mb-1 text-[10px] font-bold text-dashsuba-secondary uppercase tracking-widest">{product.category}</div>
                        <h4 className="mb-2 font-semibold text-dashsuba-primary truncate">{product.title}</h4>
                        <div className="flex items-center justify-between">
                            <span className={cn(
                                "text-xs font-medium",
                                product.stock < 10 ? "text-dashsuba-error" : "text-dashsuba-secondary"
                            )}>
                                {product.stock} in stock
                            </span>
                            <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => onEdit(product)}>Edit</Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export const InventoryDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [addProduct, { isLoading: isAdding }] = useAddProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const { showToast } = useToast();

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleSubmit = async (formData: Partial<Product>) => {
    try {
        if (editingProduct) {
            await updateProduct({ id: editingProduct.id, patch: formData }).unwrap();
            showToast('Product updated successfully', 'success');
        } else {
            await addProduct(formData).unwrap();
            showToast('Product created successfully', 'success');
        }
        setIsModalOpen(false);
    } catch (error) {
        console.error('Failed to save product:', error);
        showToast('Failed to save product. Please try again.', 'error');
    }
  };

  return (
    <Suspense fallback={<div className="py-20 text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto text-dashsuba-secondary" /></div>}>
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold tracking-tight text-dashsuba-primary">Inventory Management</h1>
                <p className="text-lg text-dashsuba-secondary">Track your products, stock levels, and pricing in real-time.</p>
            </div>
            
            <ProductsListHeader onAdd={handleOpenAdd} />
            <ProductsView onEdit={handleOpenEdit} />
            
            <Modal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                title={editingProduct ? 'Edit Product' : 'Add New Product'}
            >
                <ProductForm 
                    initialData={editingProduct || undefined} 
                    onSubmit={handleSubmit}
                    isLoading={isAdding || isUpdating}
                />
            </Modal>
        </div>
    </Suspense>
  );
};
