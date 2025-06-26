import { useMemo } from 'react';
import { useLocation, useNavigate, useParams as useRouterParams } from 'react-router-dom';

export function useRouter() {
  const navigate = useNavigate();
  const {pathname, search, state} = useLocation();

  const router = useMemo(
    () => ({
      back: () => navigate(-1),
      forward: () => navigate(1),
      reload: () => window.location.reload(),
      push: (href: string) => navigate(href),
      replace: (href: string) => navigate(href, { replace: true }),
    }),
    [navigate]
  );

  return { router, pathname, search, state };
}

export function useParams() {
  return useRouterParams();
}