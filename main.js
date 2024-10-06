
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
//import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import * as THREE from 'three';
//import { ColorCorrectionShader } from 'three/addons/postprocessing/ColorCorrectionShader.js';


const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.gammaOutput = true;
renderer.gammaFactor = 2.2; 

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(4, -14, 5);
camera.position.set(0, 0, 0);
camera.zoom = 1;  // 2x zoom
camera.rotation.x = Math.PI / 4;  // Rotates around X-axis
//camera.rotation.y = Math.PI / 4;  // Rotates around Y-axis
camera.lookAt(new THREE.Vector3(0, 0, 0));  // Look at a specific point


// After changing the zoom, call this to apply it
camera.updateProjectionMatrix();

// Set the background color of the scene to a specific color
scene.background = new THREE.Color(0x000000); // Black color

// Adds a picture as background
const textureLoader = new THREE.TextureLoader();
const backgroundTexture = textureLoader.load('night2.jpg');
scene.background = backgroundTexture;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = true;
controls.minDistance = 5;
controls.maxDistance = 700;
controls.minPolarAngle = 0;
controls.maxPolarAngle = Math.PI;
controls.autoRotate = false;
controls.target = new THREE.Vector3(10, 10, -12);
controls.update();



// Lights



const directionalLight = new THREE.DirectionalLight(0xffffff, 5);  // Strong white directional light
directionalLight.position.set(10, 20, 10);  // Set light position
directionalLight.castShadow = true;  // Enable shadow casting

// Adjust shadow properties
directionalLight.shadow.mapSize.width = 2048;  // Increase shadow map resolution (optional)
directionalLight.shadow.mapSize.height = 2048;
directionalLight.shadow.camera.near = 0.5;  // Adjust shadow camera frustum (optional)
directionalLight.shadow.camera.far = 500;
directionalLight.shadow.camera.left = -50;
directionalLight.shadow.camera.right = 50;
directionalLight.shadow.camera.top = 50;
directionalLight.shadow.camera.bottom = -50;

scene.add(directionalLight);


const spotLight1 = new THREE.SpotLight(0x00fff2, 5000, 1000, Math.PI / 10, 1);
spotLight1.position.set(5, 15, 10);
spotLight1.castShadow = true;
spotLight1.shadow.bias = -0.0011;
//scene.add(spotLight1);


const spotLight2 = new THREE.SpotLight(0x00fe0d, 5020, 100, Math.PI / 6, 1);
spotLight2.position.set(5, 15, -10);
spotLight2.castShadow = true;
spotLight2.shadow.bias = -0.0011;
//scene.add(spotLight2);

const spotLight3 = new THREE.SpotLight(0xffffff, 1008500, 0, Math.PI / 6, 1);
spotLight3.position.set(-30, 5, 30);
spotLight3.position.set(10, 545, -10);

spotLight2.position.set(-0.3, 45.4, -0.5);


spotLight3.castShadow = true;
spotLight3.shadow.bias = -0.0011;
//scene.add(spotLight3);

// Post-processing setup
const composer = new EffectComposer(renderer);
const renderScene = new RenderPass(scene, camera);
composer.addPass(renderScene);

// Bloom pass
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  0.3,  // strength
  1.1,  // radius
  0.5  // threshold
);
//composer.addPass(bloomPass);

// Bokeh pass
const bokehPass = new BokehPass(scene, camera, {
  focus: 0.5,
  aperture: 0.000035,
  maxblur: 0.031,
  width: window.innerWidth,
  height: window.innerHeight,
});
//composer.addPass(bokehPass);

// Define basicMaterial as a THREE.js material
const basicMaterial = new THREE.MeshBasicMaterial({
  color: 0x00ff00, // green color
  wireframe: false // or true if you want a wireframe
});

//SPHERE SPHERE
//earth
// Load the texture
//const textureLoader = new THREE.TextureLoader();
const globeTexture = textureLoader.load('earth.jpg');

// Create the sphere geometry
const sphereGeometry = new THREE.SphereGeometry(4, 32, 32); // radius, widthSegments, heightSegments

// Create the material and apply the texture
const sphereMaterial = new THREE.MeshStandardMaterial({
    map: globeTexture // Apply the texture to the material
});

// Create the sphere mesh
const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);

