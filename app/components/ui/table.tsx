import { cn } from "~/utils/classname";

function Root({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-auto rounded-md border border-gray-200">
      <table {...props} className={cn("w-full caption-bottom text-sm", className)} />
    </div>
  );
}

function Header({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead {...props} className={cn("bg-gray-50", className)} />;
}

function Body({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody
      {...props}
      className={cn("[&_tr:last-child]:border-0 divide-y divide-gray-100", className)}
    />
  );
}

function Footer({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tfoot
      {...props}
      className={cn("border-t border-gray-200 bg-gray-50 font-medium", className)}
    />
  );
}

function Row({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      {...props}
      className={cn(
        "border-b border-gray-100 transition-colors hover:bg-gray-50 data-[selected=true]:bg-blue-50",
        className
      )}
    />
  );
}

function Head({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      {...props}
      className={cn(
        "h-10 px-4 text-left align-middle text-xs font-semibold uppercase tracking-wide text-gray-500",
        className
      )}
    />
  );
}

function Cell({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return <td {...props} className={cn("px-4 py-3 align-middle text-gray-700", className)} />;
}

function Caption({ className, ...props }: React.HTMLAttributes<HTMLTableCaptionElement>) {
  return <caption {...props} className={cn("mt-2 text-sm text-gray-500", className)} />;
}

export const Table = Object.assign(Root, { Header, Body, Footer, Row, Head, Cell, Caption });
