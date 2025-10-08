import { Mesh, Renderer } from 'ogl'

export const captureImage = (
  canvas: HTMLCanvasElement,
  renderer: Renderer,
  mesh: Mesh | null
) => {
  try {
    if (mesh && renderer) {
      renderer.render({ scene: mesh })
    }

    requestAnimationFrame(() => {
      try {
        let dataUrl: string

        try {
          dataUrl = canvas.toDataURL('image/webp', 0.95)
        } catch {
          console.warn('WebP not supported, falling back to PNG')
          dataUrl = canvas.toDataURL('image/png')
        }

        if (dataUrl === 'data:,' || dataUrl.length < 100) {
          console.error('Canvas appears to be empty')
          alert(
            'Failed to capture image. The canvas might be empty or the WebGL context is lost.'
          )
          return
        }

        const link = document.createElement('a')
        link.download = `gradflow-gradient-${Date.now()}.webp`
        link.href = dataUrl
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } catch (error) {
        console.error('Failed to capture image:', error)
      }
    })
  } catch (error) {
    console.error('Failed to initiate image capture:', error)
  }
}
