export interface FrontNotice {
  name?: number
  content?: string
}

export interface Comment {
  avatar?: string
  user?: string
  content?: string
  time?: string
  children?: any
  id: number
}
