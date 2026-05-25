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
import { ComputerActivityIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

const invoices = [
  {
    id: "ACT001",
    date: "2026-05-25",
    time: "14:32",
    collection: "Documents",
    operation: "Create",
    status: "SUCCESS",
  },
  {
    id: "ACT002",
    date: "2026-05-25",
    time: "12:15",
    collection: "Users",
    operation: "Update",
    status: "SUCCESS",
  },
  {
    id: "ACT003",
    date: "2026-05-24",
    time: "18:45",
    collection: "Profiles",
    operation: "Delete",
    status: "FAILED",
  },
  {
    id: "ACT004",
    date: "2026-05-24",
    time: "09:12",
    collection: "Documents",
    operation: "Update",
    status: "SUCCESS",
  },
  {
    id: "ACT005",
    date: "2026-05-23",
    time: "17:01",
    collection: "Settings",
    operation: "Update",
    status: "FAILED",
  },
  {
    id: "ACT006",
    date: "2026-05-23",
    time: "11:20",
    collection: "Users",
    operation: "Create",
    status: "SUCCESS",
  },
  {
    id: "ACT007",
    date: "2026-05-22",
    time: "15:30",
    collection: "Documents",
    operation: "Delete",
    status: "SUCCESS",
  },
];

export const ActivityTable = () => {
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
            <TableHead>Time</TableHead>
            <TableHead>Collection</TableHead>
            <TableHead>Operation</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.date}</TableCell>
              <TableCell>{item.time}</TableCell>
              <TableCell>{item.collection}</TableCell>
              <TableCell>{item.operation}</TableCell>
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
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
