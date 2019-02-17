import styled from 'styled-components';
import { IComponentTreeProps } from '../index';

interface IStyledProps extends IComponentTreeProps {
  style?: React.CSSProperties;
  className?: string;
  [prop: string]: any;
}

export const StyledContainer = styled.div.attrs({
  style: (props: IStyledProps) => props.style || {}  // 优先级会高一些，行内样式
})`
`;

