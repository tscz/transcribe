// Setup enzyme for shallow testing, see https://create-react-app.dev/docs/running-tests/
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import Enzyme from "enzyme";

Enzyme.configure({ adapter: new Adapter() });

// Ignore Tone.js browser compatibility warnings, see https://github.com/Tonejs/Tone.js/issues/439
global.TONE_SILENCE_LOGGING = true;

// Fail tests on warn messages
global.console.warn = (message) => {
  throw message;
};

// Fail tests on error messages
global.console.error = (message) => {
  throw message;
};
