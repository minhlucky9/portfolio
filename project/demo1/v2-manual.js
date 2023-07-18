

var mainScene, subScene, mainRenderer, subRenderer, mainCamera, subCamera;
var directionalLightMain, directionalLightSub;
var controls;
var mainContainer;
var ROOM;
var video;
var objects = [];
var collidableObjects = [];

var arrCount;
//interating panorama
var isUserInteracting = false,
    onMouseDownMouseX = 0, onMouseDownMouseY = 0,
    lon = 0, onMouseDownLon = 0,
    lat = 0, onMouseDownLat = 0,
    phi = 0, theta = 0;
//--
//click object
var isClickObjects = false;
var flag = true;
var isShowVideo = false;
var isShowPicture = false;
var isShowModel = false;
var afterClickObject = true;
//--
//movement mouseclick
var camPos = null;
var targetPos = null;
var isPlane = false;
var isMove = false;
var isKeycode = false;
//--
//movement keycode
var obj = [];
var clock;
var PLAYERCOLLISIONDISTANCE = 10;
// Flags to determine which direction the player is moving
var raycaster, mouse;
var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;
var canJump = false;
// Velocity vectors for the player and dino
var velocity = new THREE.Vector3();
var direction = new THREE.Vector3();
//--
//for subscene
var water;
var group;
var targetRotationX = 0;
var targetRotationOnMouseDownX = 0;

var targetRotationY = 0;
var targetRotationOnMouseDownY = 0;

var mouseX = 0;
var mouseXOnMouseDown = 0;

var mouseY = 0;
var mouseYOnMouseDown = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var finalRotationY;

var isSubScene = false;
//--
var getRatio = window.innerWidth / window.innerHeight;

// var reader = new XMLHttpRequest() || new ActiveXObject('MSXML2.XMLHTTP');
var standalone = window.navigator.standalone,
    userAgent = window.navigator.userAgent.toLowerCase(),
    safari = /safari/.test(userAgent),
    ios = /iphone|ipod|ipad/.test(userAgent);

var gestures;
var isDrag = false;

var loadingManager = new THREE.LoadingManager();

loadingManager.onLoad = function () {

    document.getElementById("btn-manual").style.display = "block";
    document.getElementById("pleasewaitcontainer").style.display = "none";
    console.log("Loading success!");
    animate();

};

loadingManager.onError = function (url) {

    console.log('There was an error loading ' + url);

};

init();
//animate();

