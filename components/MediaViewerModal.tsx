import React from 'react';
import { MediaAsset } from '../types';
import { XIcon } from './Icons';

interface MediaViewerModalProps {
  asset: MediaAsset | null;
  onClose: () => void;
}

const MediaViewerModal: React.FC<MediaViewerModalProps> = ({ asset, onClose }) => {
  if (!asset) return null;

  const renderMedia = () => {
    switch (asset.type) {
      case 'video':
        return (
          <video controls autoPlay className="w-full max-h-[80vh] rounded bg-black">
            <source src={asset.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        );
      case 'audio':
        return (
          <div className="p-8">
            <audio controls autoPlay className="w-full">
                <source src={asset.url} type="audio/mp4" />
                Your browser does not support the audio element.
            </audio>
          </div>
        );
      case 'document':
        return (
            <div className="p-8 text-center">
                <p className="text-lg">Displaying document: <strong>{asset.name}</strong></p>
                <p className="text-gray-400 mt-2">(In a real application, this would render the document content.)</p>
                <a href={asset.url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded">
                    Open Document
                </a>
            </div>
        );
      default:
        return <p>Unsupported media type.</p>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fadeIn backdrop-blur-sm" onClick={onClose}>
      <div className="bg-[#1A1A1A] border border-[rgba(0,255,255,0.15)] rounded-lg shadow-2xl shadow-cyan-500/10 max-w-4xl w-full m-4 relative" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b border-[rgba(0,255,255,0.15)]">
            <h3 className="font-bold text-[#00FFFF] truncate">{asset.name}</h3>
            <button onClick={onClose} className="p-1 text-gray-400 hover:text-white hover:bg-[#262626] rounded-full">
                <XIcon className="w-5 h-5" />
            </button>
        </div>
        <div className="p-1 bg-black/20 md:p-4">
            {renderMedia()}
        </div>
      </div>
    </div>
  );
};

export default MediaViewerModal;