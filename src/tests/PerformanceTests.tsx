import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TransportBar from '../components/TransportBar';
import TrackList from '../components/TrackList';
import MixerView from '../components/MixerView';
import PluginRack from '../components/PluginRack';
import MeterBridges from '../components/MeterBridges';

test('Performance test for TransportBar', () => {
  const onPlay = jest.fn();
  const onPause = jest.fn();
  const onStop = jest.fn();

  const { getByText } = render(
    <TransportBar onPlay={onPlay} onPause={onPause} onStop={onStop} />
  );

  const start = performance.now();
  fireEvent.click(getByText('Play'));
  const end = performance.now();

  expect(end - start).toBeLessThan(50); // Ensure the action is performed within 50ms
});

test('Performance test for TrackList', () => {
  const tracks = [
    { id: 1, name: 'Track 1', isMuted: false, isSolo: false },
    { id: 2, name: 'Track 2', isMuted: true, isSolo: false },
  ];
  const onMuteToggle = jest.fn();
  const onSoloToggle = jest.fn();

  const { getByText } = render(
    <TrackList tracks={tracks} onMuteToggle={onMuteToggle} onSoloToggle={onSoloToggle} />
  );

  const start = performance.now();
  fireEvent.click(getByText('Mute'));
  const end = performance.now();

  expect(end - start).toBeLessThan(50); // Ensure the action is performed within 50ms
});

test('Performance test for MixerView', () => {
  const tracks = [
    { id: 1, name: 'Track 1', volume: 50, pan: 0 },
    { id: 2, name: 'Track 2', volume: 75, pan: -25 },
  ];
  const onVolumeChange = jest.fn();
  const onPanChange = jest.fn();

  const { getByDisplayValue } = render(
    <MixerView tracks={tracks} onVolumeChange={onVolumeChange} onPanChange={onPanChange} />
  );

  const start = performance.now();
  fireEvent.change(getByDisplayValue('50'), { target: { value: '60' } });
  const end = performance.now();

  expect(end - start).toBeLessThan(50); // Ensure the action is performed within 50ms
});

test('Performance test for PluginRack', () => {
  const effects = [
    { id: 1, name: 'Reverb', isActive: true },
    { id: 2, name: 'Delay', isActive: false },
  ];
  const onToggleEffect = jest.fn();
  const onAddEffect = jest.fn();
  const onRemoveEffect = jest.fn();

  const { getByText, getByPlaceholderText } = render(
    <PluginRack
      effects={effects}
      onToggleEffect={onToggleEffect}
      onAddEffect={onAddEffect}
      onRemoveEffect={onRemoveEffect}
    />
  );

  const start = performance.now();
  fireEvent.click(getByText('Deactivate'));
  const end = performance.now();

  expect(end - start).toBeLessThan(50); // Ensure the action is performed within 50ms
});

test('Performance test for MeterBridges', () => {
  const levels = [50, 75, 100];

  const { container } = render(<MeterBridges levels={levels} />);

  const start = performance.now();
  const meterLevels = container.getElementsByClassName('meter-level');
  const end = performance.now();

  expect(meterLevels).toHaveLength(3);
  expect(end - start).toBeLessThan(50); // Ensure the action is performed within 50ms
});
