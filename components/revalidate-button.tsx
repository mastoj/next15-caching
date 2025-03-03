"use client";

import ReverseProgressButton from "@/components/reverse-progress-button";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { PropsWithChildren } from "react";
import { revalidateTagAction } from "./actions";

type Props =
  | {
      type: "revalidate-button";
      tag: string;
    }
  | {
      type: "countdown-button";
      tag: string;
      durationInMs: number;
      startTime: string;
      runningText: string;
      completedText?: string;
    };

const RevalidateButton = (props: PropsWithChildren<Props>) => {
  const { tag, children } = props;
  const router = useRouter();
  const handleRevalidate = async () => {
    console.log("==> Revalidating: ", tag);
    await revalidateTagAction(tag);
    router.refresh();
  };
  if (props.type === "countdown-button") {
    return <ReverseProgressButton {...props} onClick={handleRevalidate} />;
  }
  return (
    <Button onClick={handleRevalidate} className="cursor-pointer">
      {children}
    </Button>
  );
};

export default RevalidateButton;
