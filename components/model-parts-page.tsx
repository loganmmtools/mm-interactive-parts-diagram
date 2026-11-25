"use client";
import { useEffect, useRef, useState } from "react";
import { X, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import {
  Header,
  Heading,
  FullDiagramCTA,
  PartIdentificationGuide,
  money,
  type Part,
} from "./catalog-shell";
import { ModelPartsSearch, PartsTable, PartImage } from "./parts-list";
import { ResponsivePDFViewer } from "./pdf-viewer";
import products from "@/lib/catalog.json";
export function ModelPartsPage() {
  const [q, setQ] = useState(""),
    [page, setPage] = useState(2),
    [demo, setDemo] = useState(false),
    [cart, setCart] = useState<Record<string, number>>({}),
    [toast, setToast] = useState("");
  const drawer = useRef<HTMLDialogElement>(null),
    timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const entries = products.filter((p) => cart[p.sku] > 0),
    count = Object.values(cart).reduce((a, b) => a + b, 0);
  function change(s: string) {
    setQ(s);
    setPage(1);
  }
  function show(p: Part) {
    setQ("");
    setPage(Math.floor(products.findIndex((r) => r.sku === p.sku) / 20) + 1);
    requestAnimationFrame(() => {
      const row = [
        ...document.querySelectorAll<HTMLElement>(`[data-part="${p.sku}"]`),
      ].find((el) => el.offsetWidth);
      row?.scrollIntoView({ block: "center" });
      row?.animate(
        [{ backgroundColor: "#ffebb3" }, { backgroundColor: "white" }],
        1800,
      );
    });
  }
  function add(p: Part) {
    setCart((c) => ({ ...c, [p.sku]: (c[p.sku] || 0) + 1 }));
    setToast(`${p.name} added to cart`);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(""), 3000);
  }
  function qty(p: Part, n: number) {
    setCart((c) => ({ ...c, [p.sku]: Math.max(0, n) }));
  }
  return (
    <>
      <Header
        count={count}
        show={show}
        openCart={() => drawer.current?.showModal()}
      />
      <main>
        <Heading />
        <div className="model-grid">
          <FullDiagramCTA demo={demo} />
          <ResponsivePDFViewer
            demo={demo}
            key={demo ? "demo" : "oem"}
            add={add}
            show={show}
          />
          <PartIdentificationGuide />
          <ModelPartsSearch q={q} change={change} />
        </div>
        <PartsTable
          q={q}
          page={page}
          change={setPage}
          add={add}
          clear={() => change("")}
        />
        <footer className="site-footer">
          <label>
            Demo document{" "}
            <select
              value={demo ? "demo" : "manufacturer"}
              onChange={(e) => {
                setDemo(e.target.value === "demo");
                document
                  .querySelector(".viewer")
                  ?.scrollIntoView({ block: "start" });
              }}
            >
              <option value="manufacturer">Manufacturer diagram</option>
              <option value="demo">Mixed-orientation demo (3 pages)</option>
            </select>
          </label>
          <p>
            Local prototype · Prices, inventory and sample figure matches are
            for demonstration only. Verify all parts against the manufacturer
            PDF.
          </p>
        </footer>
      </main>
      <dialog
        ref={drawer}
        className="drawer"
        aria-labelledby="cart-title"
        onClick={(e) => {
          if (e.target === drawer.current) {
            const r = drawer.current.getBoundingClientRect();
            if (e.clientX < r.left || e.clientX > r.right)
              drawer.current.close();
          }
        }}
      >
        <div className="drawer-head">
          <h2 id="cart-title">Your Cart ({count})</h2>
          <button
            aria-label="Close cart"
            onClick={() => drawer.current?.close()}
          >
            <X />
          </button>
        </div>
        {entries.length ? (
          <>
            {entries.map((p) => (
              <div className="cart-row" key={p.sku}>
                <PartImage p={p} />
                <div>
                  <b>{p.name}</b>
                  <small>Part # {p.sku}</small>
                  <div className="quantity">
                    <button
                      aria-label={`Decrease ${p.sku} quantity`}
                      onClick={() => qty(p, cart[p.sku] - 1)}
                    >
                      <Minus size={14} />
                    </button>
                    {cart[p.sku]}
                    <button
                      aria-label={`Increase ${p.sku} quantity`}
                      onClick={() => qty(p, cart[p.sku] + 1)}
                    >
                      <Plus size={14} />
                    </button>
                    <button
                      aria-label={`Remove ${p.sku}`}
                      onClick={() => qty(p, 0)}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
                <b>{money(p.price * cart[p.sku])}</b>
              </div>
            ))}
            <div className="subtotal">
              <b>Subtotal</b>
              <b>
                {money(entries.reduce((s, p) => s + p.price * cart[p.sku], 0))}
              </b>
            </div>
            <p>Simulated cart. No payment will be taken.</p>
          </>
        ) : (
          <div className="empty">
            <ShoppingCart />
            <h3>Your cart is empty</h3>
            <p>Select a figure or browse the parts list to add a part.</p>
          </div>
        )}
        <button className="buy" onClick={() => drawer.current?.close()}>
          Continue browsing
        </button>
      </dialog>
      <div role="status" className={toast ? "toast" : ""}>
        {toast}
      </div>
    </>
  );
}
