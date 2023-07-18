import { describe, expect, test } from "bun:test";
import { renderToString } from "react-dom/server";
import { tw } from "../macro";

test("tw with HTML tag", () => {
  const Component = tw("button")`text-primary-700`;
  expect(renderToString(<Component>Button</Component>)).toBe(
    renderToString(<button className="text-primary-700">Button</button>)
  );
});

test("tw with HTML tag and attributes", () => {
  const Component = tw("input")`text-primary-700`;
  expect(renderToString(<Component defaultValue="hello" />)).toBe(
    renderToString(<input className="text-primary-700" defaultValue="hello" />)
  );
});

test("tw with `as` prop: HTML tag", () => {
  const Component = tw("button")`text-primary-700`;
  expect(renderToString(<Component>Button</Component>)).toBe(
    renderToString(<button className="text-primary-700">Button</button>)
  );

  expect(renderToString(<Component as="div">Button</Component>)).toBe(
    renderToString(<div className="text-primary-700">Button</div>)
  );
});

test("tw with `as` prop: React component", () => {
  const Component = tw("button")`text-primary-700`;
  expect(renderToString(<Component>Button</Component>)).toBe(
    renderToString(<button className="text-primary-700">Button</button>)
  );

  function MyComponent({
    someProp,
    ...props
  }: React.PropsWithChildren<{ className?: string; someProp: string }>) {
    return <div {...props} data-someprop={someProp} />;
  }

  expect(
    renderToString(
      <Component as={MyComponent} someProp="hello-world">
        Button
      </Component>
    )
  ).toBe(
    renderToString(
      <div className="text-primary-700" data-someprop="hello-world">
        Button
      </div>
    )
  );
});

test("tw with component", () => {
  function MyComponent({ className }: { className?: string }) {
    return <div className={className}>My Component</div>;
  }

  const Component = tw(MyComponent)`text-primary-700`;

  expect(renderToString(<Component />)).toBe(
    renderToString(<div className="text-primary-700">My Component</div>)
  );
});

test("allows adding more classes", () => {
  const Component = tw("button")`text-primary-700`;
  expect(
    renderToString(<Component className="bg-white">Button</Component>)
  ).toBe(
    renderToString(
      <button className="text-primary-700 bg-white">Button</button>
    )
  );
});

test("allows interpolating variables: string variables", () => {
  // objects like this can come from CSS modules or design system
  // libraries, or anything of the sort
  const classes = {
    button: "text-lg",
  };
  const Component = tw("button")`
    text-primary-700
    ${classes.button}
    rounded-sm
  `;

  expect(renderToString(<Component>Button</Component>)).toBe(
    renderToString(
      <button className="text-primary-700 text-lg rounded-sm">Button</button>
    )
  );
});

test("allows interpolating variables: single interpolation transient prop", () => {
  type Props = { $enabled?: boolean };
  const Component = tw("button")<Props>`
    text-primary-700
    ${(props) => (props.$enabled ? "bg-primary-100" : "bg-neutral-400")}
    rounded-sm
  `;

  expect(renderToString(<Component $enabled>Button</Component>)).toBe(
    renderToString(
      <button className="text-primary-700 bg-primary-100 rounded-sm">
        Button
      </button>
    )
  );
  expect(renderToString(<Component>Button</Component>)).toBe(
    renderToString(
      <button className="text-primary-700 bg-neutral-400 rounded-sm">
        Button
      </button>
    )
  );
});

test("allows interpolating variables: multiple interpolations transient props", () => {
  type Props = { $enabled?: boolean; $sticky?: boolean };
  const Component = tw("button")<Props>`
    text-primary-700
    ${(props) => (props.$enabled ? "bg-primary-100" : "bg-neutral-400")}
    rounded-sm
    ${(props) => (props.$sticky ? "sticky" : null)}
  `;

  expect(
    renderToString(
      <Component $enabled $sticky>
        Button
      </Component>
    )
  ).toBe(
    renderToString(
      <button className="text-primary-700 bg-primary-100 rounded-sm sticky">
        Button
      </button>
    )
  );

  expect(renderToString(<Component $enabled>Button</Component>)).toBe(
    renderToString(
      <button className="text-primary-700 bg-primary-100 rounded-sm">
        Button
      </button>
    )
  );
});