// Set the position of the sphere in the scene
sphereMesh.position.set(10, 10, -8);
sphereMesh.castShadow = true;  // Make the sphereMesh cast shadows
sphereMesh.receiveShadow = true;
// Add the sphere mesh to the scene
scene.add(sphereMesh);

function rotateSphere() {
  sphereMesh.rotation.y += 0.005; // Adjust the speed of rotation around the Y-axis
}

const cubeGeometry = new THREE.BoxGeometry(5, 5, 5);
const cubeMaterial = new THREE.MeshPhysicalMaterial({ color: 0xff7700 });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.set(10, 10, -8);  // Move the cube to the right
cube.castShadow = true;  // Make the cube cast shadows
cube.receiveShadow = true;
        //scene.add(cube)



//plane geometry with the image
//const textureLoader2 = new THREE.TextureLoader();
const texture = textureLoader.load('wall.jpg');

// Create the plane geometry
const geometry2 = new THREE.PlaneGeometry(20, 20);

// Apply the texture to a material
const material2 = new THREE.MeshStandardMaterial({ 
  map: texture, 
  emissive: 0x222222,  // Adds slight brightness to the texture
  emissiveIntensity: -7 // Controls the intensity of the emissive color
});
// Create the plane mesh
const plane = new THREE.Mesh(geometry2, material2);
plane.position.set(10, 10, -14);
plane.castShadow = false;  // Make the plane cast shadows
plane.receiveShadow = false;

//scene.add(plane);

// Load Millennium Falcon model
const loader2 = new GLTFLoader().setPath('public/whale/');
loader2.load(
  'scene.gltf',
  (gltf) => {
    console.log('loading model');
    const mesh = gltf.scene;

    mesh.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        // Preserve the original textures by copying the map from the original material
        const originalMaterial = child.material;
        child.material = new THREE.MeshStandardMaterial({
          map: originalMaterial.map,  // Retains the original texture
          normalMap: originalMaterial.normalMap,  // Retains normal map if present
          metalness: originalMaterial.metalness || 10.5,  // Adjust metalness for shine
          roughness: originalMaterial.roughness || 0.5,  // Adjust roughness for surface finish
        });

        //child.layers.enable(1);  // Enable bloom layer for this mesh
      }
    });

    mesh.scale.set(0.1, 0.1, 0.1);
    mesh.position.set(20, -19, -12);
    mesh.visible = true;
    //scene.add(mesh);
    rotateObject(mesh, 50, 25, 10);

    document.getElementById('progress-container').style.display = 'none';
  },
  (xhr) => {
    console.log(`loading ${xhr.loaded / xhr.total * 100}%`);
  },
  (error) => {
    console.error(error);
  }
);

function rotateObject(mesh, degreeX=0, degreeY=0, degreeZ=0) {
  mesh.rotateX(THREE.Math.degToRad(degreeX));  // Rotate on X-axis
  mesh.rotateY(THREE.Math.degToRad(degreeY));  // Rotate on Y-axis
  mesh.rotateZ(THREE.Math.degToRad(degreeZ));  // Rotate on Z-axis
}



const loader4 = new GLTFLoader().setPath('public/townhall/');
loader4.load(
  'scene.gltf',
  (gltf) => {
    console.log('loading model');
    const mesh = gltf.scene;

    mesh.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        // Preserve the original textures by copying the map from the original material
        const originalMaterial = child.material;
        child.material = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          map: originalMaterial.map,  // Retains the original texture
          normalMap: originalMaterial.normalMap,  // Retains normal map if present
          metalness: originalMaterial.metalness || 100.5,  // Adjust metalness for shine
          roughness: originalMaterial.roughness || 0.5,  // Adjust roughness for surface finish
        });

        //child.layers.enable(1);  // Enable bloom layer for this mesh
      }
    });

    mesh.scale.set(20.8, 20.8, 20.8);
    mesh.position.set(10, 10, -10);
    mesh.visible = true;
    // Assuming 'mesh' is your THREE.js mesh object
    mesh.rotation.y = THREE.MathUtils.degToRad(45);  // Rotate 45 degrees around Y-axis
    //scene.add(mesh);
    rotateObject(mesh, 50, 25, 10);

    document.getElementById('progress-container').style.display = 'none';
  },
  (xhr) => {
    console.log(`loading ${xhr.loaded / xhr.total * 100}%`);
  },
  (error) => {
    console.error(error);
  }
);


