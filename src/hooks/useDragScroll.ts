import { useEffect, useRef, type RefObject } from "react";

export function useDragScroll(ref: RefObject<HTMLElement | null>) {
  const dragged = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let pointerId: number | null = null;
    let startX = 0;
    let scrollLeft = 0;

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      pointerId = event.pointerId;
      startX = event.clientX;
      scrollLeft = el.scrollLeft;
      dragged.current = false;
      el.setPointerCapture(event.pointerId);
      el.style.cursor = "grabbing";
    };

    const onPointerMove = (event: PointerEvent) => {
      if (pointerId === null) return;
      const walk = event.clientX - startX;
      if (Math.abs(walk) > 6) dragged.current = true;
      el.scrollLeft = scrollLeft - walk;
    };

    const endDrag = (event: PointerEvent) => {
      if (pointerId === null || event.pointerId !== pointerId) return;
      pointerId = null;
      el.style.cursor = "grab";
    };

    const preventClick = (event: MouseEvent) => {
      if (dragged.current) {
        event.preventDefault();
        event.stopPropagation();
        dragged.current = false;
      }
    };

    el.style.cursor = "grab";
    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", endDrag);
    el.addEventListener("pointercancel", endDrag);
    el.addEventListener("click", preventClick, true);

    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", endDrag);
      el.removeEventListener("pointercancel", endDrag);
      el.removeEventListener("click", preventClick, true);
    };
  }, [ref]);

  return dragged;
}
