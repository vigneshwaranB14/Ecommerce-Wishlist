/* =====================================================
   SCRIPT.JS
   Simple E-Commerce Storefront with Wishlist Merge Feature

   This file is organized into sections:
   1. Product Data
   2. LocalStorage Keys & Helpers
   3. Wishlist State (load/save)
   4. Rendering Functions (draw things on the page)
   5. Wishlist Actions (add / remove / merge)
   6. Event Listeners (wire up buttons)
   7. Initial Page Load
   ===================================================== */


/* =====================================================
   1. PRODUCT DATA
   A small, static list of 6 sample products.
   Each product has a unique "id" which we use everywhere
   (wishlists only store this id, not a full copy).
   ===================================================== */
const PRODUCTS = [
  {
    id: "p001",
    name: "Wireless Headphones",
    category: "Electronics",
    price: 49.99,
    imageUrl: "https://placehold.co/300x200/4361ee/ffffff?text=Headphones"
  },
  {
    id: "p002",
    name: "Running Shoes",
    category: "Footwear",
    price: 65.0,
    imageUrl: "https://placehold.co/300x200/f3722c/ffffff?text=Shoes"
  },
  {
    id: "p003",
    name: "Coffee Mug",
    category: "Home",
    price: 12.5,
    imageUrl: "https://placehold.co/300x200/43aa8b/ffffff?text=Mug"
  },
  {
    id: "p004",
    name: "Backpack",
    category: "Accessories",
    price: 39.99,
    imageUrl: "https://placehold.co/300x200/9d4edd/ffffff?text=Backpack"
  },
  {
    id: "p005",
    name: "Desk Lamp",
    category: "Home",
    price: 22.75,
    imageUrl: "https://placehold.co/300x200/f9c74f/222222?text=Lamp"
  },
  {
    id: "p006",
    name: "Smart Watch",
    category: "Electronics",
    price: 89.0,
    imageUrl: "https://placehold.co/300x200/e63946/ffffff?text=Smart+Watch"
  }
];


/* =====================================================
   2. LOCALSTORAGE KEYS & HELPERS
   We keep all localStorage key names in one place so we
   never mistype a key string somewhere else in the file.
   ===================================================== */
const STORAGE_KEYS = {
  wishlistA: "wishlist-a",
  wishlistB: "wishlist-b",
  wishlistMerged: "wishlist-merged"
};

/**
 * Reads a wishlist (array of items) from localStorage.
 * Returns an empty array if nothing is stored yet, or if
 * the stored value is corrupted somehow.
 */
function loadWishlistFromStorage(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    // If localStorage is disabled or data is corrupted,
    // fail gracefully instead of crashing the app.
    console.warn("Could not read from localStorage:", err);
    return [];
  }
}

/**
 * Saves a wishlist (array of items) to localStorage.
 * Returns true on success, false on failure, so callers
 * can warn the user if data isn't actually being saved
 * (e.g. localStorage disabled, or storage quota exceeded).
 */
function saveWishlistToStorage(key, items) {
  try {
    localStorage.setItem(key, JSON.stringify(items));
    return true;
  } catch (err) {
    console.warn("Could not save to localStorage:", err);
    showStorageWarning();
    return false;
  }
}

/**
 * Shows a small, dismissible banner if we ever fail to save
 * to localStorage, so the user knows their changes might not
 * persist after a refresh (instead of silently losing data).
 */
function showStorageWarning() {
  const banner = document.getElementById("storage-warning");
  if (banner) {
    banner.hidden = false;
  }
}


/* =====================================================
   3. WISHLIST STATE
   Each wishlist is an array of items shaped like:
   { productId: "p001", addedAt: "2026-07-15T10:00:00.000Z" }

   We keep three lists in memory, loaded from localStorage
   when the page first opens.
   ===================================================== */
let wishlistA = loadWishlistFromStorage(STORAGE_KEYS.wishlistA);
let wishlistB = loadWishlistFromStorage(STORAGE_KEYS.wishlistB);
let wishlistMerged = loadWishlistFromStorage(STORAGE_KEYS.wishlistMerged);


/* =====================================================
   4. RENDERING FUNCTIONS
   These functions read from our data/state and update
   the HTML on the page. They don't change any data.
   ===================================================== */

/**
 * Looks up full product details (name, price, etc.) using
 * a productId. Wishlists only store the id, so we need
 * this to display anything useful.
 */
function findProductById(productId) {
  return PRODUCTS.find((product) => product.id === productId);
}

/**
 * Renders all product cards into the #product-list container.
 * Re-run after every wishlist change (not just once) so each
 * "Add to Wishlist" button can show whether that product is
 * already in that wishlist - this gives the user clear
 * feedback instead of a silent no-op on a repeat click.
 */
