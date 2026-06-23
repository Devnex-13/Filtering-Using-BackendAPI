import { useEffect, useMemo, useState } from "react";
import { AlertCircle, Filter, RefreshCw, Search } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

const categories = [
  "Cloths",
  "Electronics",
  "Toys",
  "Beauty",
  "Footware",
  "Glasses",
  "Furniture",
  "Groceries",
  "Sports",
];

function formatPrice(value) {
  const numberValue = Number(value);

  if (Number.isNaN(numberValue)) {
    return "Price unavailable";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(numberValue);
}

function formatDate(value) {
  if (!value) {
    return "No date";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export default function App() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [limit, setLimit] = useState(20);
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      setIsLoading(true);
      setError("");

      const params = new URLSearchParams({ limit: String(limit) });

      if (selectedCategory) {
        params.set("category", selectedCategory);
      }

      try {
        const response = await fetch(`${API_BASE_URL}/products?${params}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Products could not be loaded.");
        }

        const data = await response.json();
        setProducts(data);
      } catch (fetchError) {
        if (fetchError.name !== "AbortError") {
          setError(fetchError.message || "Something went wrong.");
          setProducts([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadProducts();

    return () => controller.abort();
  }, [selectedCategory, limit]);

  const visibleProducts = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase();

    if (!normalizedSearch) {
      return products;
    }

    return products.filter((product) =>
      product.name.toLowerCase().includes(normalizedSearch)
    );
  }, [products, searchText]);

  return (
    <main className="app-shell">
      <section className="toolbar" aria-label="Product filters">
        <div>
          <p className="eyebrow">Product Catalog</p>
          <h1>Browse products by category</h1>
        </div>

        <label className="limit-control">
          <span>Show</span>
          <select value={limit} onChange={(event) => setLimit(Number(event.target.value))}>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={1000}>1000</option>
            <option value={5000}>5000</option>
            <option value={10000}>10000</option>
          </select>
        </label>
      </section>

      <section className="filters" aria-label="Categories">
        <button
          className={!selectedCategory ? "active" : ""}
          type="button"
          onClick={() => setSelectedCategory("")}
        >
          <Filter size={16} />
          All
        </button>

        {categories.map((category) => (
          <button
            className={selectedCategory === category ? "active" : ""}
            key={category}
            type="button"
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </section>

      <section className="search-row" aria-label="Search products">
        <Search size={18} />
        <input
          type="search"
          placeholder="Search loaded products"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
        />
      </section>

      <section className="summary" aria-live="polite">
        <span>{selectedCategory || "All categories"}</span>
        <strong>{visibleProducts.length}</strong>
        <span>products shown</span>
      </section>

      {error ? (
        <section className="state-message error">
          <AlertCircle size={20} />
          <span>{error}</span>
        </section>
      ) : null}

      {isLoading ? (
        <section className="state-message">
          <RefreshCw className="spin" size={20} />
          <span>Loading products...</span>
        </section>
      ) : null}

      {!isLoading && !error && visibleProducts.length === 0 ? (
        <section className="state-message">No matching products found.</section>
      ) : null}

      <section className="product-grid" aria-label="Products">
        {visibleProducts.map((product) => (
          <article className="product-card" key={product.id}>
            <div>
              <span className="category-pill">{product.category}</span>
              <h2>{product.name}</h2>
            </div>
            <p className="price">{formatPrice(product.price)}</p>
            <p className="date">Added {formatDate(product.created_at)}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