function init() {
    mainContainer = document.getElementById('main-container');
    subContainer = document.getElementById('sub-scene');

    group = new THREE.Object3D();
    clock = new THREE.Clock();
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    mainScene = new THREE.Scene();
    subScene = new THREE.Scene();

    mainRenderer = new THREE.WebGLRenderer({
        antialias: false,
        alpha: true
    });

    subRenderer = new THREE.WebGLRenderer({
        antialias: false,
        alpha: true
    });

    mainCamera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 10000);
    mainCamera.target = new THREE.Vector3(0, 0, 0);
    mainCamera.position.z = -2 * 100 / 4;
    mainScene.add(mainCamera);

    subCamera = new THREE.PerspectiveCamera(55, window.innerWidth * 0.8 / window.innerHeight * 0.95, 0.1, 10000);

    mainRenderer.setPixelRatio(window.devicePixelRatio);
    mainRenderer.setSize(window.innerWidth, window.innerHeight);
    // mainRenderer.physicallyCorrectLights = true;
    // mainRenderer.toneMappingExposure = 1.1;

    mainRenderer.shadowMap.enabled = true;

    mainContainer.appendChild(mainRenderer.domElement);



    initAllItems();
    //sub
    subRenderer.setPixelRatio(window.devicePixelRatio);
    subRenderer.setSize(window.innerWidth * 0.8, window.innerHeight * 0.95);

    // subRenderer.gammaOutput = true;
    // subRenderer.gammaFactor = 1.5;
    subRenderer.shadowMap.enabled = true;
    // subRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
    // subRenderer.shadowMapSoft = true;

    subContainer.appendChild(subRenderer.domElement);

    //interacting panorama

    mainContainer.addEventListener('touchstart', (event) => {
        event.preventDefault();
        onMouseDown(event.touches[0]);
    }, { passive: false });
    subContainer.addEventListener('touchstart', (event) => {
        event.preventDefault();
        onDocumentMouseDown(event.touches[0]);
    }, { passive: false });
    document.addEventListener('mousedown', onPointerStart, false);
    document.addEventListener('mousemove', onPointerMove, false);
    document.addEventListener('mouseup', onPointerUp, false);
    document.addEventListener('wheel', onDocumentMouseWheel, false);
    document.addEventListener('touchstart', onPointerStart, false);
    document.addEventListener('touchmove', onPointerMove, false);
    document.addEventListener('touchend', onPointerUp, false);
    //touch mouse
    window.addEventListener('mousemove', onTouchMove);
    window.addEventListener('touchmove', onTouchMove);

    //for subscene
    subContainer.addEventListener('mousedown', onDocumentMouseDown, false);
    subContainer.addEventListener('touchstart', onDocumentTouchStart, false);
    subContainer.addEventListener('touchmove', onDocumentTouchMove, false);
    //resize window
    window.addEventListener('resize', onWindowResize, false);
    //click objects
    window.addEventListener('contextmenu', onContextMenu, false);
    mainContainer.addEventListener("mousedown", onMouseDown, false);

    //keycode
    document.addEventListener("keydown", onDocumentKeyDown);
    document.addEventListener("keyup", onDocumentKeyUp);

    gestures = new Hammer(subRenderer.domElement);
    // gestures.on("tap", onMouseDown);
    gestures.get("pan").set({ direction: Hammer.DIRECTION_ALL });
    gestures.get("pinch").set({ enable: true });
    gestures.on('pinch', onDocumentMouseWheel);

}
function initAllItems() {

    addLights();
    addSkybox();
    Room();
    Hienvat("Hienvat/Hienvat01/phong01.hienvat01.model01", "Hienvat/Hienvat01/phong01.hienvat01.texture01", "Hienvat/Hienvat01/phong01.hienvat01.normalmap01", "Hienvat/Hienvat01/phong01.hienvat01.aomap01", "Hienvat/Hienvat01/phong01.hienvat01.metalnessmap01", "Hienvat/Hienvat01/phong01.hienvat01.roughnessmap01", 0, -5, 100, -Math.PI, "Hienvat/Hienvat01/phong01.hienvat01.scale01", "Hienvat/Hienvat01/phong01.hienvat01.boom.jpg", "Hienvat/Hienvat01/phong01.hienvat01.audio01.mp3", "Hienvat/Hienvat01/phong01.hienvat01.text01", "Hienvat/Hienvat01/phong01.hienvat01.name01", "hienvat", 0);
    addVideo(29.5, 18.5, "phong01.video01.video01", "phong01.video01.background01");
    drawPicture();



}
function onContextMenu(event) {

    event.preventDefault();

}
function onMouseDown(event) {
    // event.preventDefault();

    if (isSubScene == false) {
        var canvasBounds = mainRenderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - canvasBounds.left) / (canvasBounds.right - canvasBounds.left)) * 2 - 1;
        mouse.y = - ((event.clientY - canvasBounds.top) / (canvasBounds.bottom - canvasBounds.top)) * 2 + 1;

        raycaster.setFromCamera(mouse, mainCamera);

        var intersects = raycaster.intersectObjects(objects, true);
        {
            if (intersects.length > 0) {
                selectedObject = intersects[0].object;
                if (intersects[0].object.name == 'video1' && isClickObjects == true) {
                    isShowVideo = true;

                    isClickObjects = false;
                    isKeycode = false;

                }
                else if (intersects[0].object.name == 'tranh' && isClickObjects == true) {
                    isShowPicture = true;

                    isClickObjects = false;
                    isKeycode = false;
                }
                else if (intersects[0].object.name == 'hienvat' && isClickObjects == true) {
                    isShowModel = true;

                    isClickObjects = false;
                    isKeycode = false;
                }

                else if (intersects[0].object.name == 'floor' && camPos == null && isPlane == true) {
                    isMove = true;
                    camPos = new THREE.Vector3(mainCamera.position.x, mainCamera.position.y, mainCamera.position.z);
                    targetPos = new THREE.Vector3(intersects[0].point.x, mainCamera.position.y, intersects[0].point.z);
                }

            }
            else {
                camPos = null;
            }
        }
    }

}
function onTouchMove(event) {
    if (isSubScene == false) {
        var canvasBounds = mainRenderer.domElement.getBoundingClientRect();

        mouse.x = ((event.clientX - canvasBounds.left) / (canvasBounds.right - canvasBounds.left)) * 2 - 1;
        mouse.y = - ((event.clientY - canvasBounds.top) / (canvasBounds.bottom - canvasBounds.top)) * 2 + 1;

        raycaster.setFromCamera(mouse, mainCamera);

        var intersects = raycaster.intersectObjects(objects, true);

        if (intersects.length > 0) {
            var selectedObject = intersects[0].object;
            if (intersects[0].object.name == 'tranh' || intersects[0].object.name == 'hienvat') {
                document.getElementById("object-name").style.display = "block";
                document.getElementById("text-name").innerHTML = selectedObject.userData[3];
            }
            else
                document.getElementById("object-name").style.display = "none";
        }
        else
            document.getElementById("object-name").style.display = "none";;
    }

}
// Add event listeners for player movement key presses
function onDocumentKeyDown(event) {
    switch (event.keyCode) {
        case 27: //escape
            hideInfo();
            break;
        case 38: // up
        case 87: // w
            moveForward = true;
            break;
        case 37: // left
        case 65: // a
            moveLeft = true;
            break;
        case 40: // down
        case 83: // s
            moveBackward = true;
            break;
        case 39: // right
        case 68: // d
            moveRight = true;
            break;
        case 32: // space
            // if ( canJump === true ) velocity.y += 350-150;
            // canJump = false;
            break;
    }

    isMove = true;
    animate();
}
function onDocumentKeyUp(event) {
    switch (event.keyCode) {
        case 38: // up
        case 87: // w
            moveForward = false;
            break;
        case 37: // left
        case 65: // a
            moveLeft = false;
            break;
        case 40: // down
        case 83: // s
            moveBackward = false;
            break;
        case 39: // right
        case 68: // d
            moveRight = false;
            break;
    }

    if (!moveBackward && !moveForward && !moveLeft && !moveRight) {
        isMove = false;
    }
}

