import styled from 'styled-components';
import { Colors } from '../lib/theme';

export const MainContainer = styled.div`
  width: 100%;
  height: 100vh;
  min-height: 500px;
  display: flex;
  overflow-y: hidden;
`

export const LeftSideWrapper = styled.div`
  width: 240px;
  background-color: ${Colors.lightgray};
  z-index: 10;
  transition-duration: 0s;
  height: 100vh;
`

export const RightView = styled.div`
  flex: 1;
  position: relative;
  transition-duration: .3s;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
`

export const TopBar = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px;
  border-bottom: 1px solid ${Colors.lightgray};
  background-color: white;
  z-index: 9
`
export const Content = styled.div`
  padding-top: 80px;
  flex: 1;
  display: flex;
  flex-direction: column;
`

export const PopOverView = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #0d2f5b;
  opacity: 0.95;
  z-index: 20;
  overflow: scroll;
`
export const GreenLine = styled.div`
  margin: 20px 0;
  height: 1px;
  background-color: ${Colors.green};
  width: 1005;
`
export const PopOverCloseIconView = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 80px;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
`
