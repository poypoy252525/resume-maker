import type { ColumnDef } from "@tanstack/react-table"
import type { ActivityResponse } from "@/api"
import { Badge } from "@/components/ui/badge"
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header"
import { formatRelativeTime, getActivityDetails } from "@/lib/utils"

export const columns: ColumnDef<ActivityResponse>[] = [
  {
    accessorKey: "label",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Activity" />
    ),
    cell: ({ row }) => {
      const activity = row.original
      const details = getActivityDetails(activity.activity_type)
      const Icon = details.icon

      return (
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg shrink-0 ${details.bg}`}>
            <Icon className={`size-3.5 ${details.color}`} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{activity.label}</p>
            <p className="text-xs text-muted-foreground truncate mt-0.5">
              {activity.sub}
            </p>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "activity_type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => {
      const details = getActivityDetails(row.getValue("activity_type"))
      return (
        <Badge variant="secondary" className="text-xs">
          {details.label}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      return (
        <span className="text-sm text-muted-foreground">
          {formatRelativeTime(row.getValue("created_at"))}
        </span>
      )
    },
  },
]
