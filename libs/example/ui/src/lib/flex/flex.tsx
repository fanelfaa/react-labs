import { classed } from '@fielabs/classed-component';
import { CSSProperties, ComponentProps } from 'react';

const ClassedFlex = classed('div', 'flex');

export interface FlexProps extends ComponentProps<typeof ClassedFlex> {
  align?: CSSProperties['alignItems'];
  justify?: CSSProperties['justifyContent'];
  gap?: CSSProperties['gap'];
  rowGap?: CSSProperties['rowGap'];
  columnGap?: CSSProperties['columnGap'];
}

export const Flex = ({
  align,
  justify,
  gap,
  rowGap,
  columnGap,
  style,
  ...props
}: FlexProps) => {
  return (
    <ClassedFlex
      style={{
        ...style,
        alignItems: align,
        justifyContent: justify,
        gap,
        rowGap,
        columnGap,
      }}
      {...props}
    />
  );
};

export default Flex;
