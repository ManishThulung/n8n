"use client";

import { Button } from "@workspace/ui/components/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/sheet";
import { Node } from "@xyflow/react";
import { Dispatch, SetStateAction, useState } from "react";
import { ActionDialog } from "../dialog/ActionDialog";
import { EmailActionForm } from "../forms/EmailActionForm";
import { HttpActionForm } from "../forms/HttpActionForm";

const ActionSheet = ({
  isActionSheetOpen,
  setIsActionSheetOpen,
  handleAdd,
}: {
  isActionSheetOpen: boolean;
  setIsActionSheetOpen: Dispatch<SetStateAction<boolean>>;
  handleAdd: (nodeInfo: Node) => void;
}) => {
  const [activeDialog, setActiveDialog] = useState<"http" | "email" | null>(
    null
  );

  function handleSubmit<T>(data: T, type: string, label: string) {
    const payload = {
      id: Math.random().toString(),
      type,
      data: {
        label,
        metadata: {
          data,
        },
        nodeType: "Action",
      },
    };
    handleAdd(payload as unknown as Node);
    setActiveDialog(null);
    setIsActionSheetOpen(false);
  }

  const closeAll = () => {
    setActiveDialog(null);
  };
  return (
    <Sheet open={isActionSheetOpen} onOpenChange={setIsActionSheetOpen}>
      <SheetTrigger className="w-full h-full flex justify-center items-center">
        Add Action
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add more actions to your workflow</SheetTitle>
          <div className="flex justify-start items-center gap-4 flex-col">
            <Button onClick={() => setActiveDialog("http")}>
              Http Request
            </Button>
            <Button onClick={() => setActiveDialog("email")}>Email</Button>

            <ActionDialog
              open={activeDialog === "http"}
              onOpenChange={() => setActiveDialog(null)}
              title="Configure your HTTP Request"
              description="Set up when and how often you want your workflow to run."
            >
              <HttpActionForm
                onSubmit={(data) =>
                  handleSubmit(data, "http-action", "Makes a http request")
                }
                onCancel={closeAll}
              />
            </ActionDialog>

            <ActionDialog
              open={activeDialog === "email"}
              onOpenChange={() => setActiveDialog(null)}
              title="Setup your Email Template"
              description="Configure the email template. This is what you get when the workflow runs."
            >
              <EmailActionForm
                onSubmit={(data) =>
                  handleSubmit(data, "email-action", "Sends you email")
                }
                onCancel={closeAll}
              />
            </ActionDialog>
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default ActionSheet;
