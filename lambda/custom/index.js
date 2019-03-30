/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk');
const Moment = require('moment-timezone');

// Update 2018/9/10 - If you see any module errors such as:
// 
// serviceClientFactory.getUpsServiceClient is not a function
// 
// try deleting the modules in your node_modules folder and run `npm install` again.

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {

    const attributesManager = handlerInput.attributesManager;
    const sessionAttributes = attributesManager.getSessionAttributes();

    const speechText = getWelcomeMessage(sessionAttributes) +
      " " +
      getPrompt(sessionAttributes);

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      // .withAskForPermissionsConsentCard(permissions)
      .getResponse();
  },
};

// const LaunchRequestWithConsentTokenHandler = {
//   canHandle(handlerInput) {
//     return handlerInput.requestEnvelope.request.type === "LaunchRequest" &&
//       handlerInput.requestEnvelope.context.System.user.permissions &&
//       handlerInput.requestEnvelope.context.System.user.permissions.consentToken;
//   },
//   async handle(handlerInput) {

//     const attributesManager = handlerInput.attributesManager;
//     const sessionAttributes = attributesManager.getSessionAttributes();

//     const speechText = getWelcomeMessage(sessionAttributes) +
//       " " +
//       getPrompt(sessionAttributes);

//     return handlerInput.responseBuilder
//       .speak(speechText)
//       .reprompt(speechText)
//       .getResponse();
//   }
// };

// // TODO: what is this?
// const SIPGetToKnowIntentHandler = {
//   canHandle(handlerInput) {
//     return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
//       handlerInput.requestEnvelope.request.intent.name === 'GetToKnowIntent' &&
//       handlerInput.requestEnvelope.request.dialogState !== 'COMPLETED';
//   },
//   handle(handlerInput) {

//     let currentIntent = handlerInput.requestEnvelope.request.intent;
//     const {
//       responseBuilder
//     } = handlerInput;
//     const result = disambiguateSlot(getSlotValues(currentIntent.slots));

//     console.log('disambiguateSlot:', JSON.stringify(result));

//     if (result) {
//       responseBuilder
//         .speak(result.prompt)
//         .reprompt(result.prompt)
//         .addElicitSlotDirective(result.slotName, currentIntent);
//     } else {
//       responseBuilder.addDelegateDirective(currentIntent);
//     }

//     console.log('RESPONSE:', JSON.stringify(responseBuilder.getResponse()));
//     return responseBuilder
//       .getResponse();
//   }
// };

// Already have all the slots - handler:
const GetToKnowIntentHandler = {
  canHandle(handlerInput) {

    const attributesManager = handlerInput.attributesManager;
    const sessionAttributes = attributesManager.getSessionAttributes();

    const slots = ["name", "place"];

    console.log('GetToKnowIntent - name:', sessionAttributes.name);
    console.log('GetToKnowIntent - place:', sessionAttributes.place);

    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'GetToKnowIntent' &&
      intentSlotsHaveBeenFilled(handlerInput.requestEnvelope.request.intent, slots) &&
      !intentSlotsNeedDisambiguation(handlerInput.requestEnvelope.request.intent, slots);
  },
  //   handle(handlerInput) {
  //     console.log('GetToKnowIntent:', handlerInput.requestEnvelope.request);

  //     const currentIntent = handlerInput.requestEnvelope.request.intent;

  //     console.log('currentIntent.slots:', JSON.stringify(currentIntent.slots));
  //     speechText = "";

  //     return handlerInput.responseBuilder
  //       .speak()
  //       .reprompt('Which sounds best Domi Maeuntang, Mae Un Tang or Daegu Jorim?')
  //       .addElicitSlotDirective('meal', currentIntent)
  //       .getResponse();
  //   }
  // };
  handle(handlerInput) {
    const currentIntent = handlerInput.requestEnvelope.request.intent;
    const slotValues = getSlotValues(currentIntent.slots);
    let speechText = "It was nice to meet you, " + slotValues.name.synonym +
      ", from " +
      slotValues.place.synonym +
      ". I'd like to visit there one day!";
    return handlerInput.responseBuilder
      .speak(speechText);
  }
};


