import React from 'react';

// hacky dark mode
export function useDarkMode() {
  const CACHE_KEY = '__ar:dark';

  const [isDarkMode, setDarkMode] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    try {
      const isDark = !!Number(window.localStorage.getItem(CACHE_KEY));

      if (isDark) {
        document.body.classList.add('dark');
        setDarkMode(true);
      } else {
        document.body.classList.remove('dark');
        setDarkMode(false);
      }
    } catch (e) {
      //
    }
  }, []);

  // const isDarkMode = () => {
  //   if (typeof document === 'undefined') {
  //     return null;
  //   }

  //   return document.body.classList.contains('dark');
  // };

  const toggle = () => {
    try {
      if (typeof document === 'undefined') {
        return;
      }

      if (isDarkMode) {
        document.body.classList.remove('dark');
        window.localStorage.setItem(CACHE_KEY, '0');
        setDarkMode(false);
      } else {
        document.body.classList.add('dark');
        window.localStorage.setItem(CACHE_KEY, '1');
        setDarkMode(true);
      }
    } catch (e) {
      //
    }
  };

  return {isDarkMode, toggle};
}
