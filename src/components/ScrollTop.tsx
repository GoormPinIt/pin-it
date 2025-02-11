import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    if (window.scrollY > 0) {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
};

export default ScrollTop;
