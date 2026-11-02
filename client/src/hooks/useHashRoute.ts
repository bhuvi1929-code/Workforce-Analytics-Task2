import { useEffect, useState } from 'react';

export type Route = 'dashboard' | 'employees';
const parse = (): Route | null =>
  window.location.hash === '#/employees' ? 'employees' : window.location.hash === '#/dashboard' ? 'dashboard' : null;

export function useHashRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parse() ?? 'dashboard');
  useEffect(() => {
    const onChange = () => { const next = parse(); if (next) setRoute(next); };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}
