import { DialogProps } from '@mui/material';
import React, { useState } from 'react';

import { DialogKeys, Dialogs } from './constants';

const DialogManagerContext = React.createContext<{
  dialogQueue: {
    dialogId: string;
    componentProps: any;
    dialogProps: DialogProps;
  }[];
  setDialogQueue: React.Dispatch<
    React.SetStateAction<
      {
        dialogId: string;
        componentProps: any;
        dialogProps: DialogProps;
      }[]
    >
  >;
  dialogs: Record<string, React.ReactElement>;
} | null>(null);
function DialogManagerProvider({
  children,
  dialogs,
}: {
  children: React.ReactNode;
  dialogs: Record<string, React.ReactElement>;
}) {
  const [dialogQueue, setDialogQueue] = useState<
    {
      dialogId: string;
      componentProps: any;
      dialogProps: DialogProps;
    }[]
  >([]);

  return (
    <DialogManagerContext.Provider
      value={{
        dialogs,
        dialogQueue,
        setDialogQueue,
      }}
    >
      {children}
    </DialogManagerContext.Provider>
  );
}
export const useDialogManager = () => {
  const dialogContext = React.useContext(DialogManagerContext);
  if (dialogContext === null) {
    throw new Error('useDialogManager must be used within a DialogProvider');
  }

  const closeDialog = (modalId: DialogKeys) => {
    dialogContext.setDialogQueue(prevState => {
      return prevState.map(modal => {
        if (modal.dialogId === modalId) {
          return {
            ...modal,
            dialogProps: {
              ...modal.dialogProps,
              open: false,
            },
          };
        }
        return modal;
      });
    });
  };

  return {
    dialogQueue: dialogContext.dialogQueue,
    openDialog: <TModalId extends DialogKeys>(
      modalId: TModalId,
      props: {
        dialogProps?: Omit<DialogProps, 'open'>;
        componentProps: Dialogs[TModalId] extends React.ComponentType<
          infer TProps
        >
          ? TProps
          : never;
      }
    ) => {
      dialogContext.setDialogQueue(prevState => {
        return [
          ...prevState.filter(dialog => dialog.dialogId !== modalId),
          {
            dialogId: modalId,
            componentProps: props.componentProps,
            dialogProps: {
              open: true,
              onClose: () => {
                closeDialog(modalId);
              },
              ...props.dialogProps,
            },
          },
        ];
      });
    },
    closeDialog,
    _destroyDialog: (id: DialogKeys) => {
      dialogContext.setDialogQueue(prevState => {
        return prevState.filter(modal => modal.dialogId !== id);
      });
    },
  };
};

export default DialogManagerProvider;
