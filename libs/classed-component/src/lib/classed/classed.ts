import clsx, { ClassValue } from 'clsx';
import React, { ElementType, forwardRef } from 'react';
import { ComponentPropsWithoutRef } from 'react';

const getTagDisplayName = (tag: ElementType) => (typeof tag === 'string' ? tag : tag.displayName || tag.name)

export const classed = <Type extends ElementType>(type: Type, ...classNames: ClassValue[]) => {
  // todo: please fix ref type
  const Component = forwardRef<any, ComponentPropsWithoutRef<Type>>((props, ref) => {
    const className = clsx(classNames, props.className)
    return React.createElement(type, {
      ...props,
      className: className || undefined,
      ref,
    });
  });

  Component.displayName = `Classed.${getTagDisplayName(type)}`

  return Component;
};

export default classed;
