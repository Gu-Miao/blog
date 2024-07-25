import { createEffect } from 'solid-js'

interface BackGroundProps {
  images: string[]
}

function Background({ images }: BackGroundProps) {
  createEffect(() => {
    const interval = 5
    const easing = 0.5
    const duration = interval - easing
    const backgroundDuration = duration / (images.length * interval)
    const backgroundEasing = easing / (images.length * interval)

    let keyFrameDefinition = '@keyframes background {'
    let percentage = 0

    for (let i = 0; i < images.length; i++) {
      if (i !== 0) {
        percentage += backgroundEasing
      }
      keyFrameDefinition += `${percentage * 100}% {background-image:url(${images[i]})}`
      percentage += backgroundDuration
      keyFrameDefinition += `${percentage * 100}% {background-image:url(${images[i]})}`
    }
    keyFrameDefinition += `100%{background-image:url(${images[0]})}}.prefetch{animation:background ${interval}s;}`

    const style = document.createElement('style')
    style.innerHTML = keyFrameDefinition
    document.head.append(style)

    const home = document.querySelector('.home') as HTMLDivElement
    home.style.animationDuration = `${interval * images.length}s`
  })

  return <div class="prefetch"></div>
}

export default Background
