import { Status as ChakraStatus } from '@chakra-ui/react'
import * as React from 'react'
function _nullishCoalesce(lhs, rhsFn) {
  if (lhs != null) {
    return lhs
  } else {
    return rhsFn()
  }
}

const statusMap = {
  success: 'green',
  error: 'red',
  warning: 'orange',
  info: 'blue',
}

export const Status = React.forwardRef(function Status(props, ref) {
  const { children, value = 'info', ...rest } = props
  const colorPalette = _nullishCoalesce(
    rest.colorPalette,
    () => statusMap[value],
  )
  return (
    <ChakraStatus.Root ref={ref} {...rest} colorPalette={colorPalette}>
      <ChakraStatus.Indicator />
      {children}
    </ChakraStatus.Root>
  )
})
