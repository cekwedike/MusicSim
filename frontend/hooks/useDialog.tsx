import { useState } from 'react';
import React from 'react';
import AlertDialog from '../components/AlertDialog';
import ConfirmDialog from '../components/ConfirmDialog';

interface AlertConfig {
  title: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
}

interface ConfirmConfig {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
  onCancel?: () => void;
}

export const useDialog = () => {
  const [alertConfig, setAlertConfig] = useState<AlertConfig & { isOpen: boolean }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  const [confirmConfig, setConfirmConfig] = useState<ConfirmConfig & { isOpen: boolean }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'warning',
    onConfirm: () => {},
    onCancel: undefined
  });

  const showAlert = (title: string, message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    setAlertConfig({ isOpen: true, title, message, type });
  };

  const showConfirm = (config: Omit<ConfirmConfig, 'onCancel'> & { onCancel?: () => void }) => {
    setConfirmConfig({
      isOpen: true,
      ...config,
      onCancel: config.onCancel
    });
  };

  const closeAlert = () => {
    setAlertConfig({ ...alertConfig, isOpen: false });
  };

  const closeConfirm = () => {
    setConfirmConfig({ ...confirmConfig, isOpen: false });
  };

  const AlertDialogComponent = () => (
    <AlertDialog
      isOpen={alertConfig.isOpen}
      title={alertConfig.title}
      message={alertConfig.message}
      type={alertConfig.type}
      onClose={closeAlert}
    />
  );

  const ConfirmDialogComponent = () => (
    <ConfirmDialog
      isOpen={confirmConfig.isOpen}
      title={confirmConfig.title}
      message={confirmConfig.message}
      confirmText={confirmConfig.confirmText}
      cancelText={confirmConfig.cancelText}
      type={confirmConfig.type}
      onConfirm={() => {
        confirmConfig.onConfirm();
        closeConfirm();
      }}
      onCancel={() => {
        confirmConfig.onCancel?.();
        closeConfirm();
      }}
    />
  );

  return {
    showAlert,
    showConfirm,
    AlertDialog: AlertDialogComponent,
    ConfirmDialog: ConfirmDialogComponent
  };
};
