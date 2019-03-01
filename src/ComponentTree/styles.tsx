import styled from 'styled-components';
import { IBaseStyledProps } from 'ide-lib-base-component';
// import { Modal } from 'antd';
import { IComponentTreeProps } from '../index';


interface IStyledProps extends IComponentTreeProps, IBaseStyledProps {}

export const StyledContainer = styled.div.attrs({
  style: (props: IStyledProps) => props.style || {}  // 优先级会高一些，行内样式
})`
`;

export const StyledListWrap = styled.div.attrs({
  style: (props: IStyledProps) => props.style || {}  // 优先级会高一些，行内样式
})`
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


export const StyledModalLayer = styled.div.attrs({
  style: (props: IStyledProps) => props.style || {}  // 优先级会高一些，行内样式
})`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 98;
  display: ${(props: IStyledProps) => (props.visible ? 'block' : 'none')};
  height: ${(props: IStyledProps) => (props.height ? `${props.height}px` : 'auto')};
  width: ${(props: IStyledProps) => (props.width ? `${props.width}px` : 'auto')};
  background-color: ${(props: IStyledProps) => (props.color ? `${props.color}` : 'auto')};
`;
