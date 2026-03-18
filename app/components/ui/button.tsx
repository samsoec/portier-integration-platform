import { cn } from "~/utils/classname";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "solid" | "outlined" | "ghost";
  size?: "default" | "sm" | "lg";
};

export function Button({ variant = "solid", size = "default", className, ...props }: ButtonProps) {
  const variantStyles = {
    solid:
      "bg-blue-500 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
    outlined:
      "border border-gray-300 text-gray-700 hover:bg-gray-100 focus:ring-2 focus:ring-gray-300 focus:ring-offset-2",
    ghost: "text-gray-700 hover:bg-gray-100 focus:ring-2 focus:ring-gray-300 focus:ring-offset-2",
  };

  const sizeStyles = {
    default: "px-4 py-2 text-base",
    sm: "px-3 py-1.5 text-sm",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      {...props}
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    />
  );
}
