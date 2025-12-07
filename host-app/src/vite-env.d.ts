/// <reference types="vite/client" />

declare module 'remote-app-1/Button' {
  const Button: React.ComponentType<{
    label: string
    onClick: () => void
  }>
  export default Button
}

declare module 'remote-app-2/Cart' {
  const Cart: React.ComponentType
  export default Cart
}

declare module 'remote-app-2/cartSlice' {
  const cartSlice: any
  export default cartSlice
}



declare module 'remote-app-1/*' {
  const value: any
  export default value
}
