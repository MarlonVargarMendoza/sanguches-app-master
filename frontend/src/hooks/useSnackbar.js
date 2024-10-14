// src/hooks/useSnackbar.js
import { useCallback, useState } from 'react';

export const useSnackbar = () => {
    const [snackbarState, setSnackbarState] = useState({ open: false, message: '', severity: 'success' });

    const handleSnackbarMessage = useCallback((message, severity = 'success') => {
        setSnackbarState({ open: true, message, severity });
    }, []);

    const closeSnackbar = useCallback(() => {
        setSnackbarState(prev => ({ ...prev, open: false }));
    }, []);

    return { snackbarState, handleSnackbarMessage, closeSnackbar };
};