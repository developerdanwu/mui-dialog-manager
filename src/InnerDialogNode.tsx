import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogProps,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useUpdateEffect } from 'react-use';

import ErrorBoundaryWithQueryReset from '@/ErrorBoundaryWithQueryReset';
import ErrorResult from '@/components/ErrorResult';
import Icon from '@/components/Icon';
import {
  DialogKeys,
  DIALOGS,
} from '@/pages/Contacts/shared/DialogManager/constants';
import { useDialogManager } from '@/pages/Contacts/shared/DialogManager/index';

const InnerDialogNode = ({
  dialogId,
  componentProps,
  dialogProps,
}: {
  dialogProps: DialogProps;
  dialogId: DialogKeys;
  componentProps: any;
}) => {
  const Component = DIALOGS[dialogId];
  const dialogManager = useDialogManager();
  const { t } = useTranslation();
  const location = useLocation();
  const { PaperProps, TransitionProps, ...restDialogProps } = dialogProps;
  const paperSxProps = dialogProps.PaperProps?.sx || [];
  const onExitedTransition = TransitionProps?.onExited;

  useUpdateEffect(() => {
    if (dialogProps.open) {
      dialogManager.closeDialog(dialogId);
    }
  }, [location]);

  return (
    <Dialog
      PaperProps={{
        ...PaperProps,
        sx: [
          { padding: '32px', position: 'relative' },
          ...(Array.isArray(paperSxProps) ? paperSxProps : [paperSxProps]),
        ],
      }}
      transitionDuration={200}
      closeAfterTransition
      TransitionProps={{
        ...TransitionProps,
        onExited: (node) => {
          dialogManager._destroyDialog(dialogId);
          onExitedTransition?.(node);
        },
      }}
      {...restDialogProps}
    >
      <IconButton
        sx={{
          position: 'absolute',
          right: '32px',
          top: '32px',
        }}
        onClick={() => {
          dialogManager.closeDialog(dialogId);
        }}
      >
        <Icon icon="x-close" />
      </IconButton>
      <ErrorBoundaryWithQueryReset
        fallback={({ resetError }) => {
          return (
            <Box width={(theme) => theme.dialog.sizes.sm}>
              <ErrorResult
                title={t('dialog.error-title')}
                description={t('dialog.error-description')}
                actions={
                  <Button
                    variant="contained"
                    onClick={() => {
                      resetError();
                    }}
                  >
                    {t('dialog.error-reset-button')}
                  </Button>
                }
              />
            </Box>
          );
        }}
      >
        <Suspense
          fallback={
            <Box display="flex" justifyContent="center" width="100%">
              <Stack
                paddingY="32px"
                width={(theme) => theme.dialog.sizes.sm}
                justifyContent="center"
                alignItems="center"
              >
                <CircularProgress sx={{ mb: '8px' }} />
                <Typography variant="body2">{t('general.loading')}</Typography>
              </Stack>
            </Box>
          }
        >
          <Component {...componentProps} key={dialogId} />
        </Suspense>
      </ErrorBoundaryWithQueryReset>
    </Dialog>
  );
};

export default InnerDialogNode;
