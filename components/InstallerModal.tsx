
import React, { useState } from 'react';
import { GhostIcon, KeyIcon, BeakerIcon, HistoryIcon, FilterIcon } from './Icons';

interface InstallerModalProps {
  onComplete: () => void;
}

const STEPS = [
    {
        title: "Initializing snufulufugus",
        description: "Welcome. The following steps will configure the snufulufugus environment on this secure client. Your privacy and operational security are paramount.",
        details: "Preparing secure environment... Verifying crypto-signatures..."
    },
    {
        title: "Core Module Calibration",
        description: "The primary modules are being integrated. Each serves a unique purpose in your toolkit.",
        details: (
            <ul className="space-y-2 text-sm text-gray-400 font-mono">
                <li className="flex items-start"><GhostIcon className="w-4 h-4 mr-3 mt-1 text-cyan-400 flex-shrink-0" /><div><strong>snufulufugus core:</strong> Manages your digital fingerprint via personas and the secure VPN.</div></li>
                <li className="flex items-start"><KeyIcon className="w-4 h-4 mr-3 mt-1 text-cyan-400 flex-shrink-0" /><div><strong>snufulufugus key:</strong> Automates interactions with site security measures and runs custom scripts.</div></li>
                <li className="flex items-start"><BeakerIcon className="w-4 h-4 mr-3 mt-1 text-cyan-400 flex-shrink-0" /><div><strong>snufulufugus toolkit:</strong> Provides OSINT and AI-powered analysis tools for your target.</div></li>
                <li className="flex items-start"><HistoryIcon className="w-4 h-4 mr-3 mt-1 text-cyan-400 flex-shrink-0" /><div><strong>snufulufugus archive:</strong> Creates and explores secure, offline copies of websites.</div></li>
                <li className="flex items-start"><FilterIcon className="w-4 h-4 mr-3 mt-1 text-cyan-400 flex-shrink-0" /><div><strong>snufulufugus purifier:</strong> Deploys advanced defenses against trackers and data leakage.</div></li>
            </ul>
        )
    },
    {
        title: "Configuration Complete",
        description: "snufulufugus is now installed and fully operational. All systems are online. Remember: observe, analyze, and remain unseen.",
        details: "Cleaning up temporary files... Launching main interface..."
    }
];

const InstallerModal: React.FC<InstallerModalProps> = ({ onComplete }) => {
    const [step, setStep] = useState(0);

    const handleNext = () => {
        if (step < STEPS.length - 1) {
            setStep(s => s + 1);
        } else {
            onComplete();
        }
    };

    const currentStep = STEPS[step];
    const isLastStep = step === STEPS.length - 1;

    return (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 animate-fadeIn backdrop-blur-sm">
            <div className="bg-[#0D0D0D] border border-[rgba(0,255,255,0.15)] rounded-lg shadow-2xl shadow-cyan-500/20 w-full max-w-2xl m-4 flex flex-col">
                <div className="p-6 border-b border-[rgba(0,255,255,0.15)]">
                     <h1 className="text-2xl font-bold font-mono tracking-widest text-cyan-400">snufulufugus Installer</h1>
                </div>
                <div className="p-6 flex-grow">
                    <h2 className="text-xl font-semibold text-white mb-2">{currentStep.title}</h2>
                    <p className="text-gray-400 mb-6">{currentStep.description}</p>
                    <div className="bg-black/50 p-4 rounded-md border border-[rgba(0,255,255,0.1)] min-h-[120px]">
                        {typeof currentStep.details === 'string' 
                            ? <p className="text-sm font-mono text-green-400 animate-pulse">{currentStep.details}</p>
                            : currentStep.details
                        }
                    </div>
                </div>
                <div className="p-6 border-t border-[rgba(0,255,255,0.15)] flex justify-between items-center">
                    <div className="text-xs text-gray-500 font-mono">
                        Step {step + 1} of {STEPS.length}
                    </div>
                    <button onClick={handleNext} className="snufulufugus-button primary">
                        {isLastStep ? 'Launch snufulufugus' : 'Continue'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InstallerModal;
