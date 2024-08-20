import { useEffect, useState } from 'react';
import { Breakpoints } from '../../core/models/constants';

export function useIsMobile(breakpoint?: Breakpoints) {
  const defaultBreakpoint = breakpoint !== undefined ? breakpoint : Breakpoints.MD;
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= defaultBreakpoint);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= defaultBreakpoint);
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
