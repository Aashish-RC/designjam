export interface NodeLayout {
  name: string;
  type: string;
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  layoutMode?: 'flex' | 'grid' | 'none';
  flexDirection?: 'row' | 'column';
  justifyContent?: string;
  alignItems?: string;
  gap?: number;
  paddingTop?: number;
  paddingRight?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  backgroundColor?: string;
  textColor?: string;
  fontSize?: number;
  fontWeight?: string | number;
  fontFamily?: string;
  borderRadius?: number;
  borderColor?: string;
  borderWidth?: number;
  textContent?: string;
  opacity?: number;
  shadow?: string;
  children?: NodeLayout[];
}
