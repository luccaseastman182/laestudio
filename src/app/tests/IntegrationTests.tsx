import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TransportBar from '../components/TransportBar';
import TrackList from '../components/TrackList';
import MixerView from '../components/MixerView';
import PluginRack from '../components/PluginRack';
import MeterBridges from '../components/MeterBridges';

test('Integration test for TransportBar and TrackList', async () => {
  const onPlay = jest.fn();
  const onPause = jest.fn();
  const onStop = jest.fn();
  const onMuteToggle = jest.fn();
  const onSoloToggle = jest.fn();

  const tracks = [
    { id: 1, name: 'Track 1', isMuted: false, isSolo: false },
    { id: 2, name: 'Track 2', isMuted: true, isSolo: false },
  ];

  const { getByText } = render(
    <>
      <TransportBar onPlay={onPlay} onPause={onPause} onStop={onStop} />
      <TrackList tracks={tracks} onMuteToggle={onMuteToggle} onSoloToggle={onSoloToggle} />
    </>
  );

  fireEvent.click(getByText('Play'));
  expect(onPlay).toHaveBeenCalled();

  fireEvent.click(getByText('Mute'));
  expect(onMuteToggle).toHaveBeenCalledWith(1);

  fireEvent.click(getByText('Solo'));
  expect(onSoloToggle).toHaveBeenCalledWith(1);

  fireEvent.click(getByText('Pause'));
  expect(onPause).toHaveBeenCalled();

  fireEvent.click(getByText('Stop'));
  expect(onStop).toHaveBeenCalled();
});

test('Integration test for MixerView and PluginRack', async () => {
  const onVolumeChange = jest.fn();
  const onPanChange = jest.fn();
  const onToggleEffect = jest.fn();
  const onAddEffect = jest.fn();
  const onRemoveEffect = jest.fn();

  const tracks = [
    { id: 1, name: 'Track 1', volume: 50, pan: 0 },
    { id: 2, name: 'Track 2', volume: 75, pan: -25 },
  ];

  const effects = [
    { id: 1, name: 'Reverb', isActive: true },
    { id: 2, name: 'Delay', isActive: false },
  ];

  const { getByDisplayValue, getByText, getByPlaceholderText } = render(
    <>
      <MixerView tracks={tracks} onVolumeChange={onVolumeChange} onPanChange={onPanChange} />
      <PluginRack
        effects={effects}
        onToggleEffect={onToggleEffect}
        onAddEffect={onAddEffect}
        onRemoveEffect={onRemoveEffect}
      />
    </>
  );

  fireEvent.change(getByDisplayValue('50'), { target: { value: '60' } });
  expect(onVolumeChange).toHaveBeenCalledWith(1, 60);

  fireEvent.change(getByDisplayValue('-25'), { target: { value: '0' } });
  expect(onPanChange).toHaveBeenCalledWith(2, 0);

  fireEvent.click(getByText('Deactivate'));
  expect(onToggleEffect).toHaveBeenCalledWith(1);

  fireEvent.change(getByPlaceholderText('New effect name'), { target: { value: 'Chorus' } });
  fireEvent.click(getByText('Add Effect'));
  expect(onAddEffect).toHaveBeenCalledWith('Chorus');

  fireEvent.click(getByText('Remove'));
  expect(onRemoveEffect).toHaveBeenCalledWith(1);
});

test('Integration test for MeterBridges', async () => {
  const levels = [50, 75, 100];

  const { container } = render(<MeterBridges levels={levels} />);

  const meterLevels = container.getElementsByClassName('meter-level');
  expect(meterLevels).toHaveLength(3);
  expect(meterLevels[0]).toHaveStyle('height: 50%');
  expect(meterLevels[1]).toHaveStyle('height: 75%');
  expect(meterLevels[2]).toHaveStyle('height: 100%');
});
