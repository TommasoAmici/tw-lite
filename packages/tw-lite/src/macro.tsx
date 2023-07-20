import type {
  PolymorphicComponentProps,
  WithAs,
  WithChildren,
  WithClassName,
} from "./types";

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
  function Component<InnerAs extends React.ElementType>(
    props: PolymorphicComponentProps<InnerAs, Props> & { as: InnerAs }
  ): React.ReactElement;
  function Component(
    props: PolymorphicComponentProps<OuterAs, Props> & { as?: undefined }
  ): React.ReactElement;
  function Component(
    props: PolymorphicComponentProps<React.ElementType, Props> & WithAs
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
        className={[...classNames, className].join(" ").trim()}
      />
    );
  }

  return Component;
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
