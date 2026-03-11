import React, { useState } from "react";
import { motion } from "framer-motion";

const Design = () => {
  const [selectedComponent, setSelectedComponent] = useState("button");
  const [customStyles, setCustomStyles] = useState({
    backgroundColor: "#3b82f6",
    color: "#ffffff",
    borderRadius: "8px",
    padding: "12px 24px",
    fontSize: "16px",
    fontWeight: "600"
  });
  const [savedDesigns, setSavedDesigns] = useState([
    { id: 1, name: "Blue Button", styles: { backgroundColor: "#3b82f6", color: "#ffffff", borderRadius: "8px", padding: "12px 24px" } },
    { id: 2, name: "Green Card", styles: { backgroundColor: "#10b981", color: "#ffffff", borderRadius: "12px", padding: "16px" } }
  ]);

  const saveDesign = () => {
    const newDesign = {
      id: savedDesigns.length + 1,
      name: `Design ${savedDesigns.length + 1}`,
      styles: customStyles
    };
    setSavedDesigns([...savedDesigns, newDesign]);
  };

  const loadDesign = (design) => {
    setCustomStyles(design.styles);
  };

  const components = [
    { id: "button", name: "Button", icon: "🔘" },
    { id: "card", name: "Card", icon: "📄" },
    { id: "input", name: "Input", icon: "📝" },
    { id: "modal", name: "Modal", icon: "📋" },
    { id: "chat", name: "Chat Bubble", icon: "💬" }
  ];

  const handleStyleChange = (property, value) => {
    setCustomStyles(prev => ({ ...prev, [property]: value }));
  };

  const renderComponent = () => {
    switch (selectedComponent) {
      case "button":
        return (
          <motion.button
            className="font-semibold transition-all duration-300 hover:scale-105"
            style={customStyles}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Custom Button
          </motion.button>
        );
      case "card":
        return (
          <motion.div
            className="p-6 rounded-lg shadow-lg"
            style={{ backgroundColor: customStyles.backgroundColor, color: customStyles.color, borderRadius: customStyles.borderRadius }}
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h3 className="text-xl font-bold mb-2">Interactive Card</h3>
            <p>This is a customizable card component with hover effects.</p>
          </motion.div>
        );
      case "input":
        return (
          <motion.input
            type="text"
            placeholder="Type something..."
            className="border rounded-lg focus:outline-none focus:ring-2 transition-all duration-300"
            style={{
              ...customStyles,
              borderColor: customStyles.backgroundColor,
              borderWidth: "2px"
            }}
            whileFocus={{ scale: 1.02 }}
          />
        );
      case "modal":
        return (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="bg-zinc-800 p-8 rounded-xl max-w-md w-full mx-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-2xl font-bold mb-4">Custom Modal</h2>
              <p className="mb-6">This modal can be styled and animated.</p>
              <button
                className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                onClick={() => setSelectedComponent("button")}
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        );
      case "chat":
        return (
          <motion.div
            className="bg-zinc-800 p-4 rounded-lg max-w-xs"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-2">
                U
              </div>
              <span className="font-semibold">User</span>
            </div>
            <p className="text-sm">This is a customizable chat bubble with animations.</p>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto"
      >
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
          Interactive Design Studio
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Component Selector */}
          <div className="bg-zinc-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Components</h2>
            <div className="space-y-2">
              {components.map((comp) => (
                <button
                  key={comp.id}
                  onClick={() => setSelectedComponent(comp.id)}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-300 ${
                    selectedComponent === comp.id
                      ? "bg-blue-600 text-white"
                      : "bg-zinc-700 hover:bg-zinc-600"
                  }`}
                >
                  <span className="mr-2">{comp.icon}</span>
                  {comp.name}
                </button>
              ))}
            </div>
          </div>

          {/* Style Editor */}
          <div className="bg-zinc-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Style Editor</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Background Color</label>
                <input
                  type="color"
                  value={customStyles.backgroundColor}
                  onChange={(e) => handleStyleChange("backgroundColor", e.target.value)}
                  className="w-full h-10 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Text Color</label>
                <input
                  type="color"
                  value={customStyles.color}
                  onChange={(e) => handleStyleChange("color", e.target.value)}
                  className="w-full h-10 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Border Radius</label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={parseInt(customStyles.borderRadius)}
                  onChange={(e) => handleStyleChange("borderRadius", `${e.target.value}px`)}
                  className="w-full"
                />
                <span className="text-sm text-gray-400">{customStyles.borderRadius}</span>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Padding</label>
                <input
                  type="text"
                  value={customStyles.padding}
                  onChange={(e) => handleStyleChange("padding", e.target.value)}
                  className="w-full p-2 bg-zinc-700 rounded"
                  placeholder="e.g., 12px 24px"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Font Size</label>
                <input
                  type="range"
                  min="12"
                  max="32"
                  value={parseInt(customStyles.fontSize)}
                  onChange={(e) => handleStyleChange("fontSize", `${e.target.value}px`)}
                  className="w-full"
                />
                <span className="text-sm text-gray-400">{customStyles.fontSize}</span>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-zinc-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Live Preview</h2>
            <div className="bg-zinc-900 rounded-lg p-8 min-h-64 flex items-center justify-center">
              {renderComponent()}
            </div>
          </div>

          {/* Save/Load Designs */}
          <div className="bg-zinc-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Design Library</h2>
            <div className="flex space-x-2 mb-4">
              <button
                onClick={saveDesign}
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                Save Design
              </button>
              <button
                onClick={() => setCustomStyles({
                  backgroundColor: "#3f3f46",
                  color: "#ffffff",
                  borderRadius: "8px",
                  padding: "12px 24px",
                  fontSize: "16px"
                })}
                className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                Reset
              </button>
            </div>
            <div className="space-y-2">
              {savedDesigns.map((design) => (
                <button
                  key={design.id}
                  onClick={() => loadDesign(design)}
                  className="w-full text-left p-3 bg-zinc-700 hover:bg-zinc-600 rounded-lg transition-colors"
                >
                  {design.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Animation Playground */}
        <motion.div
          className="mt-8 bg-zinc-800 rounded-xl p-6"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-xl font-semibold mb-4">Animation Playground</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 rounded-lg text-center cursor-pointer"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              Hover Me!
            </motion.div>
            <motion.div
              className="bg-gradient-to-r from-green-500 to-teal-500 p-6 rounded-lg text-center cursor-pointer"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Floating!
            </motion.div>
            <motion.div
              className="bg-gradient-to-r from-red-500 to-pink-500 p-6 rounded-lg text-center cursor-pointer"
              whileHover={{ rotateY: 180 }}
              transition={{ duration: 0.6 }}
            >
              Flip Me!
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Design;