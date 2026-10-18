import React, { useState, useEffect } from 'react';
import { Prospect } from '../../data/mockData';

interface DialerModalProps {
  prospect: Prospect;
  isOpen: boolean;
  onClose: () => void;
  onDisposition: (disposition: string) => void;
}

export const DialerModal: React.FC<DialerModalProps> = ({
  prospect,
  isOpen,
  onClose,
  onDisposition,
}) => {
  const [callState, setCallState] = useState<'dialing' | 'connected' | 'completed'>('dialing');
  const [seconds, setSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [callNotes, setCallNotes] = useState('');
  const [completedTracks, setCompletedTracks] = useState<Record<string, boolean>>({
    opener: false,
    pain: false,
    proof: false,
    cta: false,
  });
  const [activeRebuttal, setActiveRebuttal] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setCallState('dialing');
      setSeconds(0);
      setCompletedTracks({ opener: false, pain: false, proof: false, cta: false });
      return;
    }

    const timer = setTimeout(() => {
      setCallState('connected');
    }, 2200);

    return () => clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    let interval: any = null;
    if (callState === 'connected') {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callState]);

  if (!isOpen) return null;

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    setCallState('completed');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden flex flex-col">
        {/* Header HUD */}
        <div className="bg-surface-container-high/60 p-4 border-b border-outline-variant flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${callState === 'connected' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500 animate-ping'}`}></div>
            <div>
              <p className="text-xs uppercase font-bold text-on-surface-variant tracking-wider">
                {callState === 'dialing' && 'Ringing Target Switchboard...'}
                {callState === 'connected' && `Call in Progress • ${formatTime(seconds)}`}
                {callState === 'completed' && 'Call Concluded • Select Outcome'}
              </p>
              <h2 className="text-lg font-headline-md font-bold text-on-surface">
                {prospect.name} • {prospect.company}
              </h2>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-mono font-semibold bg-surface-container px-2 py-1 rounded">
              {prospect.directPhone}
            </span>
          </div>
        </div>

        {/* Call Center Body */}
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {callState === 'connected' && (
            <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-emerald-800 font-medium">
                <span className="material-symbols-outlined text-emerald-600 text-sm">graphic_eq</span>
                <span>Active VoIP Audio Stream (WebRTC • 48kHz HD Audio)</span>
              </div>
              <span className="text-xs font-mono text-emerald-700 font-bold">{formatTime(seconds)}</span>
            </div>
          )}

          {/* Talking Track Checklist */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">checklist</span> Live Script Talking Points
              </span>
              <span className="text-xs text-on-surface-variant">Check off as you speak</span>
            </div>

            <div className="space-y-2 text-xs">
              <label className="flex items-start gap-2.5 p-2 rounded-lg border border-outline-variant hover:bg-surface-container-low cursor-pointer">
                <input
                  type="checkbox"
                  checked={completedTracks.opener}
                  onChange={(e) => setCompletedTracks({ ...completedTracks, opener: e.target.checked })}
                  className="w-4 h-4 rounded text-primary mt-0.5"
                />
                <div className="flex-1">
                  <strong className="text-on-surface">1. Opener:</strong> "Saw your post on LinkedIn celebrating CloudScale's 4x cluster expansion..."
                </div>
              </label>

              <label className="flex items-start gap-2.5 p-2 rounded-lg border border-outline-variant hover:bg-surface-container-low cursor-pointer">
                <input
                  type="checkbox"
                  checked={completedTracks.pain}
                  onChange={(e) => setCompletedTracks({ ...completedTracks, pain: e.target.checked })}
                  className="w-4 h-4 rounded text-primary mt-0.5"
                />
                <div className="flex-1">
                  <strong className="text-on-surface">2. Pain Hook:</strong> "Typically teams scale Kubernetes nodes face 30%+ compute waste headroom..."
                </div>
              </label>

              <label className="flex items-start gap-2.5 p-2 rounded-lg border border-outline-variant hover:bg-surface-container-low cursor-pointer">
                <input
                  type="checkbox"
                  checked={completedTracks.proof}
                  onChange={(e) => setCompletedTracks({ ...completedTracks, proof: e.target.checked })}
                  className="w-4 h-4 rounded text-primary mt-0.5"
                />
                <div className="flex-1">
                  <strong className="text-on-surface">3. Proof Point:</strong> "Datasync stripped out $420k annual idle costs in 4 weeks..."
                </div>
              </label>

              <label className="flex items-start gap-2.5 p-2 rounded-lg border border-outline-variant hover:bg-surface-container-low cursor-pointer">
                <input
                  type="checkbox"
                  checked={completedTracks.cta}
                  onChange={(e) => setCompletedTracks({ ...completedTracks, cta: e.target.checked })}
                  className="w-4 h-4 rounded text-primary mt-0.5"
                />
                <div className="flex-1">
                  <strong className="text-on-surface">4. Call to Action:</strong> "15 minutes this Thursday afternoon for a quick Google Meet?"
                </div>
              </label>
            </div>
          </div>

          {/* Quick Objection Handler Buttons */}
          <div className="space-y-1.5 pt-1">
            <span className="text-xs font-bold text-on-surface">Live Objection Rapid Responses:</span>
            <div className="flex flex-wrap gap-2 text-xs">
              <button
                onClick={() => setActiveRebuttal(activeRebuttal === 'datadog' ? null : 'datadog')}
                className="px-2.5 py-1 rounded-md bg-surface-container hover:bg-surface-container-high border border-outline-variant"
              >
                "We use Datadog"
              </button>
              <button
                onClick={() => setActiveRebuttal(activeRebuttal === 'budget' ? null : 'budget')}
                className="px-2.5 py-1 rounded-md bg-surface-container hover:bg-surface-container-high border border-outline-variant"
              >
                "No budget"
              </button>
              <button
                onClick={() => setActiveRebuttal(activeRebuttal === 'email' ? null : 'email')}
                className="px-2.5 py-1 rounded-md bg-surface-container hover:bg-surface-container-high border border-outline-variant"
              >
                "Send me an email first"
              </button>
            </div>

            {activeRebuttal && (
              <div className="p-3 rounded-lg bg-primary-fixed/30 border border-primary text-xs text-on-surface space-y-1 animate-in fade-in">
                <strong className="text-primary font-bold">Say This Word-For-Word:</strong>
                {activeRebuttal === 'datadog' && (
                  <p>"Datadog is fantastic for observability alarms. RevIntel sits right beneath Datadog to actively trim the resource tier dynamically. Think of us as the auto-remediator rather than another dashboard."</p>
                )}
                {activeRebuttal === 'budget' && (
                  <p>"Understood. The reason Datasync worked with us is that we are self-funding. We take our fee solely out of the documented AWS rebates we unlock within the first 60 days."</p>
                )}
                {activeRebuttal === 'email' && (
                  <p>"Absolutely, I'll send our 1-page Datasync benchmark. But so I don't flood your inbox with irrelevant slides, are you more focused on spot-instance latency or direct AWS egress rates right now?"</p>
                )}
              </div>
            )}
          </div>

          {/* Call Notes Area */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-on-surface">Call Disposition Notes:</label>
            <textarea
              value={callNotes}
              onChange={(e) => setCallNotes(e.target.value)}
              placeholder="E.g. Sarah agreed to 15-min GMeet demo on Thursday. Wants to see the Datasync Terraform module..."
              rows={2}
              className="w-full text-xs p-2.5 rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Footer Controls & Disposition Actions */}
        <div className="bg-surface-container-low p-4 border-t border-outline-variant space-y-3">
          {callState !== 'completed' ? (
            <div className="flex items-center justify-between">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-semibold transition-colors ${
                  isMuted ? 'bg-error text-white border-error' : 'bg-surface border-outline-variant text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">
                  {isMuted ? 'mic_off' : 'mic'}
                </span>
                <span>{isMuted ? 'Muted' : 'Mute Rep'}</span>
              </button>

              <button
                onClick={handleEndCall}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-error hover:bg-error/90 text-white font-semibold text-xs shadow-sm transition-all active:scale-[0.98]"
              >
                <span className="material-symbols-outlined text-[18px]">call_end</span>
                <span>End Call &amp; Log Disposition</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <span className="text-xs font-bold text-on-surface block">Select Call Disposition:</span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => {
                    onDisposition(`Booked Google Meet Demo with ${prospect.name} (Calendar link triggered)`);
                    onClose();
                  }}
                  className="p-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <span className="material-symbols-outlined text-[16px]">video_camera_front</span>
                  <span>Booked GMeet Demo</span>
                </button>

                <button
                  onClick={() => {
                    onDisposition(`Logged Follow-up Sequence for ${prospect.name}`);
                    onClose();
                  }}
                  className="p-2.5 rounded-lg bg-primary hover:bg-primary-container text-white font-bold flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <span className="material-symbols-outlined text-[16px]">mail</span>
                  <span>Queue Followup Email</span>
                </button>

                <button
                  onClick={() => {
                    onDisposition(`Left Voicemail with ${prospect.name}`);
                    onClose();
                  }}
                  className="p-2 rounded-lg border border-outline-variant bg-surface hover:bg-surface-container font-medium text-on-surface"
                >
                  Left Voicemail
                </button>

                <button
                  onClick={() => {
                    onDisposition(`Call not answered / gatekeeper`);
                    onClose();
                  }}
                  className="p-2 rounded-lg border border-outline-variant bg-surface hover:bg-surface-container font-medium text-on-surface"
                >
                  Gatekeeper / Busy
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
