import { useRef, useEffect } from 'react'

export const Fireworks = () => {
  const canvasRef = useRef(null)
  const pinkCircle = useRef(null)
  const ray = useRef(null)
  const yellowCircle = useRef(null)

  const showFireWork = () => {
    // Initialise an empty canvas and place it on the page
    const canvasSizeWidth = window.innerWidth
    const canvasSizeHeight = window.innerHeight
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    canvas.width = canvasSizeWidth
    canvas.height = canvasSizeHeight / 2
    canvas.style.position = 'absolute'
    canvas.style.zIndex = 2
    canvas.style.top = 0
    canvas.style.right = 0
    canvas.style.margin = 'auto'
    document.querySelector('.pt-m-fireworks').appendChild(canvas)

    // No longer setting velocites as they will be random
    // Set up object to contain particles and set some default values
    let particles = {},
      particleIndex = 0,
      settings = {
        density: 1,
        particleSize: 10,
        startingX: canvasSizeWidth / 2,
        startingY: canvas.height / 2,
        gravity: 0,
        maxLife: 50,
      }

    // To optimise the previous script, generate some pseudo-random angles
    let seedsX = []
    let seedsY = []
    let maxAngles = 100
    let currentAngle = 0

    function seedAngles() {
      seedsX = []
      seedsY = []
      for (let i = 0; i < maxAngles; i++) {
        seedsX.push(Math.random() * 20 - 10)
        seedsY.push(Math.random() * 30 - 10)
      }
    }

    // Start off with 100 angles ready to go
    seedAngles()

    // Set up a function to create multiple particles
    function Particle() {
      if (currentAngle !== maxAngles) {
        // Establish starting positions and velocities
        this.x = settings.startingX
        this.y = settings.startingY

        this.vx = seedsX[currentAngle]
        this.vy = seedsY[currentAngle]

        currentAngle++

        // Add new particle to the index
        // Object used as it's simpler to manage that an array
        particleIndex++
        particles[particleIndex] = this
        this.id = particleIndex
        this.life = 0
        this.maxLife = settings.maxLife
      } else {
        // console.log('Generating more seed angles')
        seedAngles()
        currentAngle = 0
      }
    }

    // Some prototype methods for the particle's "draw" function
    Particle.prototype.draw = function () {
      this.x += this.vx
      this.y += this.vy

      // Adjust for gravity
      this.vy += settings.gravity

      // Age the particle
      this.life++

      // If Particle is old, it goes in the chamber for renewal
      if (this.life >= this.maxLife) {
        delete particles[this.id]
      }

      // Create the shapes
      //context.fillStyle = "red";
      //context.fillRect(this.x, this.y, settings.particleSize, settings.particleSize);
      context.clearRect(
        settings.leftWall,
        settings.groundLevel,
        canvas.width,
        canvas.height,
      )
      context.beginPath()
      // Draws a circle of radius 20 at the coordinates 100,100 on the canvas
      let img = pinkCircle.current
      let img2 = yellowCircle.current
      let img3 = ray.current
      if (img && context && img2) {
        context.drawImage(
          img,
          this.x,
          this.y,
          settings.particleSize,
          settings.particleSize,
        )
        context.drawImage(
          img2,
          this.x + 10,
          this.y + 30,
          settings.particleSize,
          settings.particleSize,
        )
        context.drawImage(
          img3,
          this.x + 30,
          this.y + 10,
          settings.particleSize,
          settings.particleSize,
        )

        context.closePath()
        context.fill()
      }
    }

    setInterval(function () {
      context.clearRect(0, 0, canvas.width, canvas.height)

      // Draw the particles
      for (let i = 0; i < settings.density; i++) {
        new Particle()
      }

      for (let i in particles) {
        particles[i].draw()
      }
    }, 75)
  }

  useEffect(() => {
    showFireWork()
  }, [])

  return (
    <div className="pt-m-fireworks">
      <img
        ref={pinkCircle}
        src="/pt/images/icons/ic-circle-pink.svg"
        alt="pink circle"
        style={{ display: 'none' }}
      />
      <img
        ref={yellowCircle}
        src={'/pt/images/icons/ic-circle-yellow.svg'}
        alt="yellow circle"
        style={{ display: 'none' }}
      />
      <img
        ref={ray}
        src="/pt/images/icons/ic-ray-light-green.svg"
        alt="ray"
        style={{ display: 'none' }}
      />
      <canvas ref={canvasRef} className="__fireworks" />
    </div>
  )
}