// const CGetToKnowIntentHandler = {
//   canHandle(handlerInput) {
//     return handlerInput.requestEnvelope.request.type === "IntentRequest" &&
//       handlerInput.requestEnvelope.request.intent.name === "GetToKnowIntent" &&
//       handlerInput.requestEnvelope.request.dialogState === "COMPLETED";
//   },
//   handle(handlerInput) {
//     console.log("COMPLETED GetToKnowIntent");

//     const currentIntent = handlerInput.requestEnvelope.request.intent;
//     const slotValues = getSlotValues(currentIntent.slots);

//     const attributesManager = handlerInput.attributesManager;
//     const sessionAttributes = attributesManager.getSessionAttributes();

//     sessionAttributes.recommendations.previous = slotValues.meal.synonym;
//     sessionAttributes[currentIntent.name] = undefined;

//     console.log("deleting slot data for:", currentIntent.name);
//     console.log("after delete:", JSON.stringify(sessionAttributes));

//     attributesManager.setSessionAttributes(sessionAttributes);

//     let speechText = "";

//     return handlerInput.responseBuilder
//       .speak(speechText)
//       .reprompt(speechText)
//       .getResponse();
//   },
// };

// const InProgressCaptureAddressIntentHandler = {
//   canHandle(handlerInput) {
//     return handlerInput.requestEnvelope.request.type === "IntentRequest" &&
//       handlerInput.requestEnvelope.request.intent.name === "CaptureAddressIntent" &&
//       handlerInput.requestEnvelope.request.dialogState !== "COMPLETED";
//   },
//   handle(handlerInput) {
//     return handlerInput.responseBuilder
//       .addDelegateDirective()
//       .getResponse();
//   }
// };

// const InProgressHasZipCaptureAddressIntentHandler = {
//   canHandle(handlerInput) {
//     const currentIntent = handlerInput.requestEnvelope.request.intent;
//     return handlerInput.requestEnvelope.request.type === "IntentRequest" &&
//       currentIntent.name === "CaptureAddressIntent" &&
//       intentSlotsHaveBeenFilled(currentIntent, ["zip"]) &&
//       handlerInput.requestEnvelope.request.dialogState !== "COMPLETED";
//   },
//   handle(handlerInput) {
//     const currentIntent = handlerInput.requestEnvelope.request.intent;
//     const slotValues = getSlotValues(currentIntent.slots);
//     let speechText = "There's 2 restaurants close to " + slotValues.zip.synonym;
//     speechText += " Korean Bamboo and One pot. Which would you like?";
//     return handlerInput.responseBuilder
//       .speak(speechText)
//       .reprompt(speechText)
//       .getResponse();
//   }
// };

// const InProgressHasCityStateCaptureAddressIntentHandler = {
//   canHandle(handlerInput) {
//     const currentIntent = handlerInput.requestEnvelope.request.intent;
//     return handlerInput.requestEnvelope.request.type === "IntentRequest" &&
//       currentIntent.name === "CaptureAddressIntent" &&
//       intentSlotsHaveBeenFilled(currentIntent, ["city", "state"]) &&
//       handlerInput.requestEnvelope.request.dialogState !== "COMPLETED";
//   },
//   handle(handlerInput) {
//     const currentIntent = handlerInput.requestEnvelope.request.intent;
//     const slotValues = getSlotValues(currentIntent.slots);
//     let speechText = "There's 2 restaurants close to " + slotValues.city.synonym +
//       ", " +
//       slotValues.state.synonym +
//       " Korean Bamboo and One pot. Which would you like?";
//     return handlerInput.responseBuilder
//       .speak(speechText)
//       .reprompt(speechText)
//       .getResponse();
//   }
// };

