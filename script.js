import * as THREE from 'three';

// 1. Scene & Camera Setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB); 

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 10); 
camera.lookAt(0, 1.5, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 2. Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);
const sunLight = new THREE.DirectionalLight(0xffffff, 0.6);
sunLight.position.set(5, 10, 7);
scene.add(sunLight);

// 3. Ground (Grass)
const grass = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    new THREE.MeshStandardMaterial({ color: 0x228B22 })
);
grass.rotation.x = -Math.PI / 2;
scene.add(grass);

// 4. THE TABLE
const tableGroup = new THREE.Group();
const woodMat = new THREE.MeshStandardMaterial({ color: 0x5D4037 });
const top = new THREE.Mesh(new THREE.BoxGeometry(3, 0.1, 2), woodMat);
top.position.y = 1.2;
tableGroup.add(top);

const tableLegGeo = new THREE.CylinderGeometry(0.1, 0.1, 1.2);
[[1.3, 0.6, 0.8], [-1.3, 0.6, 0.8], [1.3, 0.6, -0.8], [-1.3, 0.6, -0.8]].forEach(p => {
    const leg = new THREE.Mesh(tableLegGeo, woodMat);
    leg.position.set(...p);
    tableGroup.add(leg);
});
scene.add(tableGroup);

// 5. ITEMS ON TABLE
const milo = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.5), new THREE.MeshStandardMaterial({ color: 0x006400 }));
milo.position.set(0.5, 1.5, 0); 
scene.add(milo);

const milk = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.4), new THREE.MeshStandardMaterial({ color: 0xffffff }));
milk.position.set(-0.5, 1.45, 0);
scene.add(milk);

const cupMat = new THREE.MeshStandardMaterial({ color: 0xdddddd });
const cup1 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.08, 0.2), cupMat);
cup1.position.set(0, 1.35, 0.5);
scene.add(cup1);

const cup2 = cup1.clone();
cup2.position.set(0, 1.35, -0.5);
scene.add(cup2);

// 6. CHAIRS (With Legs)
function addChair(x, z, rot) {
    const chairGroup = new THREE.Group();
    
    // Seat
    const seat = new THREE.Mesh(new THREE.BoxGeometry(1, 0.1, 1), woodMat);
    seat.position.y = 0.6; // Height of the seat from ground
    chairGroup.add(seat);

    // Backrest
    const back = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 0.1), woodMat);
    back.position.set(0, 1.1, -0.45);
    chairGroup.add(back);

    // [NEW] Chair Legs
    const chairLegGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.6);
    const legOffset = 0.4;
    const legPositions = [
        [legOffset, 0.3, legOffset],   // Front Right
        [-legOffset, 0.3, legOffset],  // Front Left
        [legOffset, 0.3, -legOffset],  // Back Right
        [-legOffset, 0.3, -legOffset]  // Back Left
    ];

    legPositions.forEach(pos => {
        const leg = new THREE.Mesh(chairLegGeo, woodMat);
        leg.position.set(...pos);
        chairGroup.add(leg);
    });
    
    chairGroup.position.set(x, 0, z);
    chairGroup.rotation.y = rot;
    scene.add(chairGroup);
}

addChair(-2.5, 0, Math.PI / 2); // Left chair facing table
addChair(2.5, 0, -Math.PI / 2); // Right chair facing table

// 7. BACKGROUND TREES
const trunkMat = new THREE.MeshStandardMaterial({ color: 0x3d2b1f });
const leafMat = new THREE.MeshStandardMaterial({ color: 0x1a4d1a });

function createTree(x, z) {
    const tree = new THREE.Group();
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 1.5), trunkMat);
    trunk.position.y = 0.75;
    const leaves = new THREE.Mesh(new THREE.ConeGeometry(1.2, 3, 8), leafMat);
    leaves.position.y = 3;
    tree.add(trunk, leaves);
    tree.position.set(x, 0, z);
    scene.add(tree);
}

for (let i = 0; i < 20; i++) {
    let tx = (Math.random() - 0.5) * 50; 
    let tz = -15 - (Math.random() * 25); 
    createTree(tx, tz);
}

// 8. Animation Loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();