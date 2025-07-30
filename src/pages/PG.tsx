import { Callout } from '@/components/Callout';

export function PG() {
  return (
    <div className="space-y-4 p-6">
      <Callout>
        This is a primary callout — typically used for informational messages.
      </Callout>

      <Callout variant="danger">
        This is a danger callout — for errors or critical warnings.
      </Callout>
    </div>
  );
}