const InProgressGetNameHandler = {
  canHandle(handlerInput) {
    const currentIntent = handlerInput.requestEnvelope.request.intent;
    return handlerInput.requestEnvelope.request.type === "IntentRequest" &&
      currentIntent.name === "getToKnowIntent" &&
      intentSlotsHaveBeenFilled(currentIntent, ["place"]);
    // && handlerInput.requestEnvelope.request.dialogState !== "COMPLETED";
  },
  handle(handlerInput) {
    const currentIntent = handlerInput.requestEnvelope.request.intent;
    const slotValues = getSlotValues(currentIntent.slots);
    let speechText = "" + slotValues.place.synonym + " sounds like an interesting place to live! I've never been. ";
    speechText += "What's your name, by the way?";

    let repromptText = "What's your name?";
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(repromptText)
      .getResponse();
  }
};

const InProgressGetPlaceHandler = {
  canHandle(handlerInput) {
    const currentIntent = handlerInput.requestEnvelope.request.intent;
    return handlerInput.requestEnvelope.request.type === "IntentRequest" &&
      currentIntent.name === "getToKnowIntent" &&
      intentSlotsHaveBeenFilled(currentIntent, ["name"]);
    // && handlerInput.requestEnvelope.request.dialogState !== "COMPLETED";
  },
  handle(handlerInput) {
    const currentIntent = handlerInput.requestEnvelope.request.intent;
    const slotValues = getSlotValues(currentIntent.slots);
    let speechText = "Nice to meet you, " + slotValues.name.synonym + "! ";
    speechText += "Where are you from?";

    let repromptText = "Where are you from?";
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(repromptText)
      .getResponse();
  }
};


// const HelpIntentHandler = {
//   canHandle(handlerInput) {
//     return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
//       handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
//   },
//   handle(handlerInput) {
//     const speechText = 'TODO';

//     return handlerInput.responseBuilder
//       .speak(speechText)
//       .reprompt(speechText)
//       .getResponse();
//   },
// };

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent' ||
        handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speechText = 'Goodbye!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);
    console.log(error.stack);

    return handlerInput.responseBuilder
      .speak('Sorry, I can\'t understand the command. Please say it again.')
      .reprompt('Sorry, I can\'t understand the command. Please say it again.')
      .getResponse();
  },
};

/* RESPONSE INTERCEPTORS */

// This interceptor loads our profile from persistent storage into the session
// attributes.
const NewSessionRequestInterceptor = {
  async process(handlerInput) {
    console.log('request:', JSON.stringify(handlerInput.requestEnvelope.request));

    if (handlerInput.requestEnvelope.session.new) {
      const attributesManager = handlerInput.attributesManager;
      let sessionAttributes = attributesManager.getSessionAttributes();

      const persistentAttributes = await attributesManager.getPersistentAttributes();

      console.log('persistentAttributes:', JSON.stringify(persistentAttributes));

      if (!persistentAttributes.profile) {
        console.log('Initializing new profile...');
        sessionAttributes.isNew = true;
        sessionAttributes.profile = initializeProfile();
      } else {
        console.log('Restoring profile from persistent store.');
        sessionAttributes.isNew = false;
        sessionAttributes = persistentAttributes;
      }

      console.log("set sessionAttributes to:", JSON.stringify(sessionAttributes));
      attributesManager.setSessionAttributes(sessionAttributes);
    }
  }
};

// const SetTimeOfDayInterceptor = {
//   // async process(handlerInput) {

//   //   const {
//   //     requestEnvelope,
//   //     serviceClientFactory,
//   //     attributesManager
//   //   } = handlerInput;
//   //   const sessionAttributes = attributesManager.getSessionAttributes();

//     // // look up the time of day if we don't know it already.
//     // if (!sessionAttributes.timeOfDay) {
//     //   const deviceId = requestEnvelope.context.System.device.deviceId;

//     //   const upsServiceClient = serviceClientFactory.getUpsServiceClient();
//     //   const timezone = await upsServiceClient.getSystemTimeZone(deviceId);

//     //   const currentTime = getCurrentTime(timezone);
//     //   const timeOfDay = getTimeOfDay(currentTime);