function renderProducts() {
  const container = document.getElementById("product-list");
  container.innerHTML = ""; // clear before drawing

  PRODUCTS.forEach((product) => {
    const inWishlistA = wishlistA.some((item) => item.productId === product.id);
    const inWishlistB = wishlistB.some((item) => item.productId === product.id);

    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <img src="${product.imageUrl}" alt="${product.name}" />
      <div class="product-name">${product.name}</div>
      <div class="product-category">${product.category}</div>
      <div class="product-price">$${product.price.toFixed(2)}</div>
      <div class="product-actions">
        <button
          type="button"
          class="btn-a"
          data-product-id="${product.id}"
          data-target="A"
          aria-label="${inWishlistA ? `${product.name} is already in Wishlist A` : `Add ${product.name} to Wishlist A`}"
          ${inWishlistA ? "disabled" : ""}
        >
          ${inWishlistA ? "✓ In Wishlist A" : "+ Wishlist A"}
        </button>
        <button
          type="button"
          class="btn-b"
          data-product-id="${product.id}"
          data-target="B"
          aria-label="${inWishlistB ? `${product.name} is already in Wishlist B` : `Add ${product.name} to Wishlist B`}"
          ${inWishlistB ? "disabled" : ""}
        >
          ${inWishlistB ? "✓ In Wishlist B" : "+ Wishlist B"}
        </button>
      </div>
    `;

    container.appendChild(card);
  });
}

/**
 * Renders one wishlist (A, B, or Merged) into its <ul> element.
 * @param {Array} items - the wishlist's array of {productId, addedAt}
 * @param {string} listElementId - id of the <ul> to render into
 * @param {string} sourceWishlist - "A", "B", or "merged" (used so
 *   the remove button knows which wishlist to remove the item from)
 * @param {string} sourceLabel - human-readable label for aria-labels,
 *   e.g. "Wishlist A" or "the Merged Wishlist"
 */
function renderWishlist(items, listElementId, sourceWishlist, sourceLabel) {
  const listEl = document.getElementById(listElementId);
  listEl.innerHTML = ""; // clear before drawing

  if (items.length === 0) {
    listEl.innerHTML = `<li class="empty-message">No items yet.</li>`;
    return;
  }

  items.forEach((item) => {
    const product = findProductById(item.productId);

    // Edge case: product might no longer exist in the catalog.
    if (!product) {
      const li = document.createElement("li");
      li.className = "wishlist-item";
      li.innerHTML = `
        <span class="item-info">
          <span class="item-name">Product unavailable</span>
        </span>
        <button
          type="button"
          class="remove-btn"
          data-product-id="${item.productId}"
          data-source="${sourceWishlist}"
          aria-label="Remove unavailable product from ${sourceLabel}"
        >
          Remove
        </button>
      `;
      listEl.appendChild(li);
      return;
    }

    const li = document.createElement("li");
    li.className = "wishlist-item";
    li.innerHTML = `
      <span class="item-info">
        <span class="item-name">${product.name}</span>
        <span class="item-price">$${product.price.toFixed(2)}</span>
      </span>
      <button
        type="button"
        class="remove-btn"
        data-product-id="${product.id}"
        data-source="${sourceWishlist}"
        aria-label="Remove ${product.name} from ${sourceLabel}"
      >
        Remove
      </button>
    `;
    listEl.appendChild(li);
  });
}

/**
 * Re-draws the product grid and all three wishlists. Call this
 * after any change (add, remove, or merge) so everything stays
 * in sync - including the "already added" button states.
 */
function renderAllWishlists() {
  renderWishlist(wishlistA, "wishlist-a-list", "A", "Wishlist A");
  renderWishlist(wishlistB, "wishlist-b-list", "B", "Wishlist B");
  renderWishlist(wishlistMerged, "wishlist-merged-list", "merged", "the Merged Wishlist");
  renderProducts();
  updateMergeButtonState();
}

/**
 * Disables the Merge button when there is nothing to merge
 * (both Wishlist A and Wishlist B are empty), so the user
 * isn't invited to click a button that would do nothing.
 */
function updateMergeButtonState() {
  const mergeBtn = document.getElementById("merge-btn");
  const nothingToMerge = wishlistA.length === 0 && wishlistB.length === 0;
  mergeBtn.disabled = nothingToMerge;
}


/* =====================================================
   5. WISHLIST ACTIONS
   Functions that actually change wishlist data, then
   save to localStorage and re-render the page.
   ===================================================== */

/**
 * Adds a product to Wishlist A or B.
 * Does nothing if the product is already in that wishlist
 * (no duplicates within a single wishlist) - the "Add" button
 * for that product is also disabled once added, so this is
 * mostly a safety net rather than something a user can trigger.
 */
function addToWishlist(productId, target) {
  const wishlist = target === "A" ? wishlistA : wishlistB;

  const alreadyExists = wishlist.some((item) => item.productId === productId);
  if (alreadyExists) {
    return; // no-op: product is already in this wishlist
  }

  wishlist.push({
    productId: productId,
    addedAt: new Date().toISOString()
  });

  if (target === "A") {
    saveWishlistToStorage(STORAGE_KEYS.wishlistA, wishlistA);
  } else {
    saveWishlistToStorage(STORAGE_KEYS.wishlistB, wishlistB);
  }

  renderAllWishlists();
}

/**
 * Removes a product from a given wishlist ("A", "B", or "merged").
 */
function removeFromWishlist(productId, source) {
  if (source === "A") {
    wishlistA = wishlistA.filter((item) => item.productId !== productId);
    saveWishlistToStorage(STORAGE_KEYS.wishlistA, wishlistA);
  } else if (source === "B") {
    wishlistB = wishlistB.filter((item) => item.productId !== productId);
    saveWishlistToStorage(STORAGE_KEYS.wishlistB, wishlistB);
  } else if (source === "merged") {
    wishlistMerged = wishlistMerged.filter((item) => item.productId !== productId);
    saveWishlistToStorage(STORAGE_KEYS.wishlistMerged, wishlistMerged);
  }

  renderAllWishlists();
}

/**
 * MERGE LOGIC (the core required feature).
 *
 * Rules:
 * - Combine items from Wishlist A and Wishlist B.
 * - Remove duplicates based on productId (a product should
 *   never appear twice in the merged list).
 * - Preserve insertion order: all of Wishlist A's items keep
 *   their original order first, then any NEW items from
 *   Wishlist B are appended in their original order.
 * - If the same product exists in BOTH wishlists (with two
 *   different "addedAt" timestamps), keep the EARLIER timestamp,
 *   since that reflects when the user first wishlisted it.
 * - Wishlist A and Wishlist B are NOT modified by this action.
 * - Running merge again always produces the same result
 *   (it's not additive/stacking - it fully replaces the
 *   merged list each time based on the current A + B).
 */
function mergeWishlists() {
  // Step 1: for every productId, figure out which item (A's or B's)
  // has the earlier "addedAt" timestamp. That's the one we'll keep.
  const earliestItemByProductId = new Map();

  [...wishlistA, ...wishlistB].forEach((item) => {
    const existing = earliestItemByProductId.get(item.productId);
    if (!existing || new Date(item.addedAt) < new Date(existing.addedAt)) {
      earliestItemByProductId.set(item.productId, item);
    }
  });

  // Step 2: build the final list in insertion order (A first, then
  // any new items from B), but using the earliest-timestamp version
  // of each item chosen in Step 1.
  const seenProductIds = new Set();
  const result = [];

  [...wishlistA, ...wishlistB].forEach((item) => {
    if (!seenProductIds.has(item.productId)) {
      seenProductIds.add(item.productId);
      result.push(earliestItemByProductId.get(item.productId));
    }
  });

  wishlistMerged = result;
  saveWishlistToStorage(STORAGE_KEYS.wishlistMerged, wishlistMerged);
  renderAllWishlists();
}


/* =====================================================
   6. EVENT LISTENERS
   We use "event delegation": instead of adding a listener
   to every single button (which is created dynamically),
   we listen once on a parent container and check which
   button was actually clicked.

   Wrapped in DOMContentLoaded so this still works safely
   even if the <script> tag is ever moved to <head> or
   given a "defer" attribute in the future.
   ===================================================== */
document.addEventListener("DOMContentLoaded", () => {

  // Handle "Add to Wishlist A/B" clicks (buttons live inside #product-list)
  document.getElementById("product-list").addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button || button.disabled) return;

    const productId = button.dataset.productId;
    const target = button.dataset.target; // "A" or "B"

    addToWishlist(productId, target);
  });

  // Handle "Remove" clicks inside any of the three wishlist columns
  document.querySelectorAll(".wishlist-list").forEach((listEl) => {
    listEl.addEventListener("click", (event) => {
      const button = event.target.closest("button.remove-btn");
      if (!button) return;

      const productId = button.dataset.productId;
      const source = button.dataset.source; // "A", "B", or "merged"

      removeFromWishlist(productId, source);
    });
  });

  // Handle "Merge" button click
  document.getElementById("merge-btn").addEventListener("click", () => {
    mergeWishlists();
  });

  // Keep multiple open tabs in sync: if wishlist data changes in
  // another tab (or window), reload our in-memory copies and
  // re-render so this tab doesn't show stale/out-of-date data.
  window.addEventListener("storage", (event) => {
    if (!Object.values(STORAGE_KEYS).includes(event.key)) return;

    wishlistA = loadWishlistFromStorage(STORAGE_KEYS.wishlistA);
    wishlistB = loadWishlistFromStorage(STORAGE_KEYS.wishlistB);
    wishlistMerged = loadWishlistFromStorage(STORAGE_KEYS.wishlistMerged);
    renderAllWishlists();
  });

  /* =====================================================
     7. INITIAL PAGE LOAD
     Draw the product catalog and whatever wishlist data
     was already saved in localStorage from a previous visit.
     ===================================================== */
  renderAllWishlists();
});
