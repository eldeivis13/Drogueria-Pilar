import { ProductForm } from "@/components/admin/ProductForm";

export default async function EditarProductoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Editar producto</h1>
        <p className="text-sm text-gray-500">Modifica los datos del producto</p>
      </div>
      <ProductForm productId={id} />
    </div>
  );
}
