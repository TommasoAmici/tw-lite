export type WithChildren = {
  children?: React.ReactNode;
};

export type WithClassName = {
  className?: string;
};

export type WithAs = {
  as?: React.ElementType;
};

export type PolymorphicComponentProps<
  C extends React.ElementType,
  Props extends {} = {}
> = Props &
  WithChildren &
  WithClassName &
  // take all props of C and remove the props that are in Props
  // this is to override the props of C with the props of Props
  // if they have the same name
  Omit<React.ComponentPropsWithRef<C>, keyof Props>;
