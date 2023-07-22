/// <reference lib="dom" />

import React from "react";
import type { PolymorphicComponentProps, WithAs } from "./types";

type InterpolatedFunctionReturn = string | undefined | null | false;
type TemplateStringsArgs<Props extends {} = {}> = (
  | string
  | ((props: Props) => InterpolatedFunctionReturn)
)[];

/**
 * Returns a React component that renders the given HTML tag name or React
 * component with the given className.
 */
function componentFactory<
  OuterAs extends React.ElementType,
  Props extends {} = {}
>(
  as: OuterAs,
  strings: TemplateStringsArray,
  args: TemplateStringsArgs<Props>
) {
  // if the `as` prop is set and it is an HTML tag we can use the ref prop
  function Component<InnerAs extends keyof HTMLElementTagNameMap>(
    props: PolymorphicComponentProps<InnerAs, Props> & { as: InnerAs },
    ref?: React.ForwardedRef<HTMLElementTagNameMap[InnerAs]>
  ): React.ReactElement;
  // if the `as` prop is set and it is not an HTML tag we cannot use the ref prop
  function Component<InnerAs extends React.ElementType>(
    props: PolymorphicComponentProps<InnerAs, Props> & { as: InnerAs },
    ref?: undefined
  ): React.ReactElement;
  // if the `as` prop is not set we can use the ref prop only if OuterAs
  // is an HTML tag
  function Component(
    props: PolymorphicComponentProps<OuterAs, Props> & { as?: undefined },
    ref?: OuterAs extends keyof HTMLElementTagNameMap
      ? React.ForwardedRef<HTMLElementTagNameMap[OuterAs]>
      : undefined
  ): React.ReactElement;
  function Component(
    props: PolymorphicComponentProps<React.ElementType, Props> & WithAs,
    ref?: React.Ref<HTMLElement>
  ) {
    const Tag = props.as ?? as;

    const classNames: string[] = [];
    // using a for-of loop with strings.entries() might be more readable
    // and modern, but it's also much slower
    for (let index = 0; index < strings.length; index++) {
      const str = strings[index].trim();
      if (str !== "") {
        classNames.push(str.trim());
      }

      const arg = args[index];
      if (!arg) {
        continue;
      }

      if (typeof arg === "string") {
        classNames.push(arg);
      } else {
        const _className = arg(props);
        if (_className) {
          classNames.push(_className);
        }
      }
    }

    // filter transient props
    const { as: _, className, ...filteredProps } = { ...props };

    // remove transient props from HTML tags, but not from React components
    if (typeof Tag === "string") {
      for (const key in filteredProps) {
        if (key[0] === "$") {
          // @ts-expect-error
          delete filteredProps[key];
        }
      }
    }

    return (
      <Tag
        {...filteredProps}
        ref={ref}
        className={[...classNames, className].join(" ").trim()}
      />
    );
  }

  // @ts-expect-error this type cast is necessary to make the `as` prop work
  // with React.forwardRef, I don't know of a better way, although I'm sure
  // there is one
  // @see https://stackoverflow.com/a/58473012/5008494
  return React.forwardRef(Component) as typeof Component;
}

export function tw<As extends React.ElementType>(
  /**
   * Either a string representing an HTML tag name or a React component
   * @example "div"
   * @example Button
   */
  as: As
) {
  return function <Props extends {} = {}>(
    strings: TemplateStringsArray,
    ...args: TemplateStringsArgs<Props>
  ) {
    return componentFactory<As, Props>(as, strings, args);
  };
}
