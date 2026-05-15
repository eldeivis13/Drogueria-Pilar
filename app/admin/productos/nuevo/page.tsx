import { ProductForm } from "@/components/admin/ProductForm";

export default function NuevoProductoPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Nuevo producto</h1>
        <p className="text-sm text-gray-500">Completa los datos para agregar un producto al catálogo</p>
      </div>
      <ProductForm />
    </div>
  );
}