//     //   sessionAttributes.timeOfDay = timeOfDay;
//     //   sessionAttributes.profile.location.timezone = timezone;
//     //   attributesManager.setSessionAttributes(sessionAttributes);

//     //   console.log("SetTimeOfDayInterceptor - currentTime:", currentTime);
//     //   console.log("SetTimeOfDayInterceptor - timezone:", timezone);
//     //   console.log('SetTimeOfDayInterceptor - time of day:', timeOfDay);
//     //   console.log('SetTimeOfDayInterceptor - sessionAttributes', JSON.stringify(sessionAttributes));
//     // }
//   }
// };

// const HasConsentTokenRequestInterceptor = {
//   async process(handlerInput) {
//     const {
//       requestEnvelope,
//       serviceClientFactory,
//       attributesManager
//     } = handlerInput;
//     const sessionAttributes = attributesManager.getSessionAttributes();

//     // if (handlerInput.requestEnvelope.context.System.user.permissions &&
//     //   handlerInput.requestEnvelope.context.System.user.permissions.consentToken &&
//     //   (!sessionAttributes.profile.location.address.city ||
//     //     !sessionAttributes.profile.location.address.state ||
//     //     !sessionAttributes.profile.location.address.zip)) {

//     //   const {
//     //     deviceId
//     //   } = requestEnvelope.context.System.device;
//     //   const deviceAddressServiceClient = serviceClientFactory.getDeviceAddressServiceClient();
//     //   const address = await deviceAddressServiceClient.getFullAddress(deviceId);

//     //   console.log(JSON.stringify(address));

//     //   if (address.postalCode) {
//     //     sessionAttributes.profile.location.address.zip = address.postalCode;
//     //   } else if (address.city && address.stateOrRegion) {
//     //     sessionAttributes.profile.location.address.city = address.city;
//     //     sessionAttributes.profile.location.address.state = address.stateOrRegion;
//     //   }

//     //   attributesManager.setSessionAttributes(sessionAttributes);
//     //   console.log('HasConsentTokenRequestInterceptor - sessionAttributes', JSON.stringify(sessionAttributes));
//     // }
//   }
// };

// This interceptor initializes our slots with the values from the user profile.
const GetToKnowIntentStartedRequestInterceptor = {
  process(handlerInput) {
    if (handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'GetToKnowIntent' &&
      handlerInput.requestEnvelope.request.dialogState === "STARTED") {
      console.log("GetToKnowIntentStartedRequestInterceptor:", "Initialize the session attributes for the intent.");

      const attributesManager = handlerInput.attributesManager;
      const sessionAttributes = attributesManager.getSessionAttributes();
      const profile = sessionAttributes.profile;

      // handlerInput is passed by reference so any modification we make in 
      // our interceptor will be present in our intent handler's canHandle and
      // handle function
      const updatedIntent = handlerInput.requestEnvelope.request.intent;

      updatedIntent.slots.name.value = profile.name || undefined;
      updatedIntent.slots.diet.value = profile.place || undefined;

      updatedIntent.slots.timeOfDay.value = sessionAttributes.timeOfDay || undefined;

      console.log(JSON.stringify(updatedIntent));
    }
  }
};

// This interceptor looks at the slots belonging to the request.
// If allergies or diet have been provided, it will store them in the user 
// profile stored in the session attributes. When the skill closes, this 
// information will be saved.
const GetToKnowIntentCaptureSlotToProfileInterceptor = {
  process(handlerInput) {
    const intentName = "GetToKnowIntent";
    const slots = ["name", "place"];
    console.log('GetToKnowIntentCaptureSlotToProfileInterceptor');
    saveNewlyFilledSlotsToSessionAttributes(handlerInput, intentName, slots, (sessionAttributes, slotName, newlyFilledSlot) => {
      sessionAttributes.profile[slotName] = newlyFilledSlot.synonym;
    });
  }
};

/* HELPER */

