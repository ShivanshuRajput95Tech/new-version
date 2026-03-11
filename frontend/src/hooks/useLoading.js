import { useState, useEffect, useCallback } from "react";

export const useLoading = (initialLoading = false) => {
  const [isLoading, setIsLoading] = useState(initialLoading);
  const [loadingMessage, setLoadingMessage] = useState("Loading...");
  const [loadingProgress, setLoadingProgress] = useState(null);
  const [loadingVariant, setLoadingVariant] = useState("default");

  const startLoading = useCallback((message = "Loading...", variant = "default") => {
    setIsLoading(true);
    setLoadingMessage(message);
    setLoadingVariant(variant);
    setLoadingProgress(null);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
    setLoadingMessage("Loading...");
    setLoadingProgress(null);
    setLoadingVariant("default");
  }, []);

  const updateProgress = useCallback((progress) => {
    setLoadingProgress(progress);
  }, []);

  const updateMessage = useCallback((message) => {
    setLoadingMessage(message);
  }, []);

  const setVariant = useCallback((variant) => {
    setLoadingVariant(variant);
  }, []);

  // Simulate progress for async operations
  const simulateProgress = useCallback(async (operation, steps = 100) => {
    setLoadingProgress(0);
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        const newProgress = prev + (100 / steps);
        return newProgress >= 95 ? 95 : newProgress;
      });
    }, 50);

    try {
      await operation();
      setLoadingProgress(100);
      setTimeout(() => {
        stopLoading();
      }, 300);
    } catch (error) {
      clearInterval(progressInterval);
      throw error;
    } finally {
      clearInterval(progressInterval);
    }
  }, [stopLoading]);

  return {
    isLoading,
    loadingMessage,
    loadingProgress,
    loadingVariant,
    startLoading,
    stopLoading,
    updateProgress,
    updateMessage,
    setVariant,
    simulateProgress
  };
};

// Predefined loading configurations
export const loadingConfigs = {
  initialLoad: {
    message: "Initializing your chat experience...",
    variant: "detailed"
  },
  login: {
    message: "Signing you in...",
    variant: "pulse"
  },
  register: {
    message: "Creating your account...",
    variant: "spinner"
  },
  sendingMessage: {
    message: "Sending message...",
    variant: "dots"
  },
  loadingChat: {
    message: "Loading conversations...",
    variant: "wave"
  },
  connecting: {
    message: "Connecting to chat servers...",
    variant: "logo"
  },
  uploading: {
    message: "Uploading file...",
    variant: "spinner"
  },
  syncing: {
    message: "Syncing data...",
    variant: "detailed"
  }
};