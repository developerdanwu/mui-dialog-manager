import { useDialogManager } from '@/pages/Contacts/shared/DialogManager/index';

import InnerDialogNode from './InnerDialogNode';

const DialogNode = () => {
  const dialogManager = useDialogManager();

  return (
    <>
      {dialogManager.dialogQueue.map(
        ({ dialogId, componentProps, dialogProps }) => {
          return (
            <InnerDialogNode
              key={dialogId}
              dialogId={dialogId}
              dialogProps={dialogProps}
              componentProps={componentProps}
            />
          );
        },
      )}
    </>
  );
};

export default DialogNode;
