import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "bg-neutral-100 text-neutral-600",
        compliant: "bg-brand-100 text-brand-700 border border-brand-200",
        review_due: "bg-amber-100 text-amber-700 border border-amber-200",
        missing: "bg-red-100 text-red-700 border border-red-200",
        outdated: "bg-red-100 text-red-700 border border-red-200",
        standard: "bg-neutral-100 text-neutral-600",
        cip: "bg-blue-100 text-blue-700",
        gas_hazard: "bg-orange-100 text-orange-700",
        refrigerant: "bg-purple-100 text-purple-700",
        ordered: "bg-neutral-100 text-neutral-600",
        in_transit: "bg-blue-100 text-blue-700",
        delivered: "bg-amber-100 text-amber-700",
        inventory_pending: "bg-amber-100 text-amber-700",
        complete: "bg-brand-100 text-brand-700",
        near_miss: "bg-sky-100 text-sky-800 border border-sky-200",
        injury: "bg-red-100 text-red-800 border border-red-200",
        illness: "bg-orange-100 text-orange-800 border border-orange-200",
        property_damage:
          "bg-purple-100 text-purple-800 border border-purple-200",
        incomplete: "bg-amber-100 text-amber-800 border border-amber-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