function animatePlayer(delta) {
    var intersections = raycaster.intersectObjects(obj);

    var onObject = intersections.length > 0;

    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;
    velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass
    direction.z = Number(moveForward) - Number(moveBackward);
    direction.x = Number(moveLeft) - Number(moveRight);
    direction.normalize(); //

    if (detectPlayerCollision() == false && isKeycode == true) {

        if (moveForward || moveBackward) velocity.z -= direction.z * 400.0 * delta;
        if (moveLeft || moveRight) velocity.x -= direction.x * 400.0 * delta;
        if (onObject === true) {
            velocity.y = Math.max(0, velocity.y);
            canJump = true;
        }
        mainCamera.translateX(velocity.x * delta);
        mainCamera.position.y += (velocity.y * delta);
        mainCamera.translateZ(velocity.z * delta);
        if (mainCamera.position.y < 10 / 10) {
            velocity.y = 0;
            mainCamera.position.y = 10 / 10;
            canJump = true;
        }
    }
    else {

        velocity.x = 0;
        velocity.z = 0;
    }
}

function detectPlayerCollision() {

    var rotationMatrix;

    var cameraDirection = mainCamera.getWorldDirection(new THREE.Vector3(0, 0, 0)).clone();

    if (moveBackward) {
        rotationMatrix = new THREE.Matrix4();
        rotationMatrix.makeRotationY(degreesToRadians(180));
    }
    else if (moveLeft) {
        rotationMatrix = new THREE.Matrix4();
        rotationMatrix.makeRotationY(degreesToRadians(90));
    }
    else if (moveRight) {
        rotationMatrix = new THREE.Matrix4();
        rotationMatrix.makeRotationY(degreesToRadians(270));
    }


    if (rotationMatrix !== undefined) {
        cameraDirection.applyMatrix4(rotationMatrix);
    }


    var rayCaster = new THREE.Raycaster(mainCamera.position, cameraDirection);


    if (rayIntersect(rayCaster, PLAYERCOLLISIONDISTANCE)) {
        return true;
    } else {
        return false;
    }
}

