import { useMediaQuery } from 'react-responsive';

export const useResponsive = () => {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1199 });
  const isLaptop = useMediaQuery({ minWidth: 1200, maxWidth: 1439 });
  const isDesktop = useMediaQuery({ minWidth: 1440 });

  return {
    isMobile,
    isTablet,
    isLaptop,
    isDesktop,
    isMobileOrTablet: isMobile || isTablet,
    isNotMobile: !isMobile,
  };
}; 