import React, { useState, useEffect } from 'react';

type MIDISupportProps = {
  onMIDINoteOn: (note: number, velocity: number) => void;
  onMIDINoteOff: (note: number) => void;
};

const MIDISupport: React.FC<MIDISupportProps> = ({ onMIDINoteOn, onMIDINoteOff }) => {
  const [midiAccess, setMidiAccess] = useState<WebMidi.MIDIAccess | null>(null);

  useEffect(() => {
    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess().then((access) => {
        setMidiAccess(access);
        access.inputs.forEach((input) => {
          input.onmidimessage = handleMIDIMessage;
        });
      });
    }
  }, []);

  const handleMIDIMessage = (message: WebMidi.MIDIMessageEvent) => {
    const [command, note, velocity] = message.data;
    switch (command) {
      case 144: // Note On
        if (velocity > 0) {
          onMIDINoteOn(note, velocity);
        } else {
          onMIDINoteOff(note);
        }
        break;
      case 128: // Note Off
        onMIDINoteOff(note);
        break;
      default:
        break;
    }
  };

  return <div className="midi-support">MIDI Support Enabled</div>;
};

export default MIDISupport;
