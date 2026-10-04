'use client';
import { ErrorScreen } from '@rc/screens/app-states';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <ErrorScreen homeHref="/driver" reference={error.digest} onRetry={reset} />;
}