function rayIntersect(ray, distance) {
    var intersects = ray.intersectObjects(collidableObjects, true);
    for (var i = 0; i < intersects.length; i++) {
        if (intersects[i].distance < distance) {
            return true;
        }
    }
    return false;
}
function degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
}
function addLights() {
    var light = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.8);
    light.position.set(0, 100, 0);
    mainScene.add(light);

    var light = new THREE.DirectionalLight(0xffffff, 0.75);
    light.position.set(0, 200, 100);
    // light.castShadow = true;
    light.shadow.camera.top = 180;
    light.shadow.camera.bottom = - 100;
    light.shadow.camera.left = - 120;
    light.shadow.camera.right = 120;
    mainScene.add(light);


    //for subscene
    var light = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.75);
    light.position.set(0, 10, 0);
    subScene.add(light);

    var light = new THREE.DirectionalLight(0xffffff, 0.75);
    light.position.set(0, 10, 0);
    // light.castShadow = true;
    light.shadow.camera.top = 180;
    light.shadow.camera.bottom = - 100;
    light.shadow.camera.left = - 120;
    light.shadow.camera.right = 120;
    subScene.add(light);
}
function addSkybox() {
    var _r = "assets/textures/skyboxs/";
    var urls = [
        _r + "px.jpg", _r + "nx.jpg",
        _r + "py.jpg", _r + "ny.jpg",
        _r + "pz.jpg", _r + "nz.jpg"
    ];
    var envmap = new THREE.CubeTextureLoader().load(urls);
    mainScene.background = envmap;
    subScene.background = envmap;

}
function Room() {

    var loadhouse = new THREE.FBXLoader(loadingManager);
    loadhouse.load('assets/models/p.chauban.bandoco.1.5.fbx', function (object) {
        ROOM = object;
        ROOM.traverse(function (child) {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;

                child.matrixAutoUpdate = false;
            }
        });
        ROOM.position.set(0, -15, 0);
        ROOM.scale.multiplyScalar(0.1);
        mainScene.add(ROOM);
        for (var i = 0; i < ROOM.children.length; i++) {
            objects.push(ROOM.children[i]);
            collidableObjects.push(ROOM.children[i]);
        }

    });


}


function drawPicture() {
    var Arts = [
        //right
        addPicture(16.5, 12.5, -55.48, 4.1, 61.35, Math.PI / 2, "Tranh/Tranh01/phong01.tranh01.picture01.jpg", "Tranh/Tranh01/phong01.tranh01.audio01.mp3", "Tranh/Tranh01/phong01.tranh01.name01", "Tranh/Tranh01/phong01.tranh01.text01"),
        addPicture(16.5, 12.5, -55.48, 4.1, 41.65, Math.PI / 2, "Tranh/Tranh02/phong01.tranh02.picture01.jpg", "Tranh/Tranh02/phong01.tranh02.audio01.mp3", "Tranh/Tranh02/phong01.tranh02.name01", "Tranh/Tranh02/phong01.tranh02.text01"),
        addPicture(12.75, 17.5, -55.48, 2.1, 21.75, Math.PI / 2, "Tranh/Tranh03/phong01.tranh03.picture01.jpg", "Tranh/Tranh03/phong01.tranh03.audio01.mp3", "Tranh/Tranh03/phong01.tranh03.name01", "Tranh/Tranh03/phong01.tranh03.text01"),

        addPicture(16.5, 12.5, -55.48, 4.1, -51.75, Math.PI / 2, "Tranh/Tranh04/phong01.tranh04.picture01.jpg", "Tranh/Tranh04/phong01.tranh04.audio01.mp3", "Tranh/Tranh04/phong01.tranh04.name01", "Tranh/Tranh04/phong01.tranh04.text01"),
        addPicture(12.75, 17.5, -55.48, 2.1, -71.7, Math.PI / 2, "Tranh/Tranh05/phong01.tranh05.picture01.jpg", "Tranh/Tranh05/phong01.tranh05.audio01.mp3", "Tranh/Tranh05/phong01.tranh05.name01", "Tranh/Tranh05/phong01.tranh05.text01"),
        addPicture(12.75, 17.5, -55.48, 2.1, -91.0, Math.PI / 2, "Tranh/Tranh06/phong01.tranh06.picture01.jpg", "Tranh/Tranh06/phong01.tranh06.audio01.mp3", "Tranh/Tranh06/phong01.tranh06.name01", "Tranh/Tranh06/phong01.tranh06.text01"),

        addPicture(16.5, 12.5, 44, 5.70, -106.35, -(Math.PI / 2), "Tranh/Tranh07/phong01.tranh07.picture01.jpg", "Tranh/Tranh07/phong01.tranh07.audio01.mp3", "Tranh/Tranh07/phong01.tranh07.name01", "Tranh/Tranh07/phong01.tranh07.text01"),
        addPicture(16.5, 12.5, 44, 5.70, -40.55, -(Math.PI / 2), "Tranh/Tranh08/phong01.tranh08.picture01.jpg", "Tranh/Tranh08/phong01.tranh08.audio01.mp3", "Tranh/Tranh08/phong01.tranh08.name01", "Tranh/Tranh08/phong01.tranh08.text01"),

        addPicture(16.5, 12.5, 44, 5.70, 10.40, -(Math.PI / 2), "Tranh/Tranh09/phong01.tranh09.picture01.jpg", "Tranh/Tranh09/phong01.tranh09.audio01.mp3", "Tranh/Tranh09/phong01.tranh09.name01", "Tranh/Tranh09/phong01.tranh09.text01")
    ];
}
function addVideo(width, height, videoUrl, imageUrl) {
    video = document.createElement('video');
    video.src = "Video/Video1/" + videoUrl + ".mp4";
    video.load();

    var text = new THREE.TextureLoader(loadingManager);
    var texture = text.load("Video/Video1/" + imageUrl + ".jpg");

    var imageObject = new THREE.Mesh(
        new THREE.PlaneGeometry(width, height),
        new THREE.MeshBasicMaterial({ map: texture }));

    imageObject.position.set(-49.45, 2.65, 0);
    imageObject.rotation.y = Math.PI / 2;
    mainScene.add(imageObject);
    imageObject.name = "video1";
    objects.push(imageObject);

    imageObject.matrixAutoUpdate = false;
    imageObject.updateMatrix();
}

