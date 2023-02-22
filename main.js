// import * as THREE from 'three' = nahrazeno scriptem build.js
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'
import Stats from 'three/examples/jsm/libs/stats.module'
import output from './output.json'

// From output to variables
const CoordinateX = output.x
const CoordinateY = output.y
const CoordinateZ = output.z



const scene = new THREE.Scene()
scene.add(new THREE.AxesHelper(5))

// světlo
const light = new THREE.SpotLight()
light.position.set(20, 20, 20)
scene.add(light)

const camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)
// pozice a velikost při načtení
// camera.position.z = 130
camera.position.y = 130


const renderer = new THREE.WebGLRenderer()
renderer.outputEncoding = THREE.sRGBEncoding
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// Pohyb myší
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
// funkce pro update z API
controls.target.set(0, 0, 0)
controls.update()


const envTexture = new THREE.CubeTextureLoader().load([
    // 'img/px_50.png',
    // 'img/nx_50.png',
    // 'img/py_50.png',
    // 'img/ny_50.png',
    // 'img/pz_50.png',
    // 'img/nz_50.png'
])
envTexture.mapping = THREE.CubeReflectionMapping


// Nastavení materiálu
const material = new THREE.MeshMatcapMaterial({
    color: 0xffffff,
    // envMap: envTexture,
    // metalness: 0.25,
    // roughness: 0.1,
    opacity: 1.0,
    transparent: true,
    // transmission: 0.99,
    // clearcoat: 1.0,
    // clearcoatRoughness: 0.25
})

const loader = new STLLoader()
loader.load(
    'camera.stl',
    function (geometry) {
        const mesh = new THREE.Mesh(geometry, material)
        // hodnota do ROTATE se počítá z "PI"
        // rotuje s objektem
        mesh.rotateX(CoordinateX)
        mesh.rotateY(CoordinateY)
        mesh.rotateZ(CoordinateZ)
        scene.add(mesh)
      },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
        console.log(error)
    }
)

// Úprava velikosti, dle velikosti okna, responzivita
window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

const stats = Stats()
document.body.appendChild(stats.dom)

function animate() {
    requestAnimationFrame(animate)

    controls.update()

    render()

    stats.update()
}

function render() {
    renderer.render(scene, camera)
}

animate()