// const rgbeLoader = new THREE.RGBELoader();
// rgbeLoader.load('public/chapel.png', (texture) => {
//   texture.mapping = THREE.EquirectangularReflectionMapping;  // Ensure proper mapping
//   scene.environment = texture; 

const textureLoader1 = new THREE.TextureLoader();
textureLoader1.load('forest.png', (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;  // Use equirectangular mapping
  //scene.environment = texture;

const loader3 = new GLTFLoader().setPath('public/city1/');
let mesh2;
loader3.load(
  'scene.gltf',
  (gltf) => {
    console.log('loading model');
    const mesh2 = gltf.scene;

    mesh2.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        // Preserve the original textures by copying the map from the original material
        const originalMaterial = child.material;
        child.material = new THREE.MeshPhysicalMaterial({
          color: 0xfda1fd,
          map: texture,
          map: originalMaterial.map,  // Retains the original texture
          normalMap: originalMaterial.normalMap,  // Retains normal map if present
          metalness: originalMaterial.metalness || 10,  // Adjust metalness for shine
          roughness: originalMaterial.roughness || 0,  // Adjust roughness for surface finish
          envMap: texture,  // Use chapel.png for reflection
          envMapIntensity: 4.5,

          //bumpMap: textureBump, // Adds a bump map to simulate surface detail (use a grayscale texture)
          //bumpScale: 1.0,
          
          //lightMap: textureLightMap, // Adds a light map that defines the light intensity across the surface
          //lightMapIntensity: 0.0,
          //wireframe: true,

          transmission: 1,   // Full transparency (1 for fully transparent, 0 for opaque)
            opacity: 1,        // Keep opacity at 1 for glass-like effect
            transparent: true, // Enable transparency
            roughness: 0,      // Smooth surface
            metalness: 0,      // Non-metallic surface
            ior: 1.5,          // Index of refraction (1.0 for air, around 1.5 for glass)
            reflectivity: 1, // High reflectivity for mirror-like reflections
            thickness: 10.1,    // Simulated thickness of the glass (in world units)
            //envMapIntensity: 1.0,  // Adjust environment map reflections intensity
            clearcoat: 1.0,    // Simulates a glossy clear coating
            clearcoatRoughness: 0 ,
          normalScale: 4,
          normalRepeat: 10,
          //roughness: 0.3,
          // sheen: new THREE.Color(0xff0000), // Red sheen for velvet-like effect
          // sheenRoughness: 0.5,        // Controls the softness of the sheen
          // specularIntensity: 0.8,     // Makes the material more reflective
          // specularColor: new THREE.Color(0xffffff),
          
        });

        child.layers.enable(1);  // Enable bloom layer for this mesh
      }
    });

    mesh2.scale.set(6, 6, 6);
    //mesh2.position.set(327, 0, 203);
    //mesh2.position.set(50, -12.3, 50);//minecraft
   //mesh2.position.set(16, -2.3, -21);//museum
    //mesh2.position.set(10, 2.3, -10);//car
  //  mesh2.position.set(10, 5, 0);//ball
    mesh2.position.set(10, 10, -8);//face
    mesh2.visible = true;
   // mesh2.rotation.y = THREE.MathUtils.degToRad(90);
    scene.add(mesh2);

    document.getElementById('progress-container').style.display = 'none';
    setupEventListeners();
  },
  (xhr) => {
    console.log(`loading ${xhr.loaded / xhr.total * 100}%`);
  },
  (error) => {
    console.error(error);
  }
);
})


//rotate

// function animate2() {
//   requestAnimationFrame(animate2);
  
//   // Auto-rotate the mesh
//   mesh2.rotation.y += 0.01;  // Rotate around the Y axis
//   mesh2.rotation.x += 0.005; // Rotate around the X axis
  
//   renderer.render(scene, camera);
// }
// animate2();

// const loader5 = new GLTFLoader().setPath('public/office2/');
// loader5.load(
//   'scene.gltf',
//   (gltf) => {
//     console.log('loading model');
//     const mesh2 = gltf.scene;

//     mesh2.traverse((child) => {
//       if (child.isMesh) {
//         child.castShadow = true;
//         child.receiveShadow = true;

