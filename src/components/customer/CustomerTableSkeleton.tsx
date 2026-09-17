import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";

const CustomerTableSkeleton = () => {
  return Array(5)
    .fill(0)
    .map((_, index) => (
      <TableRow key={index} className="border-t">
        <TableCell className="py-3 sm:py-4 pl-3 sm:pl-4 lg:pl-6">
          <Skeleton className="h-4 w-[30px]" />
        </TableCell>
        <TableCell className="py-3 sm:py-4 px-2 sm:px-4">
          <Skeleton className="h-4 w-[160px]" />
        </TableCell>
        <TableCell className="py-3 sm:py-4 px-2 sm:px-4">
          <Skeleton className="h-4 w-[60px]" />
        </TableCell>
        <TableCell className="py-3 sm:py-4 px-2 sm:px-4">
          <Skeleton className="h-4 w-[120px]" />
        </TableCell>
        <TableCell className="py-3 sm:py-4 px-2 sm:px-4">
          <Skeleton className="h-4 w-[200px]" />
        </TableCell>
        <TableCell className="py-3 sm:py-4 px-2 sm:px-4">
          <Skeleton className="h-4 w-[40px]" />
        </TableCell>
        <TableCell className="py-3 sm:py-4 px-2 sm:px-4">
          <Skeleton className="h-4 w-[40px]" />
        </TableCell>
        <TableCell className="py-3 sm:py-4 px-2 sm:px-4">
          <Skeleton className="h-4 w-[90px]" />
        </TableCell>
        <TableCell className="py-3 sm:py-4 px-2 sm:px-4">
          <div className="flex justify-center items-center gap-2">
            <Skeleton className="h-8 w-8 rounded" />
            <Skeleton className="h-8 w-8 rounded" />
          </div>
        </TableCell>
      </TableRow>
    ));
};

export default CustomerTableSkeleton;