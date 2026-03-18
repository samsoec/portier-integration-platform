import { AlertTriangle, Clock, Tag } from "lucide-react";
import { Link } from "react-router";
import { Badge, type BadgeProps } from "~/components/badge";
import type { Platform, Status } from "~/entities/types";
import { cn } from "~/utils/classname";

const STATUS_BADGE_MAP: Record<Status, BadgeProps["variant"]> = {
  Synced: "success",
  Syncing: "info",
  Conflict: "warning",
  Error: "error",
};

type PlatformCardProps = {
  platform: Platform;
  className?: string;
};

export function PlatformCard({ platform, className }: PlatformCardProps) {
  const iaActionNeeded = platform.status === "Conflict";
  return (
    <Link
      to={`/platforms/${platform.id}`}
      className={cn(
        "group flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:border-blue-300 hover:shadow-md",
        iaActionNeeded ? "border-yellow-300 hover:border-yellow-400 bg-yellow-50" : "",
        className
      )}
    >
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <img
              src={platform.avatar}
              alt={platform.name}
              className="h-10 w-10 rounded-full border border-gray-100 bg-gray-50"
            />
            <div>
              <p className="font-semibold text-gray-900 group-hover:text-blue-600">
                {platform.name}
              </p>
              <Badge variant="neutral" icon={<Tag size={12} />} className="mt-0.5">
                {platform.version}
              </Badge>
            </div>
          </div>
          <Badge variant={STATUS_BADGE_MAP[platform.status]}>{platform.status}</Badge>
        </div>
        {platform.description && (
          <p className="mt-3 line-clamp-2 text-sm text-gray-500">{platform.description}</p>
        )}
        {iaActionNeeded && (
          <span className="flex items-center gap-1 mt-3 text-sm font-medium text-yellow-700">
            <AlertTriangle size={16} />
            Action needed
          </span>
        )}
      </div>
      <div className="mt-4 flex items-center gap-4 border-t border-gray-100 pt-3 text-xs text-gray-400">
        <span className="flex items-center gap-1">
          <Clock size={12} />
          {new Date(platform.lastSynced).toLocaleString()}
        </span>
        {platform.lastSyncDuration != null && <span>{platform.lastSyncDuration}s sync</span>}
      </div>
    </Link>
  );
}