test("allows interpolating variables: destructuring transient prop", () => {
  type Props = { $enabled?: boolean };
  const Component = tw("button")<Props>`
    text-primary-700
    ${({ $enabled }) => ($enabled ? "bg-primary-100" : "bg-neutral-400")}
    rounded-sm
  `;

  expect(renderToString(<Component $enabled>Button</Component>)).toBe(
    renderToString(
      <button className="text-primary-700 bg-primary-100 rounded-sm">
        Button
      </button>
    )
  );
});

test("ignores false in interpolated values", () => {
  type Props = { $enabled?: boolean };
  const Component = tw("button")<Props>`
    text-primary-700
    ${(props) => props.$enabled && "bg-primary-100"}
  `;

  expect(renderToString(<Component $enabled>Button</Component>)).toBe(
    renderToString(
      <button className="text-primary-700 bg-primary-100">Button</button>
    )
  );
});

test("ignores null in interpolated values", () => {
  type Props = { $enabled?: boolean };
  const Component = tw("button")<Props>`
    text-primary-700
    ${(props) => (props.$enabled ? null : "bg-neutral-400")}
  `;

  expect(renderToString(<Component $enabled>Button</Component>)).toBe(
    renderToString(<button className="text-primary-700">Button</button>)
  );
});

test("ignores undefined in interpolated values", () => {
  type Props = { $enabled?: boolean };
  const Component = tw("button")<Props>`
    text-primary-700
    ${(props) => (props.$enabled ? undefined : "bg-neutral-400")}
  `;

  expect(renderToString(<Component $enabled>Button</Component>)).toBe(
    renderToString(<button className="text-primary-700">Button</button>)
  );
});

test("transient props are passed to React components", () => {
  type Props = { $enabled?: boolean };
  const ChildComponent = tw("button")<Props>`
    ${(props) => (props.$enabled ? "bg-primary-100" : "bg-neutral-400")}
  `;
  const ParentComponent = tw(ChildComponent)<Props>`
    ${(props) => (props.$enabled ? "text-primary-700" : "text-neutral-700")}
  `;

  expect(
    renderToString(<ParentComponent $enabled>Button</ParentComponent>)
  ).toBe(
    renderToString(
      <button className="bg-primary-100 text-primary-700">Button</button>
    )
  );
});

test("deeply nested", () => {
  type Props = { $enabled?: boolean };
  const ChildComponent = tw("button")<Props>`
    ${(props) => (props.$enabled ? "bg-primary-100" : "bg-neutral-400")}
  `;
  const ParentComponent = tw(ChildComponent)<Props>`
    ${(props) => (props.$enabled ? "text-primary-700" : "text-neutral-700")}
  `;
  const GrandParentComponent = tw(ParentComponent)<Props>`
    ${(props) => (props.$enabled ? "absolute" : "relative")}
  `;
  const GreatGrandParentComponent = tw(GrandParentComponent)<Props>`
    ${(props) => (props.$enabled ? "flex" : "block")}
  `;

  expect(
    renderToString(
      <GreatGrandParentComponent $enabled>Button</GreatGrandParentComponent>
    )
  ).toBe(
    renderToString(
      <button className="bg-primary-100 text-primary-700 absolute flex">
        Button
      </button>
    )
  );
});

// these are type tests, so there's nothing to run
describe.skip("tw with `as` prop type tests", () => {
  const Component = tw("button")`text-primary-700`;

  test("HTML tags", () => {
    // @ts-expect-error: href is not a valid prop for button
    const invalidHref = <Component href="XXX">Button</Component>;
    // but if we render as an anchor, it's fine
    const validHref = (
      <Component as="a" href="">
        Button
      </Component>
    );
  });

  test("React component props", () => {
    // @ts-expect-error: someProp is not a valid prop for button
    const invalidHref = <Component someProp="XXX">Button</Component>;

    function MyComponent({
      someProp,
      ...props
    }: React.PropsWithChildren<{ className?: string; someProp: string }>) {
      return <div {...props} data-someprop={someProp} />;
    }

    // but if we render as MyComponent, it's fine
    const validHref = (
      <Component as={MyComponent} someProp="hello-world">
        Button
      </Component>
    );
  });
});
