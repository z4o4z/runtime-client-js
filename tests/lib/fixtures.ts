import {
  BlockTrace,
  ChoiceTrace,
  DebugTrace,
  DeviceType,
  ExitTrace,
  FlowTrace,
  SpeakTrace,
  StreamTrace,
  TraceType,
  VisualTrace,
} from '@voiceflow/general-types';
import { SpeakType } from '@voiceflow/general-types/build/nodes/speak';
import { TraceStreamAction } from '@voiceflow/general-types/build/nodes/stream';
import { CanvasVisibility, VisualType } from '@voiceflow/general-types/build/nodes/visual';

export type VFAppVariablesSchema = {
  age: number | 0;
  name: string | 0;
  gender: 'M' | 'F' | 'Other' | 0;
};

export const SPEAK_TRACE: SpeakTrace = {
  type: TraceType.SPEAK,
  payload: {
    type: SpeakType.MESSAGE,
    message: 'Books ought to have to have good endings.',
    src: 'data:audio/mpeg:some-large-tts-audio-file',
  },
};

export const MAKE_SPEAK_TRACE = (payload: SpeakTrace['payload']): SpeakTrace => ({
  type: TraceType.SPEAK,
  payload: {
    ...SPEAK_TRACE.payload,
    ...payload,
  },
});

export const SPEAK_TRACE_AUDIO: SpeakTrace = {
  type: TraceType.SPEAK,
  payload: {
    type: SpeakType.AUDIO,
    message: '<audio src="http://localhost:8000/audio.local/1612307079557-mixaund-tech-corporate.mp3"/>',
    src: 'http://localhost:8000/audio.local/1612307079557-mixaund-tech-corporate.mp3',
  },
};

export const BLOCK_TRACE: BlockTrace = {
  type: TraceType.BLOCK,
  payload: {
    blockID: 'some-block-id',
  },
};

export const CHOICE_TRACE: ChoiceTrace = {
  type: TraceType.CHOICE,
  payload: {
    choices: [
      { name: 'Do you have small available?' },
      { name: "I'd like to order a large please" },
      { name: "I'd like the small  thank you very much" },
    ],
  },
};

export const CHOICE_TRACE_WITH_NO_CHOICES: ChoiceTrace = {
  type: TraceType.CHOICE,
  payload: {
    choices: [],
  },
};

export const FLOW_TRACE: FlowTrace = {
  type: TraceType.FLOW,
  payload: {
    diagramID: 'some-diagram-id',
  },
};

export const STREAM_TRACE: StreamTrace = {
  type: TraceType.STREAM,
  payload: {
    src: 'the source-string',
    action: TraceStreamAction.LOOP,
    token: 'some token for the stream',
  },
};

export const DEBUG_TRACE: DebugTrace = {
  type: TraceType.DEBUG,
  payload: {
    message: '*** this is some debugging message ***',
  },
};

export const END_TRACE: ExitTrace = {
  type: TraceType.END,
};

export const VISUAL_TRACE_IMAGE: VisualTrace & { payload: { visualType: VisualType.IMAGE } } = {
  type: TraceType.VISUAL,
  payload: {
    visualType: VisualType.IMAGE,
    image: 'image.png',
    device: DeviceType.MOBILE,
    dimensions: {
      width: 100,
      height: 200,
    },
    canvasVisibility: CanvasVisibility.CROPPED,
  },
};

export const FAKE_VISUAL_TRACE = {
  type: TraceType.VISUAL,
  payload: {
    visualType: 'fake',
  },
};

export const INTERACT_ENDPOINT = (versionID: string) => `/interact/${versionID}`;

export const STATE_ENDPOINT = (versionID: string) => `/interact/${versionID}/state`;
