import { useCallback, useEffect } from 'react';

const storageKey = 'morty-version';

function setMortyStackVersion({ version }: { version: string }) {
  localStorage.setItem(storageKey, version);
}

export function useBuildTag() {
  const buildtag = useCallback(() => {
    setMortyStackVersion({ version: '__buildVersion' });
  }, []);
  useEffect(() => {
    buildtag();
  }, [buildtag]);
}