
var mainScene, subScene, mainRenderer, subRenderer, mainCamera, subCamera;
var directionalLightMain, directionalLightSub;
var controls;
var mainContainer;
var ROOM, group;
var video;
var objects = [];
var Arts;
var raycaster, mouse;
// var selectedObject;
var objectDescription;

var currentPos;
var camPos = null;
var targetPos = null;

var t = 0;
var isOnclick = false;
var isSubScene = false;
var water;

var standalone = window.navigator.standalone,
    userAgent = window.navigator.userAgent.toLowerCase(),
    safari = /safari/.test(userAgent),
    ios = /iphone|ipod|ipad/.test(userAgent);

init();
//animate();

var loadingManager = new THREE.LoadingManager();
loadingManager.onLoad = function () {

    document.getElementById("btn-automatic").style.display = "block";
    document.getElementById("pleasewaitcontainer").style.display = "none";
    animate();

};

loadingManager.onError = function (url) {

    console.log('There was an error loading ' + url);

};

function init() {
    mainContainer = document.getElementById('main-container');
    subContainer = document.getElementById('sub-scene');

    group = new THREE.Object3D();
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

    mainCamera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 10000);
    mainCamera.position.z = -50;

    subCamera = new THREE.PerspectiveCamera(55, window.innerWidth * 0.8 / window.innerHeight * 0.95, 0.1, 10000);
    //main
    mainRenderer.setPixelRatio(window.devicePixelRatio);
    mainRenderer.setSize(window.innerWidth, window.innerHeight);
    mainRenderer.shadowMap.enabled = true;

    mainContainer.appendChild(mainRenderer.domElement);




    initAllItems();
    //sub
    subRenderer.setPixelRatio(window.devicePixelRatio);
    subRenderer.setSize(window.innerWidth * 0.8, window.innerHeight * 0.95);

    subRenderer.shadowMap.enabled = true;
    subRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
    subRenderer.shadowMapSoft = true;

    subContainer.appendChild(subRenderer.domElement);

    controls = new THREE.OrbitControls(mainCamera, mainRenderer.domElement);
    controls.enableZoom = false;

    currentPos = this.mainCamera.position;

    window.addEventListener('resize', onWindowResize, false);
}
function initAllItems() {

    addLights();
    addSkybox();
    Room();
    drawPicture();


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
    var light = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.8);
    light.position.set(0, 100, 0);
    subScene.add(light);

    var light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0, 200, 100);
    // light.castShadow = true;
    light.shadow.camera.top = 180;
    light.shadow.camera.bottom = - 100;
    light.shadow.camera.left = - 120;
    light.shadow.camera.right = 120;
    subScene.add(light);
    // var hemiLightSub = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
    // subScene.add( hemiLightSub );
    directionalLightSub = new THREE.DirectionalLight(0xffffff, 0.5);
    // subScene.add( directionalLightSub );
}
function Room() {
    var loadhouse = new THREE.FBXLoader(loadingManager);
    loadhouse.load('assets/models/p.chauban.bandoco.1.5.fbx', function (object) {
        ROOM = object;
        ROOM.traverse(function (child) {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                // child.material.envMap = envmap;
                child.matrixAutoUpdate = false;
            }
        });
        ROOM.position.set(0, -15, 0);
        ROOM.scale.multiplyScalar(0.1);
        mainScene.add(ROOM);


    });

}
function childRoom(childMesh, urlMap, urlNormal, urlAomap, urlRoughness) {
    var uvs = childMesh.geometry.attributes.uv.array;
    childMesh.geometry.addAttribute('uv2', new THREE.BufferAttribute(uvs, 2));

    var map = new THREE.TextureLoader().load('assets/textures/materials/room/' + urlMap + '.jpg');
    var normalMap = new THREE.TextureLoader().load('assets/textures/materials/room/' + urlNormal + '.jpg');
    var aoMap = new THREE.TextureLoader().load('assets/textures/materials/room/' + urlAomap + '.jpg');
    var roughnessMap = new THREE.TextureLoader().load('assets/textures/materials/room/' + urlRoughness + '.jpg');
    childMesh.material = new THREE.MeshStandardMaterial({
        map: map,
        normalMap: normalMap,
        aoMap: aoMap,
        roughnessMap: roughnessMap,
    });

    return childMesh;
}
function drawPicture() {

    Hienvat("Hienvat/Hienvat01/phong01.hienvat01.model01", "Hienvat/Hienvat01/phong01.hienvat01.texture01", "Hienvat/Hienvat01/phong01.hienvat01.normalmap01", "Hienvat/Hienvat01/phong01.hienvat01.aomap01", "Hienvat/Hienvat01/phong01.hienvat01.metalnessmap01", "Hienvat/Hienvat01/phong01.hienvat01.roughnessmap01", 0, -5, 100, Math.PI, "Hienvat/Hienvat01/phong01.hienvat01.scale01", "Hienvat/Hienvat01/phong01.hienvat01.boom.jpg", "Hienvat/Hienvat01/phong01.hienvat01.audio01.mp3", "Hienvat/Hienvat01/phong01.hienvat01.text01", "Hienvat/Hienvat01/phong01.hienvat01.name01", "hienvat");
    addVideo(29.5, 18.5, "phong01.video01.video01", "phong01.video01.background01", "video", 0);

    addPicture(16.5, 12.5, -55.48, 4.1, 61.35, Math.PI / 2, "Tranh/Tranh01/phong01.tranh01.picture01.jpg", "Tranh/Tranh01/phong01.tranh01.audio01.mp3", "Tranh/Tranh01/phong01.tranh01.name01", "Tranh/Tranh01/phong01.tranh01.text01", 1),
        addPicture(16.5, 12.5, -55.48, 4.1, 41.65, Math.PI / 2, "Tranh/Tranh02/phong01.tranh02.picture01.jpg", "Tranh/Tranh02/phong01.tranh02.audio01.mp3", "Tranh/Tranh02/phong01.tranh02.name01", "Tranh/Tranh02/phong01.tranh02.text01", 2),
        addPicture(12.75, 17.5, -55.48, 2.1, 21.75, Math.PI / 2, "Tranh/Tranh03/phong01.tranh03.picture01.jpg", "Tranh/Tranh03/phong01.tranh03.audio01.mp3", "Tranh/Tranh03/phong01.tranh03.name01", "Tranh/Tranh03/phong01.tranh03.text01", 3),

        addPicture(16.5, 12.5, -55.48, 4.1, -51.75, Math.PI / 2, "Tranh/Tranh04/phong01.tranh04.picture01.jpg", "Tranh/Tranh04/phong01.tranh04.audio01.mp3", "Tranh/Tranh04/phong01.tranh04.name01", "Tranh/Tranh04/phong01.tranh04.text01", 4),
        addPicture(12.75, 17.5, -55.48, 2.1, -71.7, Math.PI / 2, "Tranh/Tranh05/phong01.tranh05.picture01.jpg", "Tranh/Tranh05/phong01.tranh05.audio01.mp3", "Tranh/Tranh05/phong01.tranh05.name01", "Tranh/Tranh05/phong01.tranh05.text01", 5),
        addPicture(12.75, 17.5, -55.48, 2.1, -91.0, Math.PI / 2, "Tranh/Tranh06/phong01.tranh06.picture01.jpg", "Tranh/Tranh06/phong01.tranh06.audio01.mp3", "Tranh/Tranh06/phong01.tranh06.name01", "Tranh/Tranh06/phong01.tranh06.text01", 6),

        addPicture(16.5, 12.5, 44, 5.70, -106.35, -(Math.PI / 2), "Tranh/Tranh07/phong01.tranh07.picture01.jpg", "Tranh/Tranh07/phong01.tranh07.audio01.mp3", "Tranh/Tranh07/phong01.tranh07.name01", "Tranh/Tranh07/phong01.tranh07.text01", 7),
        addPicture(16.5, 12.5, 44, 5.70, -40.55, -(Math.PI / 2), "Tranh/Tranh08/phong01.tranh08.picture01.jpg", "Tranh/Tranh08/phong01.tranh08.audio01.mp3", "Tranh/Tranh08/phong01.tranh08.name01", "Tranh/Tranh08/phong01.tranh08.text01", 8),

        addPicture(16.5, 12.5, 44, 5.70, 10.40, -(Math.PI / 2), "Tranh/Tranh09/phong01.tranh09.picture01.jpg", "Tranh/Tranh09/phong01.tranh09.audio01.mp3", "Tranh/Tranh09/phong01.tranh09.name01", "Tranh/Tranh09/phong01.tranh09.text01", 9)
}
function addPicture(width, height, posX, posY, posZ, rotateY, picUrl, audioUrl, objectName, infoText, stt) {

    var image3DArt;
    var text = new THREE.TextureLoader(loadingManager);
    var image3DArtTexture = text.load(picUrl, function (sizeImage) {

        var image3DArtGeometry = new THREE.PlaneGeometry(width, height, 0, 0);

        var loader = new THREE.FileLoader(loadingManager);
        loader.load(objectName + '.txt', function (data) {
            var readFile = new THREE.FileLoader();
            loader.load(infoText + '.txt', function (data2) {
                var image3DArtMaterial = new THREE.MeshBasicMaterial({ map: image3DArtTexture });
                image3DArt = new THREE.Mesh(image3DArtGeometry, image3DArtMaterial);
                image3DArt.position.y = posY;
                image3DArt.position.z = posZ + 14.8;
                image3DArt.position.x = posX + 5.7;//-75+5.7
                image3DArt.rotation.y = rotateY;
                objectDescription = [];
                objectDescription[0] = audioUrl;
                objectDescription[1] = data2;
                objectDescription[2] = picUrl;
                objectDescription[3] = data;
                objectDescription[4] = stt;
                image3DArt.userData = objectDescription;
                image3DArt.name = 'tranh';
                mainScene.add(image3DArt);

                objects[stt.toString()] = image3DArt;

            });
        });
    });
    image3DArtTexture.minFilter = THREE.LinearFilter;

    // return image3DArt;
}
function addVideo(width, height, videoUrl, imageUrl, tagName, stt) {

    video = document.getElementById('myvideo');
    video.src = "Video/Video1/" + videoUrl + ".mp4";
    video.load();

    // var texture = new THREE.VideoTexture( video );
    // texture.minFilter = THREE.LinearFilter;
    // texture.magFilter = THREE.LinearFilter;
    // texture.format = THREE.RGBFormat;

    var text = new THREE.TextureLoader();
    var texture = text.load("Video/Video1/" + imageUrl + ".jpg");

    var imageObject = new THREE.Mesh(
        new THREE.PlaneGeometry(width, height),
        new THREE.MeshBasicMaterial({ map: texture }));

    imageObject.position.set(-49.45, 2.65, 0);
    imageObject.rotation.y = Math.PI / 2;
    mainScene.add(imageObject);
    imageObject.name = "video1";

    objectDescription = [];
    objectDescription[0] = tagName;
    imageObject.userData = objectDescription;
    objects[stt.toString()] = imageObject;


}
function Hienvat(urlModel, text, normal, ao, metalness, roughness, posX, posY, posZ, rotateY, dataScale, picUrl, audioUrl, infoText, objectName, tagName) {

    var loader = new THREE.FileLoader(loadingManager);
    loader.load(objectName + '.txt', function (name) {
        var loadtext = new THREE.FileLoader(loadingManager);
        loadtext.load(infoText + '.txt', function (info) {
            var loadscale = new THREE.FileLoader(loadingManager);
            loadscale.load(dataScale + '.txt', function (getscale) {
                var fbxLoader = new THREE.FBXLoader(loadingManager);
                fbxLoader.load(urlModel + '.fbx', function (object) {
                    var hienvat = object;
                    hienvat.traverse(function (child) {
                        if (child.isMesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                            // child.material = new THREE.MeshStandardMaterial({map: material, normalMap : normal, aoMap: ao, metalnessMap : metalness, roughnessMap : roughness,roughness : 1, metalness :1});
                            child.material = new THREE.MeshStandardMaterial({
                                map: new THREE.TextureLoader().load(text + ".jpg"),
                                aoMap: new THREE.TextureLoader().load(ao + ".jpg"),
                                normalMap: new THREE.TextureLoader().load(normal + ".jpg"),
                                metalnessMap: new THREE.TextureLoader().load(metalness + ".jpg"),
                                roughnessMap: new THREE.TextureLoader().load(roughness + ".jpg")
                            });
                        }
                    });
                    hienvat.scale.multiplyScalar(Number(getscale));

                    objectDescription = [];
                    objectDescription[0] = audioUrl;
                    objectDescription[1] = info;
                    objectDescription[2] = picUrl;
                    objectDescription[3] = name;
                    objectDescription[4] = tagName;
                    objectDescription[5] = urlModel.substr(0, urlModel.length - 7);
                    objectDescription[6] = hienvat.clone();

                    var model = new THREE.Object3D();
                    model.add(hienvat);
                    model.position.set(posX, posY, posZ);
                    model.rotation.y = rotateY;
                    model.userData = objectDescription;
                    mainScene.add(model);
                    // objects.push(model); 


                });
            });



        });
    });
}
function hideInfo() {
    console.log("close");
}
function zoom(e) {
    var frame = document.getElementById('frame');
    with (frame.style) {
        backgroundSize = "180%";
    }
    var zoomer = e.currentTarget;
    e.offsetX ? offsetX = e.offsetX : offsetX = e.touches[0].pageX;
    e.offsetY ? offsetY = e.offsetY : offsetX = e.touches[0].pageX;
    x = (offsetX / zoomer.offsetWidth) * 100;
    y = (offsetY / zoomer.offsetHeight) * 100;
    zoomer.style.backgroundPosition = x + "%" + y + "%";
}
function mouseOver() {
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
function nextStep() {
    isSubScene = false;
    document.getElementById("myModal").style.display = "none";
    document.getElementById("sub-container").style.display = "none";
    document.getElementById("my-video").style.display = "none";
    document.getElementById("myvideo").pause();
    if (isOnclick == true) {
        t++;
        if (t == objects.length) {
            t = 0;
        }
    }
    autoMove(t);
}
function backStep() {
    isSubScene = false;
    document.getElementById("myModal").style.display = "none";
    document.getElementById("sub-container").style.display = "none";
    document.getElementById("my-video").style.display = "none";
    document.getElementById("myvideo").pause();
    if (isOnclick == true) {
        t--;
        if (t < 0) {
            t = 0;
        }
    }
    autoMove(t);
}
function onWindowResize() {

    mainCamera.aspect = window.innerWidth / window.innerHeight;
    mainCamera.updateProjectionMatrix();
    mainRenderer.setSize(window.innerWidth, window.innerHeight);

    subCamera.aspect = window.innerWidth * 0.8 / window.innerHeight * 0.95;
    subCamera.updateProjectionMatrix();
    subRenderer.setSize(window.innerWidth * 0.8, window.innerHeight * 0.95);
    animate();
}
function autoMove(stt) {
    // stt = 0;
    if (camPos == null) {
        var sound = document.getElementById('sound');
        var soundM = document.getElementById('sound-model');
        if (sound != undefined) {
            sound.pause();
        }
        if (soundM != undefined) {
            soundM.pause();
        }
        document.getElementById("popup2D").style.display = "none";

        if (objects[stt].rotation.y == 0) {
            camPos = new THREE.Vector3(mainCamera.position.x, mainCamera.position.y, mainCamera.position.z); // Holds current camera position
            targetPos = new THREE.Vector3(objects[stt].position.x, mainCamera.position.y, objects[stt].position.z + 50 / 2); // Target position
        }
        else if (objects[stt].rotation.y == Math.PI / 2) {
            camPos = new THREE.Vector3(mainCamera.position.x, mainCamera.position.y, mainCamera.position.z); // Holds current camera position
            targetPos = new THREE.Vector3(objects[stt].position.x + 50 / 2, mainCamera.position.y, objects[stt].position.z); // Target position
        }
        else if (objects[stt].rotation.y == -(Math.PI / 2)) {
            camPos = new THREE.Vector3(mainCamera.position.x, mainCamera.position.y, mainCamera.position.z); // Holds current camera position
            targetPos = new THREE.Vector3(objects[stt].position.x - 50 / 2, mainCamera.position.y, objects[stt].position.z); // Target position
        }
        else if (objects[stt].rotation.y == Math.PI) {
            camPos = new THREE.Vector3(mainCamera.position.x, mainCamera.position.y, mainCamera.position.z); // Holds current camera position
            targetPos = new THREE.Vector3(objects[stt].position.x, mainCamera.position.y, objects[stt].position.z - 50 / 2); // Target position
        }

        var tween = new TWEEN.Tween(currentPos)
            .to(targetPos, 2000)

            .easing(TWEEN.Easing.Cubic.Out)
            .onUpdate(function () {
                mainCamera.lookAt(new THREE.Vector3(objects[stt].position.x, objects[stt].position.y, objects[stt].position.z));
            })
            .onComplete(function () {
                controls.target = new THREE.Vector3(objects[stt].position.x, objects[stt].position.y, objects[stt].position.z)

            })
            .start()

        animate();
    }
}

var deltaTime = 1000 / 70;
var curTime = Date.now();
var prevTime = curTime;


function animate() {
    TWEEN.update();
    if (camPos != null) {
        requestAnimationFrame(animate);
    }

    if (camPos != null) {
        var checkerX1 = parseFloat(mainCamera.position.x).toFixed(0);
        var checkerX2 = parseFloat(targetPos.x).toFixed(0);
        var checkerZ1 = parseFloat(mainCamera.position.z).toFixed(0);
        var checkerZ2 = parseFloat(targetPos.z).toFixed(0);

        if (checkerX1 == "-0") {
            checkerX1 = "0";
        }

        if (checkerX1 == checkerX2 && checkerZ1 == checkerZ2) {
            camPos = null;
            targetPos = null;
            isOnclick = true;

            if (objects[t].userData[0] == "video") {
                document.getElementById("sub-container").style.display = "none";
                document.getElementById("popup2D").style.display = "none";
                document.getElementById("my-video").style.display = "block";
                var vid = document.getElementById("myvideo");
                vid.play();
                vid.onended = function () {
                    // isSubScene = false;
                    document.getElementById("my-video").style.display = "none";
                    t++;
                    if (t == objects.length) {
                        t = 0;
                    }
                    autoMove(t);
                };
            }
            else if (objects[t].userData[4] == "hienvat") {
                isSubScene = true;
                document.getElementById("my-video").style.display = "none";
                document.getElementById("myvideo").pause();

                document.getElementById("sub-container").style.display = "block";
                group.remove(group.children[0]);
                var hv = objects[t].userData[6];
                hv.position.set(0, 0, 0);


                var cent = new THREE.Vector3();
                var size = new THREE.Vector3();
                var bbox = new THREE.Box3().setFromObject(hv);
                bbox.getCenter(cent);
                bbox.getSize(size);

                //Rescale the object to normalized space
                var maxAxis = Math.max(size.x, size.y, size.z);
                hv.scale.multiplyScalar(1.0 / maxAxis);

                //get the updated/scaled bounding box again..
                bbox.setFromObject(hv);
                bbox.getCenter(cent);
                bbox.getSize(size);

                hv.position.x -= cent.x;
                hv.position.y -= cent.y;
                hv.position.z -= cent.z;

                var height = bbox.getSize().y;
                var dist = height / (2 * Math.tan(subCamera.fov * Math.PI / 360));
                var pos = subScene.position;
                subCamera.position.set(pos.x, pos.y, dist * 2.0);
                subCamera.lookAt(pos);

                group.add(hv);
                subScene.add(group);

                document.getElementById("info-model").innerHTML = objects[t].userData[1];

                var soundM = document.getElementById('sound-model');
                if (soundM != undefined) {
                    soundM.pause();
                }
                soundM.src = objects[t].userData[0];
                soundM.controls = 'controls';
                soundM.play();

                soundM.onended = function () {
                    isSubScene = false;
                    document.getElementById("sub-container").style.display = "none";
                    t++;
                    if (t == objects.length) {
                        t = 0;
                    }
                    autoMove(t);
                };
            }
            else {
                document.getElementById("my-video").style.display = "none";
                document.getElementById("myvideo").pause();

                var sound = document.getElementById('sound');
                if (sound != undefined) {
                    sound.pause();
                }
                sound.src = objects[t].userData[0];
                sound.controls = 'controls';
                sound.play();
                sound.onended = function () {
                    document.getElementById("popup2D").style.display = "none";
                    t++;
                    if (t == objects.length) {
                        t = 0;
                    }
                    autoMove(t);
                };

                document.getElementById("popup2D").style.display = "block";
                document.getElementById("infotext").innerHTML = objects[t].userData[1];
                //
                var img = "url" + "(" + objects[t].userData[2] + ")";

                document.getElementById("frame").style.backgroundImage = img;
            }

        }
        else
            isOnclick = false;
    }

    group.rotation.y -= 0.01;

    render();
}
function render() {
    if (isSubScene) {
        subRenderer.render(subScene, subCamera);
    }
    else {
        mainRenderer.render(mainScene, mainCamera);
    }

    controls.update();
}
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
}
document.getElementById("btn-automatic").onclick = function () {
    document.getElementById("pleasewait").style.display = "none";
    document.getElementById("btn-automatic").style.display = "none";
    document.getElementById("btn-screen").style.display = "block";
    document.getElementById("btn-fullscreen").style.display = "block";
    document.getElementById("myModal").style.display = "block";
    animate();
    // autoMove();
};
document.getElementsByClassName("close")[0].onclick = function () {
    document.getElementById("myModal").style.display = "none";
    autoMove(0);
}
document.getElementById("btn-intruction").onclick = function () {
    document.getElementById("myModal").style.display = "block";
};
document.getElementById("btn-resetposition").onclick = function () {
    document.getElementById("sub-container").style.display = "none";

    mainCamera.position.set(0, 0, 0.01);
    t = 0;
    autoMove(0);
};
function openNav() {
    document.getElementById("mySidepanel").style.width = "20%";
    document.getElementById("mySidepanel").style.height = "100%";
}

function closeNav() {
    document.getElementById("mySidepanel").style.width = "0";
}