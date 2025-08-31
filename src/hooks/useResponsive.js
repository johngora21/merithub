import { useState, useEffect } from 'react'

export const useResponsive = () => {
  const [screenSize, setScreenSize] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    width: 0
  })

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth
      setScreenSize({
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024,
        width
      })
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  return screenSize
}

export const getGridColumns = (screenSize) => {
  if (screenSize.isMobile) return 1
  if (screenSize.isTablet) return 2
  return 3
}

export const getGridGap = (screenSize) => {
  if (screenSize.isMobile) return '12px'
  if (screenSize.isTablet) return '16px'
  return '20px'
}
