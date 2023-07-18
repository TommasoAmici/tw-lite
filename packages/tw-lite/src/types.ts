import React from "react";

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
  Omit<React.ComponentPropsWithRef<C>, keyof Props>;
