import { RequestType, TraceType } from '@voiceflow/general-types';
import { SpeakType } from '@voiceflow/general-types/build/nodes/speak';
import { State } from '@voiceflow/runtime';
import _ from 'lodash';

import { RequestContext, ResponseContext } from '@/lib/types';

import { BLOCK_TRACE, CHOICE_TRACE, CHOICE_TRACE_WITH_NO_CHOICES, DEBUG_TRACE, END_TRACE, FLOW_TRACE, SPEAK_TRACE, STREAM_TRACE } from '../fixtures';

export { CHOICE_TRACE } from '../fixtures';

export const VERSION_ID = 'dummy-version-id';

export const VF_APP_INITIAL_STATE: State = {
  stack: [
    {
      programID: 'some-program-id',
      storage: {},
      variables: {},
    },
  ],
  storage: {},
  variables: {
    age: 0,
    name: 0,
    gender: 0,
  },
};

export const START_REQUEST_BODY: RequestContext = {
  state: VF_APP_INITIAL_STATE,
  request: null,
  config: {
    tts: false,
  },
};

export const VF_APP_NEXT_STATE_1: State = {
  stack: [
    {
      programID: 'some-program-id',
      storage: {
        val1: 12,
      },
      variables: {
        val1: 3,
        val2: 17,
      },
    },
  ],
  storage: {},
  variables: {
    age: 17,
    name: 'Samwise Gamgee',
    gender: 'Male',
  },
};

export const START_RESPONSE_BODY = {
  state: VF_APP_NEXT_STATE_1,
  request: null,
  trace: [SPEAK_TRACE, BLOCK_TRACE, FLOW_TRACE, STREAM_TRACE, DEBUG_TRACE, CHOICE_TRACE],
};

export const START_RESPONSE_BODY_WITH_NO_CHOICES = {
  ...START_RESPONSE_BODY,
  trace: [..._.initial(START_RESPONSE_BODY.trace), CHOICE_TRACE_WITH_NO_CHOICES],
};

export const USER_RESPONSE = 'This is what the user says in response to the voice assistant';

export const SEND_TEXT_REQUEST_BODY: RequestContext = {
  state: VF_APP_NEXT_STATE_1,
  request: {
    type: RequestType.TEXT,
    payload: USER_RESPONSE,
  },
  config: {
    tts: false,
  },
};

export const SEND_TEXT_REQUEST_BODY_TTS_ON: RequestContext = {
  state: VF_APP_NEXT_STATE_1,
  request: {
    type: RequestType.TEXT,
    payload: USER_RESPONSE,
  },
  config: {
    tts: true,
  },
};

export const VF_APP_NEXT_STATE_2: State = {
  stack: [
    {
      programID: 'some-program-id',
      storage: {
        val1: 37,
      },
      variables: {
        val1: -20,
        val2: 55,
      },
    },
  ],
  storage: {},
  variables: {
    age: 34,
    name: 'Frodo Baggins',
    gender: 'Male',
  },
};

export const SEND_TEXT_RESPONSE_BODY: ResponseContext = {
  state: VF_APP_NEXT_STATE_2,
  request: null,
  trace: [SPEAK_TRACE, END_TRACE],
};

export const SEND_TEXT_RESPONSE_BODY_WITH_SSML_AND_TTS: ResponseContext = {
  ...SEND_TEXT_RESPONSE_BODY,
  trace: [
    {
      ...SPEAK_TRACE,
      payload: {
        type: SpeakType.MESSAGE,
        message: '<voice>Books ought to have to have good endings.</voice>',
        src: 'data:audio/mpeg;base64,SUQzBAAAAAAA',
      },
    },
    CHOICE_TRACE,
    END_TRACE,
  ],
};

export const CHOICES_1 = [
  { name: 'Do you have small available?' },
  { name: "I'd like to order a large please" },
  { name: "I'd like the small  thank you very much" },
];

export const CHOICES_2 = [
  { name: 'Do you have large available?' },
  { name: 'Is there any options for vegans?' },
  { name: 'Is there any options for halal?' },
];

export const CHOICES_3 = [{ name: 'Do you have handicapped parking?' }];

export const START_RESPONSE_BODY_WITH_MULTIPLE_CHOICES: ResponseContext = {
  state: VF_APP_NEXT_STATE_1,
  request: null,
  trace: [
    FLOW_TRACE,
    {
      type: TraceType.CHOICE,
      payload: {
        choices: CHOICES_1,
      },
    },
    STREAM_TRACE,
    DEBUG_TRACE,
    {
      type: TraceType.CHOICE,
      payload: {
        choices: CHOICES_2,
      },
    },
    SPEAK_TRACE,
    BLOCK_TRACE,
    {
      type: TraceType.CHOICE,
      payload: {
        choices: CHOICES_3,
      },
    },
  ],
};
