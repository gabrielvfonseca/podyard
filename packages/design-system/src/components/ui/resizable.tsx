"use client";

import { cn } from "@podyard/design-system/lib/utils";
import { GripVerticalIcon } from "lucide-react";
import type * as React from "react";
import * as ResizablePrimitive from "react-resizable-panels";

type ResizablePanelGroupProps = React.ComponentProps<
  typeof ResizablePrimitive.Group
> & {
  /**
   * Legacy alias for `orientation`. Prefer `orientation` for new code.
   */
  direction?: "horizontal" | "vertical";
};

function ResizablePanelGroup({
  className,
  direction,
  orientation,
  ...props
}: ResizablePanelGroupProps) {
  const resolvedOrientation = orientation ?? direction ?? "horizontal";

  return (
    <ResizablePrimitive.Group
      className={cn(
        "flex h-full w-full",
        resolvedOrientation === "vertical" && "flex-col",
        className
      )}
      data-slot="resizable-panel-group"
      orientation={resolvedOrientation}
      {...props}
    />
  );
}

function ResizablePanel({
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.Panel>) {
  return <ResizablePrimitive.Panel data-slot="resizable-panel" {...props} />;
}

function ResizableHandle({
  withHandle,
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.Separator> & {
  withHandle?: boolean;
}) {
  return (
    <ResizablePrimitive.Separator
      className={cn(
        "relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1",
        className
      )}
      data-slot="resizable-handle"
      {...props}
    >
      {withHandle && (
        <div className="z-10 flex h-4 w-3 items-center justify-center rounded-xs border bg-border">
          <GripVerticalIcon className="size-2.5" />
        </div>
      )}
    </ResizablePrimitive.Separator>
  );
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
