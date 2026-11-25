"use client";

import { useId, useRef, useState } from "react";
import { X } from "lucide-react";
import { money, type Part } from "./catalog-shell";
import { Buy, Stock } from "./parts-list";

export function ProductDetails({ p, add }: { p: Part; add: (part: Part) => void }) {
  const id = useId();
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [added, setAdded] = useState(0);
  return (
    <>
      <button ref={trigger} type="button" className="text-link details-trigger" aria-haspopup="dialog" aria-controls={id} onClick={() => { setAdded(0); dialog.current?.showModal(); }}>
        View full product details<span className="sr-only"> for {p.name}, {p.sku}</span>
      </button>
      <dialog ref={dialog} id={id} className="product-detail" aria-labelledby={`${id}-name`}
        onKeyDown={event => { if (event.key === "Escape") event.stopPropagation(); }}
        onClose={() => trigger.current?.focus({ preventScroll: true })}>
        <header className="detail-heading"><div><small>LOCAL PROTOTYPE · FIGURE {p.figure}</small><h2 id={`${id}-name`}>{p.name}</h2></div><button type="button" aria-label="Close product details" onClick={() => dialog.current?.close()}><X size={20}/></button></header>
        <p>Part # <strong>{p.sku}</strong></p>
        {p.photo && <img src={p.photo} alt={p.name} width="112" height="96" loading="lazy" />}
        <p>{p.description}</p>
        <p className="compatibility"><strong>Demo compatibility only.</strong> Confirm the figure and part number in the manufacturer PDF for your exact model and type. Price and availability are simulated.</p>
        <div className="cost"><strong>{money(p.price)}</strong><Stock p={p}/></div>
        <Buy p={p} add={part => { add(part); setAdded(n => n + 1); }}/>
        <span role="status" className="detail-status">{added > 0 && `${added} added to the demo cart.`}</span>
      </dialog>
    </>
  );
}
