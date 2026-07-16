# Ecommerce-Wishlist
# 🛒 Simple Storefront — Wishlist Merge Demo

A lightweight, static e-commerce storefront built with **plain HTML, CSS, and JavaScript** — no frameworks, no build tools, no backend. Users can browse products, maintain two independent wishlists, and merge them into a single deduplicated list.

Designed to be deployed as-is on **GitHub Pages** or any static host.

**[🔗 Live Demo](#)** — https://vigneshwaranb14.github.io/Ecommerce-Wishlist/

---

## Table of Contents

- [Features](#features)
- [Folder Structure](#folder-structure)
- [Getting Started](#getting-started)
- [Deploying to GitHub Pages](#deploying-to-github-pages)
- [Merge Behavior](#merge-behavior)
- [Data Persistence](#data-persistence)
- [Testing](#testing)
- [Accessibility](#accessibility)
- [Known Limitations](#known-limitations)
- [Tech Stack](#tech-stack)
- [License](#license)

---

## Features

- 📦 **6 sample products**, each with an image, name, category, price, and two "Add to Wishlist" actions.
- ❤️ **Two independent wishlists** (Wishlist A and Wishlist B) — add, remove, and track items separately.
- 🔀 **One-click merge** — combines both wishlists into a single deduplicated Merged Wishlist.
- 💾 **Persistent storage** — all wishlist data is saved to the browser's `localStorage` and survives page refreshes.
- 🔄 **Cross-tab sync** — changes made in one open tab are reflected in others automatically.
- ♿ **Accessible by default** — labeled controls, live regions for dynamic updates, and full keyboard support.
- 📱 **Responsive layout** — adapts cleanly from desktop to mobile.

---

## Folder Structure

```
ecommerce-wishlist/
├── index.html            # Page structure (product grid + wishlist columns)
├── style.css             # Responsive, accessible styling
├── script.js              # Product data, wishlist logic, localStorage, merge logic
├── TESTING_CHECKLIST.md   # Manual QA checklist covering core scenarios and edge cases
└── README.md              # This file
```

---

## Getting Started

No installation, dependencies, or build step required.

1. Clone or download this repository.
2. Open `index.html` directly in any modern browser (double-click it, or drag it into a browser window).

That's it — the app runs entirely client-side.

### Optional: run via a local server

Not required, but if you'd rather serve it locally instead of using `file://`:

```bash
cd ecommerce-wishlist
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

---

## Deploying to GitHub Pages

1. Create a new **public** GitHub repository.
2. Push this project to it:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/your-repo-name.git
   git push -u origin main
   ```
3. In the repository, go to **Settings → Pages**.
4. Under **Source**, choose **Deploy from a branch** → Branch: `main`, Folder: `/ (root)`.
5. Save. Your site will be live within a couple of minutes at:
   ```
   https://yourusername.github.io/your-repo-name/
   ```

---

## Merge Behavior

Clicking **"🔀 Merge Wishlist A + Wishlist B"**:

- Combines items from both wishlists into the Merged Wishlist.
- **Deduplicates by product ID** — a product in both A and B appears only once in the result.
- **Preserves insertion order** — Wishlist A's items appear first (in their original order), followed by any new items from Wishlist B.
- **Keeps the earliest timestamp** when the same product exists in both wishlists, reflecting when it was first wishlisted.
- **Never modifies Wishlist A or B** — merging is non-destructive; the source lists are always left intact.
- **Is idempotent** — merging repeatedly with no changes to A or B always produces the same result, with no duplicate stacking.

> **Note:** The Merged Wishlist is a manual snapshot, not a live view. If you change Wishlist A or B after merging, click Merge again to refresh the combined list.

**Example:**

| Wishlist A | Wishlist B | Merged Result |
|---|---|---|
| Headphones, Mug | Mug, Backpack | Headphones, Mug, Backpack |

---

## Data Persistence

All data is stored in the browser's `localStorage`:

| Key | Contents |
|---|---|
| `wishlist-a` | Items in Wishlist A |
| `wishlist-b` | Items in Wishlist B |
| `wishlist-merged` | Items in the Merged Wishlist |

Each item is stored as:

```json
{ "productId": "p001", "addedAt": "2026-07-15T10:00:00.000Z" }
```

Only the product ID and timestamp are stored — full product details (name, price, image) are always looked up from the static product list in `script.js`, keeping stored data minimal.

> Data is browser-local only. It won't sync across different browsers or devices, and clearing browser storage will reset all wishlists. If saving ever fails (e.g. storage disabled or full), a warning banner appears so you're not silently losing data.

---

## Testing

See [`TESTING_CHECKLIST.md`](./TESTING_CHECKLIST.md) for a full manual QA checklist, covering:

- Empty wishlist states (A empty, B empty, both empty)
- Duplicate products across wishlists
- Page refresh / persistence
- Item removal (from A, B, and the merged list)
- Repeated merges and post-merge additions
- Cross-tab sync, keyboard navigation, and screen reader behavior

---

## Accessibility

- All interactive controls have descriptive `aria-label`s (e.g. "Add Coffee Mug to Wishlist A") rather than generic labels.
- Wishlist lists use `aria-live="polite"` so screen readers announce additions, removals, and merges.
- Full keyboard navigation — every action is reachable via Tab and Enter/Space.
- Color contrast checked against WCAG AA guidelines.

---

## Known Limitations

By design, to keep this a simple, single-purpose demo (see the original V1 specification):

- No accounts, login, or multi-user support — single browser, single user.
- No shopping cart or checkout flow.
- Product catalog is static and not editable through the UI.
- Only two source wishlists (A and B) are supported — not arbitrary N wishlists.
- No "undo" for merges (though Wishlist A and B are always preserved, so nothing is ever lost).

---

## Tech Stack

- **HTML5** — semantic structure
- **CSS3** — responsive Grid/Flexbox layout, no framework
- **Vanilla JavaScript (ES6+)** — no libraries, no bundler
- **Browser `localStorage`** — client-side persistence

---

## License

This project is provided as-is for educational/assessment purposes. Feel free to adapt or reuse it.

##Output 

<img width="1918" height="1018" alt="image" src="https://github.com/user-attachments/assets/22e846c9-9bfc-4aed-bd0f-f7bdb9eb77ad" />

<img width="1916" height="1020" alt="image" src="https://github.com/user-attachments/assets/7da37b58-f7db-4c51-aae8-1529ff002e94" />

<img width="1918" height="1018" alt="image" src="https://github.com/user-attachments/assets/c7652d78-ec9f-4c20-a111-0c182a975730" /> 


