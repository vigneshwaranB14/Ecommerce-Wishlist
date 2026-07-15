# Testing Checklist — Simple Storefront (Wishlist Merge)

Use this checklist to manually verify the app before submitting/deploying. For each test: perform the steps, then confirm the actual result matches the expected result. Check the box once verified.

**Setup:** Open `index.html` in a browser. If testing persistence, do not use Incognito/Private mode (some browsers restrict `localStorage` there).

---

## 1. Wishlist A Empty

**Steps:**
1. On first load (or after clearing data — see Test 10), leave Wishlist A untouched.
2. Add 1–2 products to Wishlist B only.
3. Observe the Wishlist A column.

**Expected result:**
- [ ] Wishlist A column shows "No items yet."
- [ ] Wishlist B shows the added product(s) correctly.
- [ ] No console errors.

---

## 2. Wishlist B Empty

**Steps:**
1. Add 1–2 products to Wishlist A only.
2. Leave Wishlist B untouched.
3. Observe the Wishlist B column.

**Expected result:**
- [ ] Wishlist B column shows "No items yet."
- [ ] Wishlist A shows the added product(s) correctly.
- [ ] No console errors.

---

## 3. Both Wishlists Empty

**Steps:**
1. Load the app fresh (or remove all items from both A and B).
2. Observe both columns and the Merge button.
3. Click the Merge button.

**Expected result:**
- [ ] Both Wishlist A and B show "No items yet."
- [ ] The **Merge button is disabled** (nothing to merge).
- [ ] Merged Wishlist shows "No items yet." and doesn't change if Merge is somehow triggered.
- [ ] No console errors.

---

## 4. Same Product Added to Both Wishlists

**Steps:**
1. Add **Product X** to Wishlist A.
2. Add the **same Product X** to Wishlist B.
3. Click **Merge**.

**Expected result:**
- [ ] Product X appears in both Wishlist A and Wishlist B independently (each list can hold it — they're separate lists).
- [ ] After merging, Product X appears **exactly once** in the Merged Wishlist (no duplicate row).
- [ ] The merged copy uses the **earlier** of the two `addedAt` timestamps (verify by checking `localStorage` in DevTools if needed — the merged item's timestamp should match whichever wishlist you added it to first).

---

## 5. Refresh Page (Persistence)

**Steps:**
1. Add products to Wishlist A and B, and click Merge at least once.
2. Refresh the page (F5 / Cmd+R).

**Expected result:**
- [ ] Wishlist A, Wishlist B, and Merged Wishlist all show the **same contents as before the refresh**.
- [ ] Product "Add" buttons correctly show as disabled/"✓ In Wishlist A/B" for products already added, not reset to their default state.
- [ ] No data loss, no console errors.

---

## 6. Remove Items

**Steps:**
1. Add a product to Wishlist A, and a different product to Wishlist B.
2. Click **Remove** on the item in Wishlist A.
3. Click **Remove** on the item in Wishlist B.
4. Merge A and B, then click **Remove** on an item directly in the **Merged Wishlist**.

**Expected result:**
- [ ] Removing from Wishlist A only removes it from A — Wishlist B and Merged Wishlist (if not yet re-merged) are unaffected.
- [ ] Removing from Wishlist B behaves the same way, independently.
- [ ] Removing an item from the Merged Wishlist removes it from the merged view only — Wishlist A and B are **unchanged** (still contain their original items).
- [ ] After removal, the corresponding product's "Add" button in the product grid becomes available again (re-enabled), since it's no longer in that wishlist.
- [ ] Refreshing the page after removals keeps the removals (persisted correctly).

---

## 7. Merge Multiple Times

**Steps:**
1. Add Product X to Wishlist A and Product Y to Wishlist B.
2. Click **Merge**. Confirm Merged Wishlist shows X and Y.
3. Click **Merge** again (no changes made to A or B in between).
4. Add Product Z to Wishlist A.
5. Click **Merge** a third time.

**Expected result:**
- [ ] After step 3 (merging again with no changes), the Merged Wishlist still shows exactly X and Y — **no duplicates**, no repeated entries.
- [ ] After step 5, the Merged Wishlist now shows X, Y, and Z — updated correctly, still no duplicates.
- [ ] If you had manually removed an item from the Merged Wishlist earlier and then click Merge again, that item **reappears** (expected — merge always rebuilds fully from the current A + B, it doesn't preserve manual edits to the merged view).

---

## 8. Add New Products After Merging

**Steps:**
1. Add Product X to Wishlist A, click Merge. Confirm Merged Wishlist shows X.
2. Without clicking Merge again, add Product Y to Wishlist B.
3. Observe the Merged Wishlist (before clicking Merge again).
4. Click **Merge** again.

**Expected result:**
- [ ] After step 2/3, the Merged Wishlist does **not** automatically update — it still shows only X (this is expected: merge is a manual snapshot action, and the UI hint text says so).
- [ ] After step 4 (clicking Merge again), the Merged Wishlist now correctly shows both X and Y.

---

## Additional Recommended Checks

- [ ] **9. Duplicate-add attempt:** Try adding the same product to Wishlist A twice in a row (e.g. via rapid clicking). Confirm it appears only once — the button should already be disabled after the first click, preventing a second add.
- [ ] **10. Clear all data:** Open DevTools → Application → Local Storage → delete the three keys (`wishlist-a`, `wishlist-b`, `wishlist-merged`), then refresh. Confirm the app resets cleanly to all-empty state with no errors.
- [ ] **11. Responsive layout:** Resize the browser window (or use DevTools device toolbar) down to a mobile width (~375px). Confirm the product grid and wishlist columns stack/reflow without overlapping or horizontal scroll.
- [ ] **12. Product removed from catalog (simulated):** In DevTools console, manually add an item with a fake `productId` (e.g. `wishlistA.push({productId: "fake999", addedAt: new Date().toISOString()})` then call `renderAllWishlists()`), confirm it shows "Product unavailable" instead of crashing.
- [ ] **13. Cross-tab sync:** Open the app in two browser tabs side by side. Add a product to Wishlist A in Tab 1. Confirm Tab 2 updates to show the same item without needing a manual refresh.
- [ ] **14. Accessibility spot-check:** Tab through the page using only the keyboard (no mouse). Confirm every Add/Remove/Merge button is reachable and clearly focused, and that a screen reader (or browser accessibility inspector) announces meaningful labels (e.g. "Add Coffee Mug to Wishlist A") rather than generic "button" or "Remove."

---

## Sign-off

| Tester | Date | All tests passed? | Notes |
|---|---|---|---|
| | | ☐ Yes / ☐ No | |
