export function disableConsoleLogs() {
    if (import.meta.env.VITE_ENV === 'production') {
      console.log = () => {};
      console.error = () => {};
    }
  }