# Voiceflow Runtime Client

The Voiceflow Runtime Client is an SDK for running Voiceflow apps in JavaScript. 

Developers or designers can build a fully-functioning conversational app on [Voiceflow](https://creator.voiceflow.com), and integrate that app into a JavaScript project using the SDK. This allows you to quickly add any kind of voice interface, such as a chatbot, to your project, without the hassle of implementing the conversation flow using code.

The Runtime Client can be used with jQuery, React, and any other JavaScript library or framework. 

[![circleci](https://circleci.com/gh/voiceflow/runtime-client-js/tree/master.svg?style=shield&circle-token=a4447ba98e39b43cc47fd6da870ca68ff0ca5db0)](https://circleci.com/gh/voiceflow/runtime-client-js/tree/master)
[![codecov](https://codecov.io/gh/voiceflow/runtime-client-js/branch/master/graph/badge.svg?token=RYypRxePDX)](https://codecov.io/gh/voiceflow/runtime-client-js)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=voiceflow_runtime-client-js&metric=alert_status&token=088b80f6baf3c958b609f31f64b65289bd4586dc)](https://sonarcloud.io/dashboard?id=voiceflow_runtime-client-js)



## Demos

- [Web Demo](https://voiceflow-burger.webflow.io/)

<img src="https://user-images.githubusercontent.com/5643574/106966841-17b9ee00-6714-11eb-868a-26751b7d560e.png" alt="demo" style="zoom:50%;" />



## Samples

- Hello World with Node
- [First Kitchen app with Node](https://github.com/voiceflow/rcjs-cli)
- makeTraceProcessor usage
- TTS usage
- Suggestion Chips Usage



## Install

```bash
npm install --save @voiceflow/runtime-client-js
```



## Getting Started

### Building a Voiceflow app

To start adding a voice interface to your JavaScript project, we need to first build that interface. To summarize, there are three steps in building a voice interface.

1. **Building** the project on Voiceflow
2. **Training** the chatbot if necessary
3. **Copying** the version id for our integrations

Open [Voiceflow](https://creator.voiceflow.com) and setup a "General Assistant."  We have detailed tutorials on Voiceflow to help you build your first conversational app. 

![image](https://user-images.githubusercontent.com/32404412/107269001-f1979500-6a16-11eb-8303-10620ad44764.png)

When you are satisfied with your design, make sure to train your assistant. Click the Test button at the top-right corner to open up the Prototyping view.

<img width="552" alt="Image of the Test Button on Voiceflow" src="https://user-images.githubusercontent.com/32404412/107269101-17bd3500-6a17-11eb-86b1-b0a817022aca.png">

In the Prototyping view, the right sidebar will have a Training panel. Click Train Assistant to begin the training process. **NOTE:** If the "Train Assistant" button is greyed out, then your project does not need to be trained, so you can skip this step.

<img width="300" alt="Image of the Test Button on Voiceflow" src="https://user-images.githubusercontent.com/32404412/107269251-5521c280-6a17-11eb-9d82-5a0f62bff14d.png">

After the above is done, you are ready to integrate the app onto your JavaScript project. On your address bar, you should see a URL of this form: `https://creator.voiceflow.com/project/{VERSION_ID}/...`. The `VERSION_ID` is a id identifying your particular project. **Copy** this version id, as we will need it later for the integration

<img width="957" alt="Screen Shot 2021-02-08 at 2 11 09 PM" src="https://user-images.githubusercontent.com/32404412/107269370-813d4380-6a17-11eb-8bb5-d286c5db3664.png">



### Integrating the app

Now that we have built a voice interface and copied its `VERSION_ID`, we can integrate it with our JavaScript project.

To begin, import `@voiceflow/runtime-client-js` and construct a new `RuntimeClient` object using the `VERSION_ID` that you copy-pasted. This object represents our Voiceflow application.

```js
const RuntimeClient = require('@voiceflow/runtime-client-js');

const chatbot = new RuntimeClient({
  versionID: 'XXXXXXXXXXXXXXXXXXXXXXXX' // the VERSION_ID goes here
});
```

To start a conversation **session** with our Voiceflow app, call the `.start()` method as shown below. This method returns a promise that eventually resolves into a `Context` object. 

The `Context` is a snapshot of the conversation at the current stage and contains useful information such as the chatbot's responses, the state of all the variables in the Voiceflow project, and much more!

We can access the responses by calling `context.getResponse()` to return a list of `GeneralTrace` objects. Actually, to be more specific, a list of `SpeakTrace`s is returned, which are small pieces of dialogue that make up the entire bot's response to the user. We can log the entire response to console by iterating over the `traces` and logging the messages in the individual `trace`s.

There are other trace-types besides `SpeakTrace`s that are sub-types of a `GeneralTrace`, but for simplicity, you only need to know about `SpeakTrace`s to get started.

```js
// initalize the conversation, get the starting prompt
chatbot.start().then((context) => {
  // get the chatbot response from the context
  const traces = context.getResponse();
  
  // print out what the bot says back
  traces.forEach(trace => {
    console.log(trace.payload.message);
  });
});
```

The `.start()` method is triggers the first **interaction**. For subsequent interactions, you should invoke the `.sendText()` method and send your user's input to the chatbot to advance the conversation.

Both `.start()` and `.sendText()` are "interaction methods" which return a `Context` object. Just like above, we can access the responses returned by `.sendText()` using `context.getResponse()`

After interacting with the chatbot, we need to call `context.isEnding()` to check if the conversation has ended. When the sesconversationion has ended, any additional calls to interaction methods (except for `.start()`) will throw an exception. 

The only interaction that is valid, after the conversation has ended, is the `.start()` call, which will start the conversation flow from the beginning. 

**NOTE:** Although we did not check `.isEnding()` after our call to `.start()` in the above example, it may be worthwhile to do so, depending on your application. For example, if your voice interface simply runs from start to finish without prompting for user input, then `.isEnding()` will return `true` after `.start()` is called, which makes all subsequent `.sendText()` calls throw an exception.

```js
// call this function from any input source
// e.g. interaction('can I have fries with that');
async function interaction(userInput) {
  // get a context for every user interaction
  const context = await chatbot.sendText(userInput);

  // print out what the bot says back
  context.getResponse().forEach(trace => {
    console.log(trace.payload.message);
  });

  // again check if the conversation has ended
  if (context.isEnding()) {
    cleanup();			 					// perform any cleanup logic
    await chatbot.start();		// call `.start()` to restart the conversation if necessary
  }
}
```

To summarize the above, to integrate a Voiceflow app into your JavaScript project, you should:

1. Construct a `RuntimeClient` object
2. Invoke `.start()` to begin the conversation session.
3. Retrieve the traces with `.getResponse() `and display the responses
4. Check if the conversation `.isEnding()` and perform any necessary logic if `true`.
5. If the conversation is ending, then invoke `.sendText()` and repeat from step 3.



## Advanced Usage

### Statefulness of RuntimeClient

It is useful note that a `RuntimeClient` instance is a **stateful** object and calling its methods will always produces side-effects and change its internal state. 

For example, whenever an interaction method such as `.sendText()` is called, the `RuntimeClient` will send the current local copy of the Voiceflow application state to Voiceflow's General Runtime servers, which will perform calculate any state transitions based on the user's response and then respond with the next state. The `RuntimeClient` will then replace its local state copy with the next state from the HTTP response.

To summarize the side-effects of the basic interaction methods:

1. `.start()` - This methods runs the Voiceflow app from the beginning, until the app requests user input. If the `RuntimeClient` is currently in the middle of executing an app session, then we terminate that session and restart the app. Basically, this method is guaranteed to idempotent (assuming your Voiceflow app is also idempotent).
2. `.sendText(userInput)` - Transitions the Voiceflow app to the next state, based the `userInput` that was given. This method is **not** idempotent.

The side-effects of the advanced interaction methods are:

1. `.sendIntent(...)` - Same side-effects as `.sendText()`
2. `.send(data)` - This method calls one of the above methods based on the input it is given. Therefore, its exact side-effects depends the argument types, e.g, if no argument or `null` is passed, then it behaves like `.start()`



### Context

Interaction methods such as `.start()`, `.sendText()`, and `.send()` all return a `Context` project. The `Context` is a snapshot of the Voiceflow application's state and includes data such as the current variable values.

```js
const context = await chatbot.start();
const context = await chatbot.sendText(userInput);
```

Each time an interaction method is called, a new `Context` object is created to wrap around the next state. When a `RuntimeClient` instance makes a state transition, the `Context`'s wrapped state doesn't change. Hence, you can build a **history** of `Context` objects and implement time-travelling capabilities in your chatbot. 

The `Context` object has a handful of methods to expose its internal data. We will describe a subset of them below, in order of most useful to least useful.



#### `.getResponse()`

The `.getResponse()` method returns the traces which make up the Voiceflow app's entire response. 

We say that this method "returns the traces which make up...the entire response," but this isn't quite accurate. In fact, `.getResponse()` returns a **view** of the entire list of traces. By default, the `Context` will filter out any trace that isn't a `SpeakTrace`, in order to show a simplified model of the Voiceflow app response to you. 

To see the other trace types in the return value of `.getResponse()`, see the `includeTypes` option in the "Configuration" section. Alternatively, you can view the unfiltered list of all traces using the `.getTrace()` method, which will be discussed later.

```js
const response = context.getResponse();
response.forEach(({ payload }) => {
  console.log(payload.message);
});
```



#### `.isEnding()`

The `.isEnding()` method returns `true` if the application state wrapped by the `Context` is the last state before the app session terminated, and returns `false` otherwise.

This method is mainly used to detect when the current conversation with the Voiceflow General Runtime has ended, and thus, we need to call `.start()` to start a new conversation from the beginning.

```js
do {
  const userInput = await frontend.getUserInput();			// listen for a user response
  const context = await app.sendText(userInput);				// send the response to the Voiceflow app
  frontend.display(context.trace);											// display the response, if any
} while (!context.isEnding())														// check if we're done
terminateApp();																					// perform any cleanup if conversation is over
```



#### `.getChips()`

The `.getChips()` method returns a list of suggestion chips. If you are unfamiliar with this terminology, a **suggestion chip** is simply a suggested response that the user can send to a voice interface. 

You can pass suggestion chips into buttons on your UI, which can be pressed by the user to automatically send the suggested response. An example illustrating this is shown below:

```js
const chips = context.getChips();			
// => [{ name: "I would like a pizza", ... }, { name: "I would like a hamburger", ... }]

const createOnClickSuggestion = (chosenSuggestion) => () => {
  const context = await chatbot.sendText(chosenSuggestion);			// send the suggested response to VF app
}

chips.forEach(({ name }) => {												
  frontend.addButton({
    text: name,
    callback: createOnClickSuggestion(name)
  });
});
```

You can also check out the "Samples" for a working implementation of suggestion chips on the browser.



### Configuration

The `RuntimeClient` comes with additional `dataConfig` options for managing the data returned by `Context.getResponse()`. To summarize, there are four options currently available:

1. `tts` - When set to `true`, any `SpeakTrace`s returned by an interaction will contain an additional`src` property with an `.mp3` string. The string is audio of a voice assistant speaking out the `SpeakTrace`'s `message`. You can play this audio, such as with an `HTMLAudioElement` on a web browser,  to implement voiced chatbots.
2. `ssml` - When set to `true`, the `ssml` property disables the SDK's SSML sanitization and returns the full response with SSML included. This might be useful if you prefer to feed this data into your own TTS system.
3. `includeTypes` - By default, we expose only `SpeakTrace`s, which contain the app's responses. This option accepts a list which specifies the additional trace types you want to receive from the `.getResponse()` method. For more detail on the available trace-types, see the "Advanced Trace Types" section.
4. `traceProcessor` - Accepts a "trace processor" function and automatically calls the function on the `RuntimeClient`'s current traces, whenever an interaction method is invoked.

See the following subsections for more detail on each configuration option.

```js
const app = new RuntimeClient({
    versionID: '60216d2e3c43f738ddcca219',
    dataConfig: {
      	tts: true,
      	ssml: true,
        includeTypes: ['debug', 'stream', 'block']
      	traceProcessor: myTraceProcessor
    }
});
```



#### TTS

```js

```



#### SSML

```js

```



#### includeTypes

```js

```



#### traceProcessor

```js

```



### `makeTraceProcessor`

A typical pattern for handling a Voiceflow app's response is to use a higher-order function (e.g. `map`) to invoke a callback on each trace in `Context.trace`. 

Unfortunately, there are many types of traces, each with their own unique attributes. If we wanted to process the entire list of traces, we would need boilerplate logic, such as `switch` statements, to distinguish between different traces and call the appropriate handler.

The SDK exposes a utility called `makeTraceProcessor` which allows you to quickly define a **trace processor** function, which can be passed as a callback of a higher-order function (see below).

**Arguments:**

- `handlerMap` - `object` -  An object whose keys are `TraceType`s (e.g. speak` for `SpeakTraces), and whose values are handlers for that trace type. Some examples of `TraceType`s and their (simplified) expected handler signatures are listed below. For the full list of available trace types and complete handler signatures, see the API Reference. 
  - `speak`- `(message) => any`  - A `SpeakTrace` handler receives the `message`, which is simply the Voiceflow app's response to any user interaction.
  - `debug - (message) => any` - A `DebugTrace` handler receives a debug `message` that illustrates how the Voiceflow runtime is evaluating the input and executing its control flow.

**Returns:**

- `traceProcessor`  - `(trace: GeneralTrace) => any` - A function that accepts any trace type and returns the return value of that trace type's handler in `handlerMap`

**Example:**

```js
const RuntimeClient = require("@voiceflow/runtime-client-js").default;
const { makeTraceProcessor } = require("@voiceflow/runtime-client-js");

// Defining a trace processor
const i = 0;
const traceProcessor = makeTraceProcessor({
    speak: (message) => {
        console.log(`speakHandler says: ${message}`);
      	return `vf-speak-${++i}`;
    },
});

// Usage
const context = await chatbot.start();

const result1 = context.getResponse().map(traceProcessor);			// usage in an HOF
// e.g. result = ['vf-speak-1', 'vf-speak-2', 'vf-speak-3']
```



### Variables

#### Getters

```js
const name = context.variables.get('name');

const allVariables = context.variables.getAll();
const name = allVariables.name;

const keys = context.variables.getKeys();
```



#### Setters

Because the `RuntimeClient` returns a reference to an internal `Context`, which is wrapping around the Voiceflow app's current state, setting variables in the current context

**WARNING:** Be careful when setting variable setters. It can be difficult to determine where you are in a Voiceflow diagram, so be wary not to set variables at the wrong time. 

```js
context.variables.set('name', 'Jean-Luc Picard')
context.variables.setMany({
  name: 'Jean-Luc Picard',
  age: 52
});
```



#### Enabling Stricter Typing

The `.variables` submodule supports stricter typing, if you provide a variable **schema** to the `RuntimeClient`.  Once you do, the `.variables` methods like `.get()` will be able to intelligently determine the variable type, based on the variable name you pass as an argument.

```ts
export type VFVariablesSchema = {
    age: number;
    name: string;
};

const app = new Runtime<VFVariablesSchema>({
	versionID: 'some-version-id'
});

const context = await app.start();

const name = context.variables.get('name');				// return value is inferred to be a "string"
context.variables.set('name', 12);								// TypeError! 'name' is a "string" not a "number"
```



### Multiple Applications

You can integrate any number of Voiceflow applications to your project, simply by constructing multiple `VFApp` instances. You can even have multiple instances of the same Voiceflow project at once, our runtime servers are stateless, so two running Voiceflow programs will not interfere with each other.

```js
// Multiple integrations
import { App as VFApp } from "@voiceflow/runtime-client-sdk";

const supportBot1 = new VFApp({
  versionID: 'support-bot-1-id',
});

const supportBot2 = new VFApp({
  versionID: 'support-bot-2-id',
});	// has a separate state than supportBot1

const orderBot = new VFApp({
  versionID: 'order-bot'
});
```



### Advanced Trace Types

The `Context.getResponse()` method returns a list of `GeneralTrace`s which are objects containing a part of the overall response from the Voiceflow app. 

These `GeneralTrace`s include `SpeakTrace`s, which contain the "actual" textual response of the Voiceflow app and is intended to be seen by your own app's users. There are other traces such as `DebugTrace`, which contain messages that illustrates the Voiceflow app's control flow and why it produces the response that it did. 

The `DebugTrace`, in particular, might be useful if you want to log an application's state to understand what happened before an error with your Voiceflow app occurred.

```js
const app = new RuntimeClient({
    versionID: '60216d2e3c43f738ddcca219',
    dataConfig: {
        includeTypes: ['debug']
    }
});

const context = await chatbot.start();
context.getResponse().forEach(({ type, payload }) => {
  if (type === "debug") {
    myErrorLogger.log(payload.message);
  }
});
```

There are other trace types, as well. For the complete, definitive list, see the API Reference.



#### Displaying Traces

By default, the `Context.getResponse()` method only returns `SpeakTrace`s for simplicity. However, using the `includeTypes` configuration option in `RuntimeClient`'s constructor, we can enable `.getResponse()` to return other trace types. 

Naturally, we might not want to display something like a `DebugTrace` to our users. If you choose to use the `includeTypes` option, then you'll need to filter out the result of `.getResponse()` for the `SpeakTrace`s to get only the textual responses, as shown below.

```js
const context = await chatbot.sendText("I'd like to order a Pizza please and thank you");
const onlySpeakTraces = context.getResponse().filter(({ type }) => type === 'speak');
frontend.display(onlySpeakTraces);
```



### Runtime

As the name suggests, `runtime-client-js` interfaces with a Voiceflow "runtime" server. You can check out [https://github.com/voiceflow/general-runtime](https://github.com/voiceflow/general-runtime) and host your own runtime server. Modifying the runtime allows for extensive customization of bot behavior and integrations.

By default, the client will use the Voiceflow hosted runtime at `https://general-runtime.voiceflow.com`



## API Reference