//         // Preserve the original textures by copying the map from the original material
//         const originalMaterial = child.material;
//         child.material = new THREE.MeshStandardMaterial({
//           //color: 0xffffff,
//           map: originalMaterial.map,  // Retains the original texture
//           normalMap: originalMaterial.normalMap,  // Retains normal map if present
//           metalness: originalMaterial.metalness || 0,  // Adjust metalness for shine
//           roughness: originalMaterial.roughness || 0.5,  // Adjust roughness for surface finish
//         });

//         child.layers.enable(1);  // Enable bloom layer for this mesh
//       }
//     });

//     mesh2.scale.set(6.4, 6.4, 6.4);
//     mesh2.position.set(17, -20, -13);
//     mesh2.position.set(10, 10, -10);
//     //mesh2.rotation.x = THREE.MathUtils.degToRad(45);  // Rotate 45 degrees around X-axis
//       // Rotate 45 degrees around Z-axis

//     //mesh2.position.set(0, 0, 0);
//     mesh2.visible = true;
//     //scene.add(mesh2);

//     document.getElementById('progress-container').style.display = 'none';
//   },
//   (xhr) => {
//     console.log(`loading ${xhr.loaded / xhr.total * 100}%`);
//   },
//   (error) => {
//     console.error(error);
//   }
// );


// const loader6 = new GLTFLoader().setPath('public/panorama/');
// loader6.load(
//   'scene.gltf',
//   (gltf) => {
//     console.log('loading model');
//     const mesh2 = gltf.scene;

//     mesh2.traverse((child) => {
//       if (child.isMesh) {
//         child.castShadow = true;
//         child.receiveShadow = true;

//         // Preserve the original textures by copying the map from the original material
//         const originalMaterial = child.material;
//         child.material = new THREE.MeshStandardMaterial({
//           //color: 0xffffff,
//           map: originalMaterial.map,  // Retains the original texture
//           normalMap: originalMaterial.normalMap,  // Retains normal map if present
//           metalness: originalMaterial.metalness || 0,  // Adjust metalness for shine
//           roughness: originalMaterial.roughness || 0.5,  // Adjust roughness for surface finish
//         });

//         child.layers.enable(1);  // Enable bloom layer for this mesh
//       }
//     });

//     mesh2.scale.set(16.4, 16.4, 16.4);
//     mesh2.position.set(17, -20, -13);
//     mesh2.position.set(10, 2.3, -10);
//     mesh2.position.set(10, 4.3, -10);
//     //mesh2.position.set(0, 0, 0);
//     mesh2.visible = true;
//     mesh2.rotation.y = THREE.MathUtils.degToRad(-90);
//     //scene.add(mesh2);

//     document.getElementById('progress-container').style.display = 'none';
//   },
//   (xhr) => {
//     console.log(`loading ${xhr.loaded / xhr.total * 100}%`);
//   },
//   (error) => {
//     console.error(error);
//   }
// );



// Event listeners





document.getElementById('toggleSpotlight1').addEventListener('click', function() {
  if (scene.children.includes(spotLight1)) {
    scene.remove(spotLight1);
  } else {
    scene.add(spotLight1);
  }
});

document.getElementById('toggleSpotlight2').addEventListener('click', function() {
  if (scene.children.includes(spotLight2)) {
    scene.remove(spotLight2);
  } else {
    scene.add(spotLight2);
  }
});

document.getElementById('toggleSpotlight3').addEventListener('click', function() {
  if (scene.children.includes(spotLight3)) {
    scene.remove(spotLight3);
  } else {
    scene.add(spotLight3);
  }
});

document.getElementById('toggleSpotlight4').addEventListener('click', function() {
  const isBokehPassPresent = composer.passes.includes(bokehPass);
  
  if (isBokehPassPresent) {
    composer.removePass(bokehPass);  // Remove the bokeh effect
  } else {
    composer.addPass(bokehPass);  // Add the bokeh effect back
  }
});

// Add a button to toggle autoRotate (assuming you have an HTML button with id 'toggleAutoRotate')
document.getElementById('toggleAutoRotate').addEventListener('click', function() {
  controls.autoRotate = !controls.autoRotate; // Toggle the autoRotate value
});

