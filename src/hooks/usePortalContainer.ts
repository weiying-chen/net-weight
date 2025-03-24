import { useEffect, useState } from 'react';

export function usePortalContainer() {
  const [portalContainer, setPortalContainer] = useState<HTMLDivElement | null>(
    null,
  );

  useEffect(() => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    setPortalContainer(el);

    return () => {
      if (el.parentNode) {
        document.body.removeChild(el);
      }
    };
  }, []);

  return portalContainer;
}
