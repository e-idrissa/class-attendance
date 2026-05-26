"use client";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Props {
  classes: {
    id: string;
    title: string;
    count: number;
  }[];
}

export function ClassCards({ classes }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-0 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-3 dark:*:data-[slot=card]:bg-card">
      {classes.map((item) => (
        <Card key={item.id} className="@container/card">
          <CardHeader className="-mb-4">
            <CardDescription>Repartition des Entretiens</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {item.count}
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              {item.title}
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
