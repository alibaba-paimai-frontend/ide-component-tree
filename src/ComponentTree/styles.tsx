import styled from 'styled-components';
import { IBaseStyledProps } from 'ide-lib-base-component';
// import { Modal } from 'antd';
import { IComponentTreeProps } from '../index';


interface IStyledProps extends IComponentTreeProps, IBaseStyledProps { }

export const StyledContainer = styled.div.attrs({
  style: (props: IStyledProps) => props.style || {}  // 优先级会高一些，行内样式
})<IStyledProps>`
`;

export const StyledListWrap = styled.div.attrs({
  style: (props: IStyledProps) => props.style || {}  // 优先级会高一些，行内样式
})<IStyledProps>`
  position: fixed;
  top: 10px;
  left: 200px;
  z-index: 99;
  display: ${(props: IStyledProps) => (props.visible ? 'inline-block' : 'none')};
  height: ${(props: IStyledProps) => (props.height ? `${props.height - 20}px` : 'auto')};
  overflow-y: ${(props: IStyledProps) => (props.height ? `scroll` : 'visible')};
  box-shadow: 0 2px 8px rgba(0,0,0,.2);
  background-color: #fff;
  border-radius: 4px;
  background-clip: padding-box;
`;


