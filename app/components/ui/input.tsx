import { cn } from "~/utils/classname";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  icon?: React.ReactNode;
};

export function Input({ className, icon, ...props }: InputProps) {
  return (
    <div className="relative">
      {icon && <div className="absolute inset-y-0 left-0 flex items-center pl-3">{icon}</div>}
      <input
        {...props}
        className={cn(
          "w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50",
          icon ? "pl-10" : "",
          className
        )}
      />
    </div>
  );
}
