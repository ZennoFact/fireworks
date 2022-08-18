function showHelper() {
    // const axes = new THREE.AxisHelper(2500);
    // scene.add(axes);
    const gridHelper = new THREE.GridHelper(10000, 20);
    scene.add(gridHelper);
}

function initialize(scene) {
    scene.background = new THREE.Color( 0x000000 );

    const renderer = new THREE.WebGLRenderer({
        alpha: true
    });
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    return renderer;
}

function createCamera() {
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 10000 );
    // camera.position.x = 2000;
    camera.position.y = 3000;
    camera.position.z = 3000;
    camera.lookAt(new THREE.Vector3(0,0,0));
    const controls = new THREE.OrbitControls(camera, document.body);

    return camera;
}

function createLight(hex = 0x42424) {
    return new THREE.AmbientLight( hex );
}