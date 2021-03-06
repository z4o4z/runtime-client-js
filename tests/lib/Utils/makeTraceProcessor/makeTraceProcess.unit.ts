import { GeneralTrace, SpeakTrace, TraceType } from '@voiceflow/general-types';
import { invokeBlockHandler } from '@/lib/Utils/makeTraceProcessor/block';
import { invokeChoiceHandler } from '@/lib/Utils/makeTraceProcessor/choice';
import { invokeDebugHandler } from '@/lib/Utils/makeTraceProcessor/debug';
import { invokeEndHandler } from '@/lib/Utils/makeTraceProcessor/end';
import { invokeFlowHandler } from '@/lib/Utils/makeTraceProcessor/flow';
import { invokeSpeakHandler, SpeakTraceHandler, SpeakTraceHandlerMap } from '@/lib/Utils/makeTraceProcessor/speak';
import { invokeStreamHandler } from '@/lib/Utils/makeTraceProcessor/stream';
import { expect } from 'chai';
import sinon from 'sinon';
import { BLOCK_TRACE, CHOICE_TRACE, DEBUG_TRACE, END_TRACE, FLOW_TRACE, SPEAK_TRACE, SPEAK_TRACE_AUDIO, STREAM_TRACE, VISUAL_TRACE_IMAGE } from '../../fixtures';
import { blockHandler, choiceHandler, debugHandler, endHandler, FAKE_SPEAK_TRACE, flowHandler, RESULT, speakHandlerFunc, speakHandlerMap, streamHandler, TRACE_HANDLER_MAP, UNKNOWN_TRACE_TYPE, visualHandlerFunc } from './fixtures';
import { invokeVisualHandler } from '@/lib/Utils/makeTraceProcessor/visual';
import { makeTraceProcessor } from '@/lib/Utils/makeTraceProcessor';

describe('makeTraceProcessor', () => {
    afterEach(() => {
      sinon.restore();
    });

    it('invokeBlockHandler', () => {
        const result = invokeBlockHandler(BLOCK_TRACE, blockHandler);
        expect(result).to.eql(BLOCK_TRACE.payload.blockID);
    });

    it('invokeChoiceHandler', () => {
        const result = invokeChoiceHandler(CHOICE_TRACE, choiceHandler);
        expect(result).to.eql(CHOICE_TRACE.payload.choices);
    });

    it('invokeDebugHandler', () => {
        const result = invokeDebugHandler(DEBUG_TRACE, debugHandler);
        expect(result).to.eql(DEBUG_TRACE.payload.message);
    });

    it('invokeEndHandler', () => {
        const result = invokeEndHandler(END_TRACE, endHandler);
        expect(result).to.eql(RESULT);
    });

    it('invokeFlowHandler', () => {
        const result = invokeFlowHandler(FLOW_TRACE, flowHandler);
        expect(result).to.eql(FLOW_TRACE.payload.diagramID);
    });

    it('invokeStreamHandler', () => {
        const result = invokeStreamHandler(STREAM_TRACE, streamHandler);

        expect(result).to.eql([
            STREAM_TRACE.payload.src,
            STREAM_TRACE.payload.action,
            STREAM_TRACE.payload.token,
        ]);
    });

    it('invokeVisualHandler', () => {
        const result = invokeVisualHandler(VISUAL_TRACE_IMAGE, visualHandlerFunc);

        expect(result).to.eql([
            VISUAL_TRACE_IMAGE.payload.image,
            VISUAL_TRACE_IMAGE.payload.device,
            VISUAL_TRACE_IMAGE.payload.dimensions,
            VISUAL_TRACE_IMAGE.payload.canvasVisibility
        ]);
    });

    describe('invokeSpeakHandler', () => {
        it('function handler', () => {
            const result = invokeSpeakHandler(SPEAK_TRACE, speakHandlerFunc);

            expect(result).to.eql([
                SPEAK_TRACE.payload.message,
                SPEAK_TRACE.payload.src,
                SPEAK_TRACE.payload.type
            ]);
        });

        it('invokes tts handler', () => {
            const handler: SpeakTraceHandlerMap = {
                handleSpeech: speakHandlerMap.handleSpeech
            }

            const result = invokeSpeakHandler(SPEAK_TRACE, handler);

            expect(result).to.eql([
                SPEAK_TRACE.payload.message,
                SPEAK_TRACE.payload.src
            ]);
        });

        it('invokes audio handler', () => {
            const handler: SpeakTraceHandler = {
                handleAudio: speakHandlerMap.handleAudio
            }

            const result = invokeSpeakHandler(SPEAK_TRACE_AUDIO, handler);

            expect(result).to.eql([
                SPEAK_TRACE_AUDIO.payload.message,
                SPEAK_TRACE_AUDIO.payload.src
            ]);
        });

        it('unimplemented speak handler', () => {
            const callback = () => invokeSpeakHandler(SPEAK_TRACE, {});
            expect(callback).to.throw("VFError: missing handler for SpeakTrace's speak subtype");
        });

        it('unimplemented audio handler', () => {
            const callback = () => invokeSpeakHandler(SPEAK_TRACE_AUDIO, {});
            expect(callback).to.throw("VFError: missing handler for SpeakTrace's audio subtype");
        });

        it('unknown speak subtype', () => {
            const callback = () => invokeSpeakHandler(FAKE_SPEAK_TRACE as SpeakTrace, speakHandlerMap)
            expect(callback).to.throw("VFError: makeTraceProcessor's returned callback received an unknown SpeakTrace subtype");
        });
    });

    describe('makeTraceProcessor', () => {
        it('makeTraceProcessor', () => {
            const traceProcessor = makeTraceProcessor(TRACE_HANDLER_MAP);
        
            const data = traceProcessor(BLOCK_TRACE);

            expect(data).to.eql(BLOCK_TRACE.payload.blockID);
        });

        it('makeTraceProcessor, unknown trace type', () => {
            const traceProcessor = makeTraceProcessor(TRACE_HANDLER_MAP);
        
            const callback = () => traceProcessor(UNKNOWN_TRACE_TYPE as GeneralTrace);

            expect(callback).to.throw(`VFError: invalid trace type "invalid" was passed into makeTraceProcessor`)
        });

        it('makeTraceProcessor, unimplemented handler', () => {
            const traceProcessor = makeTraceProcessor({});
        
            const callback = () => traceProcessor(SPEAK_TRACE);

            expect(callback).to.throw(`VFError: handler for "${TraceType.SPEAK}" was not implemented`)
        });
    });
});