import React from 'react';
import { History, X, MessageSquare } from 'lucide-react';

const PromptHistorySidebar = ({ history, isOpen, onClose, onSelectPrompt }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40" 
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 flex justify-between items-center shadow-md">
          <div className="flex items-center gap-2">
            <History size={20} />
            <h2 className="text-lg font-bold">Prompt History</h2>
          </div>
          <button 
            onClick={onClose} 
            className="hover:bg-white/20 p-2 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* History List */}
        <div className="p-4 space-y-3 overflow-y-auto h-[calc(100vh-80px)]">
          {history.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">No history yet</p>
              <p className="text-sm text-gray-400 mt-1">Your prompts will appear here</p>
            </div>
          ) : (
            history.map((item, index) => (
              <div
                key={index}
                onClick={() => {
                  onSelectPrompt(item);
                  onClose();
                }}
                className="bg-gray-50 hover:bg-blue-50 p-4 rounded-xl cursor-pointer border border-gray-200 hover:border-blue-300 transition-all duration-200 group"
              >
                <div className="flex items-start gap-3">
                  <MessageSquare 
                    size={16} 
                    className="text-blue-600 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" 
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 line-clamp-3 leading-relaxed">
                      {item.prompt}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-gray-500">{item.timestamp}</span>
                      {item.chartType && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                          {item.chartType}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default PromptHistorySidebar;