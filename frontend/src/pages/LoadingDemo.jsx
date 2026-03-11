import React, { useState } from "react";
import { motion } from "framer-motion";
import LoadingPage from "../components/LoadingPage";
import { useGlobalLoading } from "../context/GlobalLoadingContext";
import { loadingConfigs } from "../hooks/useLoading";

const LoadingDemo = () => {
  const [selectedVariant, setSelectedVariant] = useState("default");
  const [showGlobalLoading, setShowGlobalLoading] = useState(false);
  const globalLoading = useGlobalLoading();

  const variants = [
    { id: "default", name: "Default", description: "Classic spinning loader with heart" },
    { id: "pulse", name: "Pulse", description: "Pulsing animated icon" },
    { id: "spinner", name: "Spinner", description: "Dual rotating spinners" },
    { id: "dots", name: "Dots", description: "Bouncing dots animation" },
    { id: "wave", name: "Wave", description: "Audio-style wave bars" },
    { id: "detailed", name: "Detailed", description: "Step-by-step loading with icons" },
    { id: "logo", name: "Logo", description: "Animated logo with glow effect" }
  ];

  const handleGlobalLoadingDemo = async (config) => {
    setShowGlobalLoading(true);
    globalLoading.startLoading(config.message, config.variant);

    // Simulate loading time
    await new Promise(resolve => setTimeout(resolve, 3000));

    globalLoading.stopLoading();
    setShowGlobalLoading(false);
  };

  const handleProgressDemo = async () => {
    globalLoading.startLoading("Processing your request...", "spinner");

    for (let i = 0; i <= 100; i += 10) {
      globalLoading.updateProgress(i);
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    globalLoading.stopLoading();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Loading Page Showcase
          </h1>
          <p className="text-slate-400 text-lg">
            Interactive loading animations for your chat application
          </p>
        </motion.div>

        {/* Global Loading Demo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-slate-700/50"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Global Loading States</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(loadingConfigs).map(([key, config]) => (
              <motion.button
                key={key}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleGlobalLoadingDemo(config)}
                disabled={showGlobalLoading}
                className="p-4 bg-slate-800/50 hover:bg-slate-700/50 rounded-xl border border-slate-600/30 transition-all duration-200 text-left disabled:opacity-50"
              >
                <h3 className="font-semibold text-indigo-400 capitalize mb-2">{key.replace(/([A-Z])/g, ' $1')}</h3>
                <p className="text-sm text-slate-400">{config.message}</p>
                <p className="text-xs text-slate-500 mt-1">Variant: {config.variant}</p>
              </motion.button>
            ))}
          </div>

          <div className="mt-6 text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleProgressDemo}
              disabled={showGlobalLoading}
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 disabled:opacity-50"
            >
              Demo Progress Bar
            </motion.button>
          </div>
        </motion.div>

        {/* Variant Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-slate-700/50"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Loading Variants</h2>

          {/* Variant Selector */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {variants.map((variant) => (
              <motion.button
                key={variant.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedVariant(variant.id)}
                className={`p-4 rounded-xl border transition-all duration-200 text-left ${
                  selectedVariant === variant.id
                    ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300'
                    : 'bg-slate-800/50 border-slate-600/30 hover:bg-slate-700/50'
                }`}
              >
                <h3 className="font-semibold mb-1">{variant.name}</h3>
                <p className="text-sm text-slate-400">{variant.description}</p>
              </motion.button>
            ))}
          </div>

          {/* Live Preview */}
          <div className="bg-slate-950/50 rounded-xl p-8 border border-slate-700/30">
            <h3 className="text-xl font-semibold mb-4 text-center">Live Preview</h3>
            <div className="h-96 flex items-center justify-center">
              <LoadingPage
                message={`Previewing ${variants.find(v => v.id === selectedVariant)?.name} variant`}
                variant={selectedVariant}
                size="medium"
              />
            </div>
          </div>
        </motion.div>

        {/* Usage Examples */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Usage Examples</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-indigo-400">Basic Usage</h3>
              <pre className="bg-slate-800/50 p-4 rounded-lg text-sm overflow-x-auto border border-slate-600/30">
{`<LoadingPage
  message="Loading your data..."
  variant="spinner"
/>`}
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-indigo-400">With Progress</h3>
              <pre className="bg-slate-800/50 p-4 rounded-lg text-sm overflow-x-auto border border-slate-600/30">
{`<LoadingPage
  message="Uploading file..."
  progress={75}
  variant="detailed"
/>`}
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-indigo-400">Using Hook</h3>
              <pre className="bg-slate-800/50 p-4 rounded-lg text-sm overflow-x-auto border border-slate-600/30">
{`const loading = useLoading();

loading.startLoading("Connecting...", "pulse");
// ... async operation
loading.stopLoading();`}
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-indigo-400">Global Loading</h3>
              <pre className="bg-slate-800/50 p-4 rounded-lg text-sm overflow-x-auto border border-slate-600/30">
{`const globalLoading = useGlobalLoading();

globalLoading.startLoading(
  "Signing you in...",
  "detailed"
);`}
              </pre>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoadingDemo;