import { useEffect, useState } from 'react';
import { Breakpoints } from '../../core/models/constants';

export function useIsMobile(breakpoint?: Breakpoints) {
  const [isMobile, setIsMobile] = useState(false);
  const defaultBreakpoint = breakpoint !== undefined ? breakpoint : Breakpoints.MD;

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= defaultBreakpoint) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };

    // Initial check
    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [defaultBreakpoint]);

  return { isMobile };
}
