import { useActivities } from "@/hooks/useActivities"
import { columns } from "./columns"
import { DataTable } from "@/components/ui/data-table"
import { DataTableViewOptions } from "@/components/ui/data-table-view-options"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"

function ActivityTableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-[250px]" />
        <Skeleton className="h-8 w-[100px]" />
      </div>
      <div className="rounded-md border">
        <div className="border-b px-4 py-3">
          <Skeleton className="h-5 w-full" />
        </div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 border-b px-4 py-3">
            <Skeleton className="size-9 rounded-lg shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-5 w-16 shrink-0" />
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-[200px]" />
        <Skeleton className="h-8 w-[300px]" />
      </div>
    </div>
  )
}

export default function Activity() {
  const { activities, isLoading } = useActivities()

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Recent Activity</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          A full log of everything you've done in Resumaker
        </p>
      </div>

      {/* ── Data Table ── */}
      {isLoading ? (
        <ActivityTableSkeleton />
      ) : (
        <DataTable
          columns={columns}
          data={activities}
          toolbar={(table) => (
            <div className="flex items-center justify-between">
              <Input
                placeholder="Filter activities..."
                value={
                  (table.getColumn("label")?.getFilterValue() as string) ?? ""
                }
                onChange={(event) =>
                  table.getColumn("label")?.setFilterValue(event.target.value)
                }
                className="h-8 w-[150px] lg:w-[250px]"
              />
              <DataTableViewOptions table={table} />
            </div>
          )}
        />
      )}
    </div>
  )
}
