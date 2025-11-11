import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ToastProvider';

const API_URL = 'http://localhost:5000/api';

export function useVisualizationState(algorithmSlug) {
  const { token } = useAuth();
  const { showToast } = useToast();
  const [hasSavedState, setHasSavedState] = useState(false);
  const [savedState, setSavedState] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (token && algorithmSlug) {
      loadSavedState();
    }
  }, [token, algorithmSlug]);

  const loadSavedState = async () => {
    if (!token || !algorithmSlug) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/visualization-state/load/${algorithmSlug}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.hasSavedState) {
          setHasSavedState(true);
          setSavedState(data.state);
        } else {
          setHasSavedState(false);
          setSavedState(null);
        }
      }
    } catch (error) {
      console.error('Error loading saved state:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveState = async (state) => {
    if (!token || !algorithmSlug) {
      showToast('Please login to save progress', 'error');
      return false;
    }

    setSaving(true);
    try {
      const response = await fetch(`${API_URL}/visualization-state/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          algorithmSlug,
          state,
        }),
      });

      if (response.ok) {
        showToast('Progress saved successfully', 'success');
        setHasSavedState(true);
        return true;
      } else {
        const error = await response.json();
        showToast(error.error || 'Failed to save progress', 'error');
        return false;
      }
    } catch (error) {
      console.error('Error saving state:', error);
      showToast('Error saving progress', 'error');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const clearSavedState = async () => {
    if (!token || !algorithmSlug) return;

    try {
      const response = await fetch(`${API_URL}/visualization-state/clear/${algorithmSlug}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setHasSavedState(false);
        setSavedState(null);
        showToast('Saved progress cleared', 'success');
        return true;
      }
    } catch (error) {
      console.error('Error clearing state:', error);
      showToast('Error clearing progress', 'error');
      return false;
    }
  };

  return {
    hasSavedState,
    savedState,
    loading,
    saving,
    saveState,
    loadSavedState,
    clearSavedState,
  };
}

