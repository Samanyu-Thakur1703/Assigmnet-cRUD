import { useEffect, useState } from "react";
import { api } from "../api";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  stock: "",
  category: "",
  imageUrl: ""
};

export default function Products({ user }) {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadProducts = async () => {
    try {
      const data = await api.getProducts();
      setProducts(data.products);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock)
    };

    try {
      if (editingId) {
        await api.updateProduct(editingId, payload);
        setMessage("Product updated.");
      } else {
        await api.createProduct(payload);
        setMessage("Product created.");
      }

      setForm(emptyForm);
      setEditingId(null);
      await loadProducts();
    } catch (err) {
      setError(
        Object.values(err.data?.errors || {})[0] ||
        err.message
      );
    }
  };

  const edit = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category,
      imageUrl: product.imageUrl || ""
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await api.deleteProduct(id);
      setMessage("Product deleted.");
      await loadProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <header className="hero">
        <div>
          <h1>Products</h1>
          <p className="muted">
            Public product listing with authenticated CRUD operations.
          </p>
        </div>
      </header>

      {error && <div className="error">{error}</div>}
      {message && <div className="success">{message}</div>}

      {user ? (
        <section className="product-form-card">
          <h2>{editingId ? "Edit product" : "Add product"}</h2>
          <form onSubmit={submit} className="product-form">
            <input
              placeholder="Product name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <input
              placeholder="Category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              required
            />
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="Price"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
            />
            <input
              type="number"
              min="0"
              step="1"
              placeholder="Stock"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              required
            />
            <input
              placeholder="Image URL (optional)"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            />
            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
            />

            <div className="form-actions">
              <button className="primary-button">
                {editingId ? "Update product" : "Create product"}
              </button>
              {editingId && (
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => {
                    setEditingId(null);
                    setForm(emptyForm);
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>
      ) : (
        <div className="info">
          Log in to create, edit, or delete products. Browsing is public.
        </div>
      )}

      <section className="product-grid">
        {products.map((product) => (
          <article className="product-card" key={product._id}>
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name} />
            ) : (
              <div className="image-placeholder">No image</div>
            )}

            <div className="product-content">
              <span className="tag">{product.category}</span>
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <strong>₹{Number(product.price).toFixed(2)}</strong>
              <small>Stock: {product.stock}</small>

              {user && (
                <div className="card-actions">
                  <button className="secondary-button" onClick={() => edit(product)}>
                    Edit
                  </button>
                  <button className="danger-button" onClick={() => remove(product._id)}>
                    Delete
                  </button>
                </div>
              )}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
