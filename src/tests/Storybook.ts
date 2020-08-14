import * as _ from "lodash";

export type Story = () => JSX.Element;

export function storyFor(
  category: string,
  name: string,
  component: unknown,
  decorators?: unknown
): { title: string; component: unknown; decorators?: unknown } {
  const result = {
    title: category + "/" + name,
    component: component
  };

  enableLogging();

  if (decorators) _.assign(result, { decorators: decorators });

  return result;
}

export function storyForComponent(
  name: string,
  component: unknown,
  decorators?: unknown
): ReturnType<typeof storyFor> {
  return storyFor("Components", name, component, decorators);
}

export function storyForView(
  name: string,
  component: unknown
): ReturnType<typeof storyFor> {
  return storyFor("Views", name, component);
}

export function storyForPage(
  name: string,
  component: unknown
): ReturnType<typeof storyFor> {
  return storyFor("Pages", name, component);
}

function enableLogging() {
  // Enable logging in storybook development mode
  if (process.env.NODE_ENV !== "production") {
    localStorage.setItem("debug", "transcribe:*");
  }
}
