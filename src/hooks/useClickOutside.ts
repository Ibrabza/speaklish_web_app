import { useEffect, useRef } from "react";

export function useClickOutside<T extends HTMLElement>(handler: () => void) {
    const ref = useRef<T>(null);

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                handler();
            }
        }

        document.addEventListener("click", handleClick, true);

        return () => document.removeEventListener("click", handleClick);
    }, [handler]);

    return ref;
}
