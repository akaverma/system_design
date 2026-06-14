import * as React from "react";
import { cn } from "../../utils/cn";

/** Props for the {@link Card} component. */
export type CardProps = React.HTMLAttributes<HTMLDivElement>;

/** Props for the {@link CardHeader} component. */
export type CardHeaderProps = React.HTMLAttributes<HTMLDivElement>;

/** Props for the {@link CardTitle} component. */
export type CardTitleProps = React.HTMLAttributes<HTMLHeadingElement>;

/** Props for the {@link CardDescription} component. */
export type CardDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

/** Props for the {@link CardContent} component. */
export type CardContentProps = React.HTMLAttributes<HTMLDivElement>;

/** Props for the {@link CardFooter} component. */
export type CardFooterProps = React.HTMLAttributes<HTMLDivElement>;

/**
 * A bordered container used to group related content, typically composed
 * with {@link CardHeader}, {@link CardTitle}, {@link CardDescription},
 * {@link CardContent}, and {@link CardFooter}.
 *
 * @example
 * ```tsx
 * <Card>
 *   <CardHeader>
 *     <CardTitle>Title</CardTitle>
 *     <CardDescription>Description</CardDescription>
 *   </CardHeader>
 *   <CardContent>Content</CardContent>
 *   <CardFooter>Footer</CardFooter>
 * </Card>
 * ```
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(function Card(
  { className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn("rounded-lg border border-border bg-card text-card-foreground shadow-sm", className)}
      {...props}
    />
  );
});

/** The header section of a {@link Card}, typically containing a title and description. */
export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(function CardHeader(
  { className, ...props },
  ref,
) {
  return <div ref={ref} className={cn("flex flex-col gap-1.5 p-6", className)} {...props} />;
});

/** The title of a {@link Card}, rendered as a heading. */
export const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(function CardTitle(
  { className, ...props },
  ref,
) {
  return (
    // eslint-disable-next-line jsx-a11y/heading-has-content -- content is provided via `props.children`
    <h3
      ref={ref}
      className={cn("text-lg font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  );
});

/** A secondary line of text describing a {@link Card}. */
export const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  function CardDescription({ className, ...props }, ref) {
    return <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />;
  },
);

/** The main content area of a {@link Card}. */
export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(function CardContent(
  { className, ...props },
  ref,
) {
  return <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />;
});

/** The footer section of a {@link Card}, typically containing actions. */
export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(function CardFooter(
  { className, ...props },
  ref,
) {
  return <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />;
});
