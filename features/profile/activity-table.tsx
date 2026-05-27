"use client";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/convex/_generated/api";
import { ComputerActivityIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQuery } from "convex/react";

export const ActivityTable = () => {
  const logs = useQuery(api.fx.logs.getLatestLogs) || [];

  return (
    <div className="mt-6 lg:mt-8 px-4 lg:px-0">
      <div className="flex items-center gap-2 mb-2">
        <HugeiconsIcon
          icon={ComputerActivityIcon}
          size={20}
          strokeWidth={2}
          className="transition-colors"
        />
        <span className="text-xl font-semibold">Recent Activities</span>
      </div>
      <Table>
        <TableCaption>A list of your recent activities.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Date</TableHead>
            <TableHead className="hidden sm:table-cell">Time</TableHead>
            <TableHead className="hidden sm:table-cell">Collection</TableHead>
            <TableHead>Operation</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.length === 0 ? (
            <TableRow>
              <TableCell>No Recents Activities yet.</TableCell>
            </TableRow>
          ) : (
            logs.map((item) => (
              <TableRow key={item._creationTime}>
                <TableCell className="font-medium">{item.date}</TableCell>
                <TableCell className="hidden sm:table-cell">
                  {item.time}
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {item.data.collectionIdentifier}
                </TableCell>
                <TableCell>{item.tag}</TableCell>
                <TableCell className="text-right">
                  <Badge
                    variant={
                      item.status === "SUCCESS" ? "default" : "destructive"
                    }
                  >
                    {item.status}{" "}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