// given an intent name and a set of slots, saveNewlyFilledSlotsToSessionAttributes 
// will save newly filled values of the given slots into the session attributes.
// The callback allows you to set the slot value into session attributes however
// you want.
function saveNewlyFilledSlotsToSessionAttributes(handlerInput, intentName, slots, callback) {
  const attributesManager = handlerInput.attributesManager;
  const sessionAttributes = attributesManager.getSessionAttributes();
  const currentIntent = handlerInput.requestEnvelope.request.intent;

  if (handlerInput.requestEnvelope.request.type === "IntentRequest" &&
    currentIntent.name === intentName) {

    const previousIntent = sessionAttributes[currentIntent.name];
    console.log('CALL intentHasNewlyFilledSlots IN saveNewlyFilledSlotsToSessionAttributes ');
    const newlyFilledSlots = intentHasNewlyFilledSlots(previousIntent, currentIntent, slots);
    console.log('saveNewlyFilledSlotsToSessionAttributes');

    // We only save if the slot(s) has been filled with something new.
    if (newlyFilledSlots.found) {
      for (let slotName in newlyFilledSlots.slots) {
        console.log('inserting:',
          slotName, JSON.stringify(newlyFilledSlots.slots[slotName]),
          JSON.stringify(sessionAttributes));
        callback(sessionAttributes, slotName, newlyFilledSlots.slots[slotName]);
      }
      attributesManager.setSessionAttributes(sessionAttributes);
    }
  }
}

// This interceptor handles intent switching during dialog management by
// syncing the previously collected slots stored in the session attributes
// with the current intent. The slots currently collected take precedence so
// the user is able to overidde previously collected slots.
const DialogManagementStateInterceptor = {
  process(handlerInput) {
    const currentIntent = handlerInput.requestEnvelope.request.intent;

    if (handlerInput.requestEnvelope.request.type === "IntentRequest" &&
      handlerInput.requestEnvelope.request.dialogState !== "COMPLETED") {

      const attributesManager = handlerInput.attributesManager;
      const sessionAttributes = attributesManager.getSessionAttributes();

      // If there are no session attributes we've never entered dialog management
      // for this intent before.
      if (sessionAttributes[currentIntent.name]) {
        let currentIntentSlots = sessionAttributes[currentIntent.name].slots;
        for (let key in currentIntentSlots) {

          // we let the current intent's values override the session attributes
          // that way the user can override previously given values.
          // this includes anything we have previously stored in their profile.
          if (currentIntentSlots[key].value && !currentIntent.slots[key].value) {
            currentIntent.slots[key] = currentIntentSlots[key];
          }
        }
      }

      sessionAttributes[currentIntent.name] = currentIntent;
      attributesManager.setSessionAttributes(sessionAttributes);
    }
  }
};

/* Response INTERCEPTORS */

// This Response interceptor detects if the skill is going to exit and saves the
// session attributes into the persistent store.
const SessionWillEndInterceptor = {
  async process(handlerInput, responseOutput) {

    // let shouldEndSession = responseOutput.shouldEndSession;
    // shouldEndSession = (typeof shouldEndSession == "undefined" ? true : shouldEndSession);
    const requestType = handlerInput.requestEnvelope.request.type;

    const ses = (typeof responseOutput.shouldEndSession == "undefined" ? true : responseOutput.shouldEndSession);

    console.log('responseOutput:', JSON.stringify(responseOutput));

    if (ses && !responseOutput.directives || requestType === 'SessionEndedRequest') {

      // if(shouldEndSession || requestType == 'SessionEndedRequest') {
      console.log('SessionWillEndInterceptor', 'end!');
      const attributesManager = handlerInput.attributesManager;
      const sessionAttributes = attributesManager.getSessionAttributes();
      const persistentAttributes = await attributesManager.getPersistentAttributes();

      persistentAttributes.profile = sessionAttributes.profile;

      console.log(JSON.stringify(sessionAttributes));

      attributesManager.setPersistentAttributes(persistentAttributes);
      attributesManager.savePersistentAttributes(persistentAttributes);
    }
  }
};

/* CONSTANTS */

