import styled from 'styled-components';
import { IBaseStyledProps } from 'ide-lib-base-component';
import { IComponentTreeProps } from '../index';


interface IStyledProps extends IComponentTreeProps, IBaseStyledProps {}

export const StyledContainer = styled.div.attrs({
  style: (props: IStyledProps) => props.style || {}  // 优先级会高一些，行内样式
})`
`;

export const StyledListWrap = styled.div.attrs({
  style: (props: IStyledProps) => props.style || {}  // 优先级会高一些，行内样式
})`
  display: ${(props: IStyledProps) => (props.visible ? 'inline-block' : 'none')};
  height: ${(props: IStyledProps) => (props.height ? `${props.height}px` : 'auto')};
  overflow-y: ${(props: IStyledProps) => (props.height ? `scroll` : 'visible')};
`;

