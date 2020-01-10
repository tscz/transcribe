import { configure } from "@storybook/react";

configure(require.context('../src', true, /\.stories\.tsx$/), module);

// Enable logging in storybook development mode
if (process.env.NODE_ENV !== "production") {
  localStorage.setItem("debug", "transcribe:*");
}