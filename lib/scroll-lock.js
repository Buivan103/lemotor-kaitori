/** Lock/unlock the document scroll root (html) for overlays/modals. */

export function lockPageScroll() {
  const root = document.documentElement;
  if (root.dataset.scrollLockCount) {
    root.dataset.scrollLockCount = String(
      Number(root.dataset.scrollLockCount || "0") + 1
    );
    return;
  }
  const top = window.scrollY || window.pageYOffset || 0;
  root.dataset.scrollLockTop = String(top);
  root.dataset.scrollLockCount = "1";
  root.style.overflow = "hidden";
  document.body.style.overflow = "hidden";
  root.style.position = "fixed";
  root.style.top = `-${top}px`;
  root.style.left = "0";
  root.style.right = "0";
  root.style.width = "100%";
}

export function unlockPageScroll() {
  const root = document.documentElement;
  const count = Number(root.dataset.scrollLockCount || "0") - 1;
  if (count > 0) {
    root.dataset.scrollLockCount = String(count);
    return;
  }
  const top = Number(root.dataset.scrollLockTop || "0");
  root.style.overflow = "";
  document.body.style.overflow = "";
  root.style.position = "";
  root.style.top = "";
  root.style.left = "";
  root.style.right = "";
  root.style.width = "";
  delete root.dataset.scrollLockTop;
  delete root.dataset.scrollLockCount;
  window.scrollTo(0, top);
}
