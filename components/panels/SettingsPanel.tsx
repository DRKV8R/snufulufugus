import React, { useState, useEffect } from 'react';
import Panel, { PanelSection } from './Panel';
import { AgentConfig } from '../../types';

interface SettingsPanelProps {
  currentConfig: AgentConfig;
  onSaveConfig: (config: AgentConfig) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ currentConfig, onSaveConfig }) => {
  const [config, setConfig] = useState<AgentConfig>(currentConfig);

  useEffect(() => {
    setConfig(currentConfig);
  }, [currentConfig]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig(config);
  };

  const isCustom = config.provider === 'custom';

  return (
    <Panel title="snufulufugus settings" subtitle="application configuration">
      <form onSubmit={handleSave}>
        <PanelSection title="Agent Configuration">
          <p className="text-sm text-gray-400 mb-4">
            Configure the AI agent used for analysis. You can use the built-in agent or connect to your own OpenAI-compatible LLM endpoint.
          </p>

          <div className="space-y-4">
            {/* Provider Selection */}
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="provider"
                  value="gemini"
                  checked={config.provider === 'gemini'}
                  onChange={() => setConfig(c => ({ ...c, provider: 'gemini' }))}
                  className="form-radio h-4 w-4 text-cyan-500 bg-gray-700 border-gray-600 focus:ring-cyan-600"
                />
                <span className="text-gray-200">snufulufugus Agent (Gemini)</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="provider"
                  value="custom"
                  checked={config.provider === 'custom'}
                  onChange={() => setConfig(c => ({ ...c, provider: 'custom' }))}
                  className="form-radio h-4 w-4 text-cyan-500 bg-gray-700 border-gray-600 focus:ring-cyan-600"
                />
                <span className="text-gray-200">Custom (OpenAI-Compatible)</span>
              </label>
            </div>

            {/* Custom Provider Fields */}
            {isCustom && (
              <div className="pl-6 border-l-2 border-cyan-500/30 space-y-4 pt-2 animate-fadeIn">
                <div>
                  <label htmlFor="endpoint-url" className="block text-sm font-medium text-[#00BFFF] mb-2">
                    Endpoint URL
                  </label>
                  <input
                    type="url"
                    id="endpoint-url"
                    placeholder="https://your-llm-provider.com/v1/chat/completions"
                    value={config.endpoint || ''}
                    onChange={(e) => setConfig(c => ({ ...c, endpoint: e.target.value }))}
                    className="w-full snufulufugus-input"
                    required={isCustom}
                  />
                </div>
                <div>
                  <label htmlFor="api-key" className="block text-sm font-medium text-[#00BFFF] mb-2">
                    API Key
                  </label>
                  <input
                    type="password"
                    id="api-key"
                    placeholder="Enter your API key"
                    value={config.apiKey || ''}
                    onChange={(e) => setConfig(c => ({ ...c, apiKey: e.target.value }))}
                    className="w-full snufulufugus-input font-mono"
                    required={isCustom}
                  />
                </div>
              </div>
            )}
          </div>
        </PanelSection>

        <div className="mt-6 flex justify-end">
          <button type="submit" className="snufulufugus-button primary">
            Save Settings
          </button>
        </div>
      </form>
    </Panel>
  );
};

export default SettingsPanel;