import { Link } from "react-router-dom";
import { BarChart3, Package } from "lucide-react";

export default function AdminHome() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-semibold mb-8 text-center">Espace admin</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/admin/commandes"
            className="bg-card border rounded-xl p-8 flex flex-col items-center justify-center gap-3 hover:bg-muted transition"
          >
            <Package className="w-10 h-10" />
            <span className="text-lg font-medium">Commandes</span>
          </Link>
          <Link
            to="/admin/analytics"
            className="bg-card border rounded-xl p-8 flex flex-col items-center justify-center gap-3 hover:bg-muted transition"
          >
            <BarChart3 className="w-10 h-10" />
            <span className="text-lg font-medium">Analytics</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