function addPicture(width, height, posX, posY, posZ, rotateY, picUrl, audioUrl, objectName, infoText) {
    var text = new THREE.TextureLoader(loadingManager);
    var image3DArtTexture = text.load(picUrl, function (sizeImage) {
        var image3DArtGeometry = new THREE.PlaneGeometry(width, height, 0, 0);
        var loader = new THREE.FileLoader(loadingManager);
        loader.load(objectName + '.txt', function (data) {
            var readFile = new THREE.FileLoader(loadingManager);
            loader.load(infoText + '.txt', function (data2) {
                var image3DArtMaterial = new THREE.MeshBasicMaterial({ map: image3DArtTexture });
                var image3DArt = new THREE.Mesh(image3DArtGeometry, image3DArtMaterial);
                image3DArt.position.y = posY;
                image3DArt.position.z = posZ + 14.8;
                image3DArt.position.x = posX + 5.7;//-75+5.7
                image3DArt.rotation.y = rotateY;
                objectDescription = [];
                objectDescription[0] = audioUrl;
                objectDescription[1] = data2;
                objectDescription[2] = picUrl;
                objectDescription[3] = data;
                image3DArt.userData = objectDescription;
                image3DArt.name = 'tranh';
                mainScene.add(image3DArt);
                image3DArt.matrixAutoUpdate = false;
                image3DArt.updateMatrix();
                objects.push(image3DArt);
                collidableObjects.push(image3DArt);
            });
        });
    });
    image3DArtTexture.minFilter = THREE.LinearFilter;

}
function Hienvat(urlModel, text, normal, ao, metalness, roughness, posX, posY, posZ, rotateY, dataScale, picUrl, audioUrl, infoText, objectName, tagName, views) {

    var texture = new THREE.TextureLoader(loadingManager);
    var material = texture.load(text + ".jpg");
    var ao = texture.load(ao + ".jpg");
    var normal = texture.load(normal + ".jpg");
    var metalness = texture.load(metalness + ".jpg");
    var roughness = texture.load(roughness + ".jpg");

    var loader = new THREE.FileLoader(loadingManager);
    loader.load(objectName + '.txt', function (name) {

        var loadtext = new THREE.FileLoader(loadingManager);
        loadtext.load(infoText + '.txt', function (info) {
            var loadscale = new THREE.FileLoader(loadingManager);
            loadscale.load(dataScale + '.txt', function (getscale) {
                var fbxLoader = new THREE.FBXLoader(loadingManager);
                fbxLoader.load(urlModel + '.fbx', (object) => {
                    var hienvat = object;
                    hienvat.traverse(function (child) {
                        if (child.isMesh) {
                            // child.castShadow = true;
                            // child.receiveShadow = true;
                            child.material = new THREE.MeshStandardMaterial({ map: material, normalMap: normal, aoMap: ao, metalnessMap: metalness, roughnessMap: roughness, roughness: 1, metalness: 1 });
                        }
                    });
                    hienvat.scale.multiplyScalar(Number(getscale));
                    hienvat.rotation.y = rotateY;

                    objectDescription = [];
                    objectDescription[0] = audioUrl;
                    objectDescription[1] = info;
                    objectDescription[2] = picUrl;
                    objectDescription[3] = name;
                    objectDescription[4] = urlModel.substr(0, urlModel.length - 7);
                    objectDescription[5] = views;
                    objectDescription[6] = hienvat.clone();

                    for (var i = 0; i < hienvat.children.length; i++) {
                        hienvat.children[i].userData = objectDescription;
                        hienvat.children[i].name = tagName;
                        // objects.push(hienvat.children[i]);
                    }
                    var model = new THREE.Object3D();
                    model.add(hienvat);
                    model.position.set(posX, posY, posZ);
                    mainScene.add(model);
                    collidableObjects.push(model);
                });
            });

        });

    });

}

