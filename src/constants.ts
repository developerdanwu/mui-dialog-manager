import { lazyWithRetries } from '@/utils/lazy-loading';

export const DIALOGS = {
  createList: lazyWithRetries(
    () => import('@/pages/Contacts/CreateListDialog'),
  ),
  editListName: lazyWithRetries(
    () => import('@/pages/Contacts/shared/ContactsActions/EditListNameDialog'),
  ),
} as const;

export type DialogKeys = keyof typeof DIALOGS;
