import { type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./utils";

const cardVariants = cva("card", {
  variants: {
    tone: {
      neutral: "card-neutral",
      accent: "card-accent"
    }
  },
  defaultVariants: {
    tone: "neutral"
  }
});

type CardProps = HTMLAttributes<HTMLElement> & VariantProps<typeof cardVariants>;

export function Card({ className, tone, ...props }: CardProps) {
  return <section className={cn(cardVariants({ tone }), className)} {...props} />;
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("card-header", className)} {...props} />;
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn("card-title", className)} {...props} />;
}

export function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("card-description", className)} {...props} />;
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("card-content", className)} {...props} />;
}