function hideInfo() {
    document.getElementById("btn-screen").style.display = "block";
    document.getElementById("sub-container").style.display = "none";
    document.getElementById("popup2D").style.display = "none";
    document.getElementById('sound').pause();
    document.getElementById('sound-model').pause();

    document.getElementById("my-video").style.display = "none";
    document.getElementById("myvideo").pause();

    zoomOut();

    isSubScene = false;
    isClickObjects = true;
    isPlane = true;
    flag = false;

    afterClickObject = true;

    isKeycode = true;
}
function zoomIn(e) {
    // body...
    if (isDrag == true) {
        var frame = document.getElementById('frame');
        var zoomer = e.currentTarget;
        e.offsetX ? offsetX = e.offsetX : offsetX = e.touches[0].pageX;
        e.offsetY ? offsetY = e.offsetY : offsetX = e.touches[0].pageX;
        x = (offsetX / zoomer.offsetWidth) * 100;
        y = (offsetY / zoomer.offsetHeight) * 100;
        zoomer.style.backgroundPosition = x + "%" + y + "%";
    }

}
function zoom() {
    // body...
    var frame = document.getElementById('frame');
    with (frame.style) {
        backgroundSize = "200%";
    }
    isDrag = true;
}
function zoomOut() {
    // body...
    isDrag = false;
    var frame = document.getElementById('frame');
    with (frame.style) {
        backgroundSize = "contain";
        backgroundPosition = "center center";
        position = "absolute";
        width = "100%";
        height = "90%";
        top = "40px";
        // left = "0px";
    }
}
// function zoom(e) {
//     var frame = document.getElementById('frame');
//     with (frame.style)
//     {
//         backgroundSize = "180%";
//     }
//     var zoomer = e.currentTarget;
//     e.offsetX ? offsetX = e.offsetX : offsetX = e.touches[0].pageX;
//     e.offsetY ? offsetY = e.offsetY : offsetX = e.touches[0].pageX;
//     x = (offsetX / zoomer.offsetWidth) * 100;
//     y = (offsetY / zoomer.offsetHeight) * 100;
//     zoomer.style.backgroundPosition = x + "%" + y + "%";
// }
// function mouseOver(){
//     var frame = document.getElementById('frame');
//     with (frame.style)
//     {
//         backgroundSize ="contain";
//         backgroundPosition = "center center";
//         position = "absolute";
//         width = "100%";
//         height = "90%";
//         top = "40px";
//         // left = "0px";
//     }
//  }

function onWindowResize() {
    mainCamera.aspect = window.innerWidth / window.innerHeight;
    mainCamera.updateProjectionMatrix();
    mainRenderer.setSize(window.innerWidth, window.innerHeight);

    subCamera.aspect = window.innerWidth * 0.8 / window.innerHeight * 0.95;
    subCamera.updateProjectionMatrix();
    subRenderer.setSize(window.innerWidth * 0.8, window.innerHeight * 0.95);
    animate();
}
//
function onPointerStart(event) {
    // event.preventDefault();
    if (isSubScene === true || flag === true) {
        isUserInteracting = false;
    }
    else {
        // event.preventDefault(); ????
        isUserInteracting = true;
        animate();
        var clientX = event.clientX || event.touches[0].clientX;
        var clientY = event.clientY || event.touches[0].clientY;
        onMouseDownMouseX = clientX;
        onMouseDownMouseY = clientY;
        onMouseDownLon = lon;
        onMouseDownLat = lat;
    }

}
function onPointerMove(event) {
    // event.preventDefault();
    if (afterClickObject === true) {
        if (isUserInteracting === true) {
            // event.preventDefault(); ????
            var clientX = event.clientX || event.touches[0].clientX;
            var clientY = event.clientY || event.touches[0].clientY;
            lon = (onMouseDownMouseX - clientX) * 0.1 + onMouseDownLon;
            lat = (clientY - onMouseDownMouseY) * 0.1 + onMouseDownLat;
            //for click mouse plane
            camPos = null;
            isMove = false;
            hideInfo();
            isShowVideo = false;
            isShowPicture = false;
            isShowModel = false;
        }
    }


}
function onPointerUp() {
    // event.preventDefault();
    isUserInteracting = false;
}
function onDocumentMouseWheel(event) {
    var fov = subCamera.fov + event.deltaY * 0.05;
    subCamera.fov = THREE.Math.clamp(fov, 5, 75);
    subCamera.updateProjectionMatrix();
}

