export const getSafePath = (path: string | null | undefined): string => {
  const rootPath = window.electron ? '.' : ''
  return `${rootPath}${path || ''}`
}
