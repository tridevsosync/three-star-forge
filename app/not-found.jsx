import { Btn, TechLabel } from "@/components/site/ui";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-background px-6 pt-32">
      <div className="max-w-lg text-center">
        <TechLabel tone="accent">404</TechLabel>
        <h1 className="mt-5 font-display text-3xl font-semibold text-foreground">
          Page not found
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          The requested page does not exist or has been moved.
        </p>
        <div className="mt-8 flex justify-center">
          <Btn to="/">Back to home</Btn>
        </div>
      </div>
    </div>
  );
}