var deltaTime = 1000 / 70;
var curTime = Date.now();
var prevTime = curTime;

function animate() {
    curTime = Date.now();
    if (curTime > prevTime + deltaTime) {
        render();
        prevTime = curTime;
    }

    if (isUserInteracting === true || isMove === true) {

        requestAnimationFrame(animate);

    }
}
function render() {
    // var delta = clock.getDelta();
    animatePlayer(0.03);
    //interacting room
    lat = Math.max(- 85, Math.min(85, lat));
    phi = THREE.Math.degToRad(90 - lat);
    theta = THREE.Math.degToRad(90 + lon);
    mainCamera.target.x = 500 * Math.sin(phi) * Math.cos(theta);
    mainCamera.target.y = 500 * Math.cos(phi);
    mainCamera.target.z = 500 * Math.sin(phi) * Math.sin(theta);
    mainCamera.lookAt(mainCamera.target);
    //--
    //for movement mouse click
    if (camPos !== null && isUserInteracting === false) {
        camPos.lerp(targetPos, 0.06);
        mainCamera.position.copy(camPos);

        var checkerX1 = parseFloat(mainCamera.position.x).toFixed(0);
        var checkerX2 = parseFloat(targetPos.x).toFixed(0);
        var checkerZ1 = parseFloat(mainCamera.position.z).toFixed(0);
        var checkerZ2 = parseFloat(targetPos.z).toFixed(0);

        if (checkerX1 == "-0") { checkerX1 = "0"; }

        if (checkerX1 == checkerX2 && checkerZ1 == checkerZ2) {
            camPos = null;
            targetPos = null;
            isMove = false;
        }
    }
    else if (isShowVideo == true && isUserInteracting == false) {
        document.getElementById("my-video").style.display = "block";
        document.getElementById("myvideo").play();

        isShowVideo = false;
        afterClickObject = false;

    }
    else if (isShowPicture == true && isUserInteracting == false) {

        document.getElementById("popup2D").style.display = "block";
        document.getElementById("infotext").innerHTML = selectedObject.userData[1];

        var img = "url" + "(" + selectedObject.userData[2] + ")";
        document.getElementById("frame").style.backgroundImage = img;

        var sound = document.getElementById('sound');
        sound.src = selectedObject.userData[0];
        sound.controls = 'controls';
        sound.play();

        isShowPicture = false;
        afterClickObject = false;
    }
    else if (isShowModel == true && isUserInteracting == false) {
        document.getElementById("sub-container").style.display = "block";
        group.remove(group.children[0]);
        var hv = selectedObject.userData[6];
        hv.position.set(0, 0, 0);

        const box = new THREE.Box3().setFromObject(hv);
        const size = box.getSize(new THREE.Vector3()).length();
        const center = box.getCenter(new THREE.Vector3());

        hv.position.x += (hv.position.x - center.x);
        hv.position.y += (hv.position.y - center.y);
        hv.position.z += (hv.position.z - center.z);

        subCamera.near = size / 100;
        subCamera.far = size * 100;
        subCamera.updateProjectionMatrix();


        subCamera.position.copy(center);
        subCamera.position.x += size / 2.0;
        subCamera.position.y += size / 5.0;
        subCamera.position.z += size / 0.75;
        subCamera.lookAt(new THREE.Vector3());

        group.add(hv);
        subScene.add(subCamera);
        subScene.add(group);

        document.getElementById("info-model").innerHTML = selectedObject.userData[1];

        var soundM = document.getElementById('sound-model');
        soundM.src = selectedObject.userData[0];
        soundM.controls = 'controls';
        soundM.play();

        isSubScene = true;
        isShowModel = false;
        afterClickObject = false;
    }
    //--
    //for subscene
    group.rotation.y += (targetRotationX - group.rotation.y) * 0.1;
    //vertical rotation 
    finalRotationY = (targetRotationY - group.rotation.x);

    if (group.rotation.x <= 1 && group.rotation.x >= -1) {

        group.rotation.x += finalRotationY * 0.1;
    }
    if (group.rotation.x > 1) {

        group.rotation.x = 1
    }
    else if (group.rotation.x < -1) {

        group.rotation.x = -1
    }

    if (!isSubScene) {
        mainRenderer.render(mainScene, mainCamera);
    }
    else {
        subRenderer.render(subScene, subCamera);
    }

}
//fullscreen
var elem = document.documentElement;
function openFullscreen() {
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { /* Firefox */
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE/Edge */
        elem.msRequestFullscreen();
    }

    document.getElementById("btn-fullscreen").style.display = "none";
    document.getElementById("btn-closedscreen").style.display = "block";

    camPos = null;
}

function closeFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
    document.getElementById("btn-fullscreen").style.display = "block";
    document.getElementById("btn-closedscreen").style.display = "none";

    camPos = null;
}
//onload scene
document.getElementById("btn-manual").onclick = function () {
    document.getElementById("pleasewait").style.display = "none";
    document.getElementById("btn-manual").style.display = "none";
    document.getElementById("btn-screen").style.display = "block";
    document.getElementById("btn-fullscreen").style.display = "block";
    document.getElementById("myModal").style.display = "block";
    animate();
};
document.getElementsByClassName("close")[0].onclick = function () {

    isKeycode = true;
    document.getElementById("myModal").style.display = "none";

    flag = false;
    isPlane = true;
    isClickObjects = true;
}
document.getElementById("btn-intruction").onclick = function () {
    document.getElementById("myModal").style.display = "block";

    flag = true;
    isPlane = false;
    isClickObjects = false;

    isKeycode = false;
};
document.getElementById("btn-setting").onclick = function () {

};
document.getElementById("btn-resetposition").onclick = function () {
    camPos = new THREE.Vector3(mainCamera.position.x, mainCamera.position.y, mainCamera.position.z);
    targetPos = new THREE.Vector3(0, mainCamera.position.y, 0);
    camPos.lerp(targetPos, 0.06);
    mainCamera.position.copy(camPos);
    isMove = true;
    animate();
};
//for sub scene
function openNav() {
    document.getElementById("mySidepanel").style.width = "250px";
    document.getElementById("mySidepanel").style.height = "95%";
}

function closeNav() {
    document.getElementById("mySidepanel").style.width = "0";
}
//event for subscene
function onDocumentMouseDown(event) {
    // event.preventDefault();

    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('mouseup', onDocumentMouseUp, false);
    document.addEventListener('mouseout', onDocumentMouseOut, false);

    mouseXOnMouseDown = event.clientX - windowHalfX;
    targetRotationOnMouseDownX = targetRotationX;

    mouseYOnMouseDown = event.clientY - windowHalfY;
    targetRotationOnMouseDownY = targetRotationY;

}

function onDocumentMouseMove(event) {

    mouseX = event.clientX - windowHalfX;
    mouseY = event.clientY - windowHalfY;

    targetRotationY = targetRotationOnMouseDownY + (mouseY - mouseYOnMouseDown) * 0.005;
    targetRotationX = targetRotationOnMouseDownX + (mouseX - mouseXOnMouseDown) * 0.005;
}

function onDocumentMouseUp(event) {

    document.removeEventListener('mousemove', onDocumentMouseMove, false);
    document.removeEventListener('mouseup', onDocumentMouseUp, false);
    document.removeEventListener('mouseout', onDocumentMouseOut, false);

}

function onDocumentMouseOut(event) {

    document.removeEventListener('mousemove', onDocumentMouseMove, false);
    document.removeEventListener('mouseup', onDocumentMouseUp, false);
    document.removeEventListener('mouseout', onDocumentMouseOut, false);

}

function onDocumentTouchStart(event) {

    if (event.touches.length == 1) {
        // event.preventDefault();
        mouseXOnMouseDown = event.touches[0].pageX - windowHalfX;
        targetRotationOnMouseDownX = targetRotationX;

        mouseYOnMouseDown = event.touches[0].pageY - windowHalfY;
        targetRotationOnMouseDownY = targetRotationY;
    }

}

function onDocumentTouchMove(event) {

    if (event.touches.length == 1) {
        // event.preventDefault();
        mouseX = event.touches[0].pageX - windowHalfX;
        targetRotationX = targetRotationOnMouseDownX + (mouseX - mouseXOnMouseDown) * 0.05;

        mouseY = event.touches[0].pageY - windowHalfY;
        targetRotationY = targetRotationOnMouseDownY + (mouseY - mouseYOnMouseDown) * 0.05;
    }
}