// Add a button to toggle bloom (assuming you have an HTML button with id 'toggleBloom')
document.getElementById('toggleBloom').addEventListener('click', function() {
  if (composer.passes.includes(bloomPass)) {
    composer.removePass(bloomPass); // Remove the bloomPass if it's already added
  } else {
    composer.addPass(bloomPass); // Add the bloomPass if it's not in the composer
  }
});



document.getElementById('settingsButton').addEventListener('click', function() {
  const dropdownMenu = document.getElementById('dropdownMenu');
  dropdownMenu.classList.toggle('show');
});

// let townhallMesh; // Declare townhallMesh in the global scope

document.getElementById('spawnTownhallButton').addEventListener('click', function() {
  if (townhallMesh && scene.children.includes(townhallMesh)) {
    // If the townhall model is already in the scene, remove it
    scene.remove(townhallMesh);
    townhallMesh = null; // Reset townhallMesh to allow it to be added again
  } else {
    // If the townhall model is not in the scene, load and add it
    const loader = new GLTFLoader().setPath('public/millennium_falcon/');
    loader.load(
      'scene.gltf',
      (gltf) => {
        console.log('loading townhall model');
        townhallMesh = gltf.scene;

        townhallMesh.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        // Adjust position, scale, and rotation of the townhall model as needed
        townhallMesh.scale.set(4.4, 4.4, 4.4);
        townhallMesh.position.set(17, -40, -13);   // Set the position in the scene
        scene.add(townhallMesh); // Add the townhall model to the scene
      },
      (xhr) => {
        console.log(`loading ${xhr.loaded / xhr.total * 100}%`);
      },
      (error) => {
        console.error(error);
      }
    );
  }
});



//
//
//
// Add this to your import
//image panorama


import { SphereGeometry } from 'three';

// Add this function to your code
function addPanorama(path) {
  const geometry = new SphereGeometry(500, 60, 40);
  // Flip the geometry inside out
  geometry.scale(-1, 1, 1);

  const texture = new THREE.TextureLoader().load(path);
  const material = new THREE.MeshBasicMaterial({
    map: texture
  });

  const mesh1 = new THREE.Mesh(geometry, material);
  
  // Rotate the sphere to align the panorama correctly
  mesh1.rotation.y = 0.5;

  scene.add(mesh1);
}

// Call this function after your scene is set up, 
// replacing 'path/to/your/panorama.jpg' with the actual path to your panorama image
addPanorama('forest.png');

// If you want to remove the existing background, add this line:
scene.background = null;
//end panorama
//
//
//


// // Add this function to your code
// function addSkydome(path) {
//   const loader = new GLTFLoader();
//   loader.load(
//     path,
//     (gltf) => {
//       const skydome = gltf.scene;
      
//       // Scale the skydome to encompass the entire scene
//       const scale = 1000; // Adjust this value as needed
//       skydome.scale.set(scale, scale, scale);
      
//       // Center the skydome on the scene
//       skydome.position.set(0, 0, 0);
      
//       // If your skydome model includes animations, you can set them up here
//       if (gltf.animations && gltf.animations.length) {
//         const mixer = new THREE.AnimationMixer(skydome);
//         const action = mixer.clipAction(gltf.animations[0]);
//         action.play();
        
//         // You'll need to update the mixer in your animation loop
//         function animate() {
//           requestAnimationFrame(animate);
//           const delta = clock.getDelta();
//           mixer.update(delta);
//           // ... rest of your animation loop
//         }
//       }
      
//       scene.add(skydome);
      
//       // Remove the existing background
//       scene.background = null;
//     },
//     (xhr) => {
//       console.log((xhr.loaded / xhr.total * 100) + '% loaded');
//     },
//     (error) => {
//       console.error('An error happened', error);
//     }
//   );
// }

// Call this function after your scene is set up, 
// replacing 'path/to/your/skydome.gltf' with the actual path to your GLTF skydome model
//addSkydome('public/panorama/scene.gltf');








window.onclick = function(event) {
  if (!event.target.matches('#settingsButton')) {
    const dropdowns = document.getElementsByClassName('dropdown-content');
    for (let i = 0; i < dropdowns.length; i++) {
      const openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
};

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
  bloomPass.setSize(window.innerWidth, window.innerHeight);
  bokehPass.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  composer.render();
  cube.rotation.y += 0.01;
  rotateSphere();
}

animate();