// const permissions = ['read::alexa:device:all:address'];

const requiredSlots = {
  name: true,
  place: true
};

/* HELPER FUNCTIONS */

function initializeProfile() {
  return {
    name: "",
    place: ""
  }
}

// gets the welcome message based upon the context of the skill.
function getWelcomeMessage(sessionAttributes) {

  let speechText = "";

  if (sessionAttributes.isNew) {
    speechText += "<say-as interpret-as=\"interjection\">Hello there!</say-as> ";
  } else {
    speechText += "Welcome back, " + sessionAttributes.profile.name + "! ";
    speechText += "Good to talk to you again. ";
  }
  return speechText;
}

function randomPhrase(phraseList) {
  let i = Math.floor(Math.random() * phraseList.length);
  return (phraseList[i]);
}

// gets the prompt based upon the context of the skill.
function getPrompt(sessionAttributes) {

  let speechText = "I don't think we've met before. What's your name? ";
  if (!sessionAttributes.isNew) {
    speechText = " ";
  }

  return speechText;
}

// given the slots object from the JSON Request to the skill, builds a simplified
// object which simplifies inpecting slots for entity resultion matches.
function getSlotValues(slots) {

  const slotValues = {};

  for (let key in slots) {

    if (slots.hasOwnProperty(key)) {

      slotValues[key] = {
        synonym: slots[key].value || null,
        resolvedValues: (slots[key].value ? [slots[key].value] : []),
        statusCode: null,
      };

      let statusCode = (((((slots[key] || {})
              .resolutions || {})
            .resolutionsPerAuthority || [])[0] || {})
          .status || {})
        .code;

      let authority = ((((slots[key] || {})
            .resolutions || {})
          .resolutionsPerAuthority || [])[0] || {})
        .authority;

      slotValues[key].authority = authority;

      // any value other than undefined then entity resolution was successful
      if (statusCode) {
        slotValues[key].statusCode = statusCode;

        // we have resolved value(s)!
        if (slots[key].resolutions.resolutionsPerAuthority[0].values) {
          let resolvedValues = slots[key].resolutions.resolutionsPerAuthority[0].values;
          slotValues[key].resolvedValues = [];
          for (let i = 0; i < resolvedValues.length; i++) {
            slotValues[key].resolvedValues.push({
              value: resolvedValues[i].value.name,
              id: resolvedValues[i].value.id
            });
          }
        }
      }
    }
  }
  return slotValues;
}

function getNewSlots(previous, current) {
  const previousSlotValues = getSlotValues(previous);
  const currentSlotValues = getSlotValues(current);

  let newlyCollectedSlots = {};
  for (let slotName in previousSlotValues) {
    // resolvedValues and statusCode are dependent on our synonym so we only
    // need to check if there's a difference of synonyms.
    if (previousSlotValues[slotName].synonym !== currentSlotValues[slotName].synonym) {
      newlyCollectedSlots[slotName] = currentSlotValues[slotName];
    }
  }
  return newlyCollectedSlots;
}

// intentHasNewlyFilledSlots given a previous and current intent and a set of 
// slots, this function will compare the previous intent's slots with current 
// intent's slots to determine what's new. The results are filtered by the 
// provided array of "slots". For example if you wanted to determine if there's
// a new value for the "state" and "city" slot you would pass the previous and
// current intent and an array containing both strings. If previous is undefined,
// all filled slots are treated as newly filled. 
// Returns: 
// {
//   found: (true | false)
//   slots: object of slots returned from getSlots
// }
function intentHasNewlyFilledSlots(previous, intent, slots) {

  let newSlots;
  // if we don't have a previous intent then all non-empty intent's slots are 
  // newly filled!
  if (!previous) {
    const slotValues = getSlotValues(intent.slots);
    newSlots = {};
    for (let slotName in slotValues) {
      if (slotValues[slotName].synonym) {
        newSlots[slotName] = slotValues[slotName];
      }
    }
  } else {
    newSlots = getNewSlots(previous.slots, intent.slots);
  }

  const results = {
    found: false,
    slots: {}
  };

  slots.forEach(slot => {
    if (newSlots[slot]) {
      results.slots[slot] = newSlots[slot];
      results.found = true;
    }
  });
  return results;
}

