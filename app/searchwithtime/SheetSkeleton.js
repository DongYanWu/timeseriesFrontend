"use client";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

export default function SheetSkeleton({ width, height }) {
  return (
    <Stack>
      <Skeleton
        variant="rounded"
        width={width}
        height={height}
        sx={{ alignSelf: "flex-end" }}
      />
    </Stack>
  );
}
