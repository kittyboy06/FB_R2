import pipelineBuffer from '../engine/pipelineBuffer.js';

export default function PauseButton() {
  const togglePause = () => {
    if (pipelineBuffer.isPaused) {
      pipelineBuffer.play();
    } else {
      pipelineBuffer.pause();
    }
  };

  return (
    <button
      id="pause-btn"
      onClick={togglePause}
      className="px-4 py-1.5 rounded text-xs font-bold uppercase tracking-wider select-none flex items-center gap-2 border transition-all duration-200 cursor-pointer shadow-lg bg-amber-600/20 text-amber-400 border-amber-500/30 hover:bg-amber-600/35 shadow-amber-950/20"
    >
      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
      Pause Ingest
    </button>
  );
}
