import { SpeakTrace } from '@voiceflow/general-types';
import _ from 'lodash';

export type SpeakTraceAudioHandler = (message: SpeakTrace['payload']['message'], src: SpeakTrace['payload']['src']) => any;
export type SpeakTraceTTSHandler = (message: SpeakTrace['payload']['message'], src: SpeakTrace['payload']['src']) => any;
export type SpeakTraceHandlerFunction = (
  message: SpeakTrace['payload']['message'],
  src: SpeakTrace['payload']['src'],
  type: SpeakTrace['payload']['type']
) => any;
export type SpeakTraceHandlerMap = Partial<{
  handleAudio: SpeakTraceAudioHandler;
  handleSpeech: SpeakTraceTTSHandler;
}>;
export type SpeakTraceHandler = SpeakTraceHandlerFunction | SpeakTraceHandlerMap;

export const invokeSpeakHandler = (trace: SpeakTrace, speakHandler: SpeakTraceHandler) => {
  const {
    payload: { type: speakTraceType, message: speakMessage, src: speakSrc },
  } = trace;

  if (_.isFunction(speakHandler)) {
    return speakHandler(speakMessage, speakSrc, speakTraceType);
  }

  if (speakTraceType === 'message') {
    if (!speakHandler.handleSpeech) {
      throw new Error("VFError: missing handler for SpeakTrace's speak subtype");
    }
    return speakHandler.handleSpeech(speakMessage, speakSrc);
  }
  if (speakTraceType === 'audio') {
    if (!speakHandler.handleAudio) {
      throw new Error("VFError: missing handler for SpeakTrace's audio subtype");
    }
    return speakHandler.handleAudio(speakMessage, speakSrc);
  }
  throw new TypeError("VFError: makeTraceProcessor's returned callback received an unknown SpeakTrace subtype");
};