function buildDisambiguationPrompt(resolvedValues) {
  let output = "Which would you like";
  resolvedValues.forEach((resolvedValue, index) => {
    output += `${(index === resolvedValues.length - 1) ? ' or ' : ' '}${resolvedValue.value}`;
  });
  output += "?";
  return output;
}

// function disambiguateSlot(slots) {
//   let result;
//   for (let slotName in slots) {
//     if (slots[slotName].resolvedValues.length > 1 && requiredSlots[slotName]) {
//       console.log('disambiguate:', slots[slotName]);
//       result = {
//         slotName: slotName,
//         prompt: buildDisambiguationPrompt(slots[slotName].resolvedValues)
//       };
//       break;
//     }
//   }
//   return result;
// }

// // given an intent and an array slots, intentSlotsHaveBeenFilled will determine
// // if all of the slots in the array have been filled.
// // Returns:
// // (true | false)
// function intentSlotsHaveBeenFilled(intent, slots) {
//   const slotValues = getSlotValues(intent.slots);
//   console.log('slot values:', JSON.stringify(slotValues));
//   let result = true;
//   slots.forEach(slot => {
//     console.log('intentSlotsHaveBeenFilled:', slot);
//     if (!slotValues[slot].synonym) {
//       result = false;
//     }
//   });

//   return result;
// }

// function intentSlotsNeedDisambiguation(intent, slots) {
//   const slotValues = getSlotValues(intent.slots);
//   let result = false;
//   slots.forEach(slot => {
//     console.log(slotValues[slot].resolvedValues.length);
//     if (slotValues[slot].resolvedValues.length > 1) {
//       result = true;
//     }
//   });
//   console.log("intentSlotsNeedDisambiguation", result);
//   return result;
// }

// function getCurrentTime(location) {

//   const currentTime = Moment.utc().tz(location);
//   return currentTime;
// }

// function getTimeOfDay(currentTime) {
//   const currentHour = currentTime.hours();
//   const currentMinutes = currentTime.minutes();

//   const weightedHour = (currentMinutes >= 45) ? currentHour + 1 : currentHour;

//   let timeOfDay = "midnight";
//   if (weightedHour >= 6 && weightedHour <= 10) {
//     timeOfDay = "breakfast";
//   } else if (weightedHour == 11) {
//     timeOfDay = "brunch";
//   } else if (weightedHour >= 12 && weightedHour <= 16) {
//     timeOfDay = "lunch";
//   } else if (weightedHour >= 17 && weightedHour <= 23) {
//     timeOfDay = "dinner";
//   }
//   return timeOfDay;
// }

const skillBuilder = Alexa.SkillBuilders.standard();

exports.handler = skillBuilder
  .addRequestHandlers(
    // todo: LaunchRequestWithConsentTokenHandler,
    LaunchRequestHandler,
    GetToKnowIntentHandler,
    // promptForDeliveryOption,
    // SIPGetToKnowIntentHandler,
    // CGetToKnowIntentHandler,
    // LookupRestaurantIntentHandler,
    // GetMealIntentHandler,
    InProgressGetNameHandler,
    InProgressGetPlaceHandler,
    // HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .addRequestInterceptors(
    NewSessionRequestInterceptor,
    // todo: SetTimeOfDayInterceptor,
    // HasConsentTokenRequestInterceptor,
    GetToKnowIntentStartedRequestInterceptor,
    GetToKnowIntentCaptureSlotToProfileInterceptor,
    DialogManagementStateInterceptor
  )
  .addResponseInterceptors(SessionWillEndInterceptor)
  .addErrorHandlers(ErrorHandler)
  //.withPersistenceAdapter()
  //.withApiClient(new Alexa.DefaultApiClient())
  .withAutoCreateTable(true)
  .withTableName("friendo")
  .lambda();