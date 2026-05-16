declare module 'react-simple-maps' {
  import type { ReactNode, CSSProperties, SVGAttributes } from 'react'

  type ProjectionConfig = { scale?: number; center?: [number, number]; rotate?: [number, number, number] }
  type GeographyStyle = { default?: CSSProperties; hover?: CSSProperties; pressed?: CSSProperties }

  export function ComposableMap(props: {
    projection?: string
    projectionConfig?: ProjectionConfig
    style?: CSSProperties
    children?: ReactNode
  }): JSX.Element

  export function ZoomableGroup(props: { center?: [number, number]; zoom?: number; children?: ReactNode }): JSX.Element

  export function Geographies(props: {
    geography: string | object
    children: (args: { geographies: any[] }) => ReactNode
  }): JSX.Element

  export function Geography(props: {
    geography: any
    fill?: string
    stroke?: string
    strokeWidth?: number
    style?: GeographyStyle
    [key: string]: any
  }): JSX.Element

  export function Marker(props: {
    coordinates: [number, number]
    children?: ReactNode
    onMouseEnter?: (e: React.MouseEvent<SVGGElement>) => void
    onMouseLeave?: (e: React.MouseEvent<SVGGElement>) => void
    style?: CSSProperties
    [key: string]: any
  }): JSX.Element
}
