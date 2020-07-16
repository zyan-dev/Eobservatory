import styled from 'styled-components';
import { Colors } from '../lib/theme';

export const WhiteLText = styled.p`
  font-size: 26px;
  color: white;
  margin: 10px 0px;
  text-align: ${props => props.justify ? props.justify : 'left'};
`
export const WhiteSText = styled.p`
  font-size: 14px;
  color: white;
  text-align: ${props => props.justify ? props.justify : 'left'};
`

export const LText = styled.p`
  font-size: 26px;
  color: ${Colors.text};
  margin: 10px 0px;
  text-align: ${props => props.justify ? props.justify : 'left'};
`
export const MText = styled.p`
  font-size: 20px;
  color: ${Colors.text};
  text-align: ${props => props.justify ? props.justify : 'left'};
`

export const BlueLText = styled.p`
  font-size: 26px;
  color: ${Colors.blue};
  margin: 10px 0px;
  text-align: ${props => props.justify ? props.justify : 'left'};
`
export const BlueSText = styled.p`
  font-size: 14px;
  color: ${Colors.blue};
  text-align: ${props => props.justify ? props.justify : 'left'};
`

export const GrayMText = styled.p`
  font-size: 20px;
  color: ${Colors.gray};
  text-align: ${props => props.justify ? props.justify : 'left'};
`
export const GraySText = styled.p`
  font-size: 14px;
  color: ${Colors.gray};
  text-align: ${props => props.justify ? props.justify : 'left'};
`

export const RightView = styled.div`
  display: flex;
  padding: ${props => props.paddingTop ? props.paddingTop + 'px 0' : '0'};
  justify-content: flex-end;
  align-items: ${props => props.align ? props.align : 'center'};
`
export const BottomView = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-top: 60px;
`

export const Row = styled.div`
  display: flex;
  align-items: ${props => props.align ? props.align : 'center'};
`

export const CenterRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center
`
export const SBView = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${props => props.padding ? props.padding : '0'};
`

export const ErrorText = styled.p`
  color: ${Colors.error};
  font-size: 12px;
  margin: 2px;
`

export const PV = styled.div`
  padding: ${props => props.padding + 'px'}
`

export const FlexView = styled.div`
  display: flex;
  flex-direction: ${props => props.direction ? props.direction : 'row'};
  justify-content: ${props => props.justify ? props.justify : 'center'};
  align-items: ${props => props.align ? props.align : 'center'};
  padding: ${props => props.padding ? props.padding : '0px'};
  margin: ${props => props.margin ? props.margin: '0px'};
  width: 100%;
`

export const Text = styled.p`
  padding: ${props => props.padding ? props.padding : '10px 0px'};
  margin: ${props => props.margin ? props.margin: '0px'};
  color: ${props => props.color ? props.color : Colors.text};
  font-size: ${props => props.fontSize ? props.fontSize + 'px' : '12px'};
  text-align: ${props => props.align ? props.align : 'left'};
`
export const SpanText = styled.span`
padding: ${props => props.padding ? props.padding : '5px 0px'};
margin: ${props => props.margin ? props.margin: '0px'};
color: ${props => props.color ? props.color : Colors.text};
font-size: ${props => props.fontSize ? props.fontSize + 'px' : '12px'};
text-align: ${props => props.align ? props.align : 'left'};
`



export const searchSelectStyle = {
  menu: styles => ({
    ...styles,
    zIndex: 11
  }),
  control: styles => ({
    ...styles,
    height: 41
  }),
  option: (styles, state) => ({
    ...styles,
    borderBottom: '1px solid ' + Colors.lightgray,
    color: state.isSelected ? Colors.lightgray : Colors.gray,
  }),
};

export const fundTypeSelectStyle = {
  menu: styles => ({
    ...styles,
    zIndex: 11
  }),
  control: styles => ({
    ...styles,
    height: 41
  }),
  option: (styles, state) => ({
    ...styles,
    borderBottom: '1px solid ' + Colors.lightgray,
    color: state.isSelected ? Colors.lightgray : Colors.gray,
    fontWeight: state.isDisabled ? 'bold' : 'normal'
  }),
};
