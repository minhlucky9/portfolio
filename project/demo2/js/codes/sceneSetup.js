const shadow = true;
const debug = false;
var timeline = false;
var ultra = false;
var isMobile = false; //initiate as false
// device detection
if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) { 
    isMobile = true;
}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const container = document.getElementById("mainScene");
const renderer = new THREE.WebGLRenderer({
    antialias: true
});

if(window.innerWidth > window.innerHeight) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);  
} else {
    camera.aspect = window.innerHeight / window.innerWidth;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerHeight, window.innerWidth);  
}

//renderer.outputEncoding = THREE.sRGBEncoding;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
//renderer.toneMapping = THREE.ACESFilmicToneMapping;

var elementCount, loadedElement = 0;
var totalAsset, currentAsset = 0;
const physics = new Ammo.Physics();
const clock = new THREE.Clock();
const playerController = new THREE.PlayerControls();
const animatorController = new THREE.AnimatorController();
const itemGenerator = new THREE.ItemGenerator();
const audioController = new THREE.AudioController();
const treeController = new THREE.TreeSwing();
const billboardController = new BillboardController();
const NPCController = {

};
const NPCName = [];
const questController = new THREE.QuestController();
var engine;
var fire1, fire2;
var timeLineParticle;
// const stats = new Stats();
// container.appendChild(stats.dom);
const raycastObj = [];

var water;
camera.position.set(0.045, 1.768, -2.376);
camera.rotation.set(-2.85, 0, -3.141);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enabled = false;

//Init();

function Init() {
    //renderer
    container.appendChild(renderer.domElement);
    //
    physics.setDebug(debug);
    //
    initLight();
    initEventListener();
    LoadMap();
    //

}

function LoadMap() {
    totalAsset = 3;
    currentAsset = 1;
    var loadingManager1 = new THREE.LoadingManager();
    var loadingManager2 = new THREE.LoadingManager();
    var loadingManager3 = new THREE.LoadingManager();
    var loadingManager4 = new THREE.LoadingManager();
    var loadingManager5 = new THREE.LoadingManager();
    var loadingManager6 = new THREE.LoadingManager();
    LoadCollider(loadingManager1, 'models/Village/Map_seperated/ground.glb', true);
    LoadCollider(loadingManager1, 'models/Village/Map_seperated/collider.glb', false);
    LoadPlayer(loadingManager1);
    //
    loadingManager1.onLoad = function () {
        currentAsset = 2;
        LoadWater();
        LoadStaticObj(loadingManager2, 'models/Village/Map_seperated/outerspace.glb', true);
        LoadStaticObj(loadingManager2, 'models/Village/Map_seperated/plants.glb', true);
        LoadRayLight(loadingManager2, 'models/Village/Map_seperated/raylight.glb');
        //particle
        engine = new ParticleEngine();
        
        engine.setValues(Examples.fireflies);
        engine.initialize();
        
        //candle1
        fire1 = new ParticleEngineFire();
        fire1.setValues(Examples.candle2);
        fire1.initialize();

        //candle1
        fire2 = new ParticleEngineFire();
        fire2.setValues(Examples.candle3);
        fire2.initialize();

    };

    loadingManager2.onLoad = function () {
        currentAsset = 3;
        LoadStaticObj(loadingManager3, 'models/Village/Map_seperated/constructions1.glb', true);
        LoadStaticObj(loadingManager3, 'models/Village/Map_seperated/smallprops1.glb', true);
        LoadQuestNPC(loadingManager3);
        billboardController.init();
    }

    loadingManager3.onLoad = function () {
        setTimeout(function () {
            FinishLoading();
        }, 500)
        LoadStaticObj(loadingManager4, 'models/Village/Map_seperated/constructions2.glb', true);
        LoadStaticObj(loadingManager4, 'models/Village/Map_seperated/smallprops2.glb', true);
    }

    loadingManager4.onLoad = function () {
        LoadStaticObj(loadingManager5, 'models/Village/Map_seperated/constructions3.glb', true);
        LoadStaticObj(loadingManager5, 'models/Village/Map_seperated/smallprops3.glb', true);
    }

    loadingManager5.onLoad = function () {
        LoadStaticObj(loadingManager6, 'models/Village/Map_seperated/constructions4.glb', true);
    }

    loadingManager6.onLoad = function () {
        playerController.toggleKinematic(false);
        playerController.toggleMoving(true);
    }

    //
    loadingManager1.onProgress = function (url, itemsLoaded, itemsTotal) {
        loadedElement = itemsLoaded;
        elementCount = itemsTotal;
    };

    loadingManager2.onProgress = function (url, itemsLoaded, itemsTotal) {
        loadedElement = itemsLoaded;
        elementCount = itemsTotal;
    }

    loadingManager3.onProgress = function (url, itemsLoaded, itemsTotal) {
        loadedElement = itemsLoaded;
        elementCount = itemsTotal;
    }

    // loadingManager4.onProgress = function (url, itemsLoaded, itemsTotal) {
    //     loadedElement = itemsLoaded;
    //     elementCount = itemsTotal;
    // }

    // loadingManager5.onProgress = function (url, itemsLoaded, itemsTotal) {
    //     loadedElement = itemsLoaded;
    //     elementCount = itemsTotal;
    // }

    // loadingManager6.onProgress = function (url, itemsLoaded, itemsTotal) {
    //     loadedElement = itemsLoaded;
    //     elementCount = itemsTotal;
    // }

    //load environment
    const cubeTextLoader = new THREE.CubeTextureLoader();
    cubeTextLoader.setPath('skybox/moonnight/');

    const textureCube = cubeTextLoader.load([
        "px.png",
        "nx.png",
        "py.png",
        "ny.png",
        "pz.png",
        "nz.png",
    ]);

    scene.background = textureCube;
    scene.environment = textureCube;
    scene.fog = new THREE.FogExp2(0x0e232e, 0.0075);
    //
}

function LoadPlayer(manager) {

    new THREE.FBXLoader(manager, true).load('models/Character/' + loginData.clanName.toLowerCase() + '/' + loginData.clanName.toLowerCase() + '_idle.fbx', function (obj) {
        obj.scale.set(0.7, 0.7, 0.7);
        obj.position.set(8.7, 6.0, 4.6);

        obj.traverse(function (child) {
            if (child.isMesh) {
                if (shadow) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }

                if (ValidatePartName(child.name) || child.name.includes("Body_")) {
                    child.visible = true;

                } else {
                    child.visible = false;
                    child.matrixAutoUpdate = false;
                }
            }
        })
        //
        scene.add(obj);
        playerController.init(obj, camera);
        animatorController.init(obj);
    })
}

function ValidatePartName(partname) {
    for (var i = 0; i < loginData.part_info.length; i++) {
        if (partname.toUpperCase() == loginData.part_info[i].partHero_name.toUpperCase()) {
            return true;
        }
    }

    return false;
}

function LoadQuestNPC(manager) {
    new THREE.FBXLoader(manager, false).load('models/Character/npc/npc_giahuongdao.fbx', function (obj) {
        obj.traverse(function (child) {
            if (child.isMesh) {
                if (shadow) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }

                child.material.side = THREE.DoubleSide;
            }
        })
        obj.scale.set(0.09, 0.09, 0.09);
        obj.position.set(5.6, 5.2, 9.8);
        obj.rotation.y = Math.PI / 1.3;
        //
        scene.add(obj);
        //
        var npc = new THREE.NPCController();
        npc.init(obj, NPC_ELDER_DATA.questDialog, NPC_ELDER_DATA.normalDialog, 1.5, new THREE.Vector3(0, 0, 0), "Antuk Elder");
        NPCController['elder'] = npc;
        NPCName.push('elder');
    })

    //flute npc
    new THREE.FBXLoader(manager, false).load('models/Character/npc/npc_thoisao.fbx', function (obj) {
        obj.traverse(function (child) {
            if (child.isMesh) {
                if (shadow) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }

                child.material.side = THREE.DoubleSide;
            }
        })
        obj.scale.set(0.14, 0.14, 0.14);
        obj.position.set(-22.0, 2.74, 5.50);
        obj.rotation.y = Math.PI / 3.7;
        //
        scene.add(obj);
        //
        var npc = new THREE.NPCController();
        npc.init(obj, NPC_FLUTE_DATA.questDialog, NPC_FLUTE_DATA.normalDialog, 1.7, new THREE.Vector3(0, -0.1, 0), "Antuk Bard");
        NPCController['flute'] = npc;
        NPCName.push('flute');
    })

    //blacksmith npc
    new THREE.FBXLoader(manager, false).load('models/Character/npc/npc_thoren.fbx', function (obj) {
        obj.traverse(function (child) {
            if (child.isMesh) {
                if (shadow) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }

                child.material.side = THREE.DoubleSide;
            }
        })
        obj.scale.set(2.0, 2.0, 2.0);
        obj.position.set(-8.6, 1.0, -8.8);
        obj.rotation.y = Math.PI;
        //
        scene.add(obj);
        //
        var npc = new THREE.NPCController();
        npc.init(obj, NPC_BLACKSMITH_DATA.questDialog, NPC_BLACKSMITH_DATA.normalDialog, 1.7, new THREE.Vector3(0, 0.3, 0), "Muu Blacksmith");
        NPCController['blacksmith'] = npc;
        NPCName.push('blacksmith');
    })

    //altar tree
    var objectAltarTree = new THREE.Object3D();
    objectAltarTree.position.set(9.8, 5.9, 8.4);
    scene.add(objectAltarTree);
    var npcAltarTree = new THREE.NPCController();
    npcAltarTree.init(objectAltarTree, NPC_ALTAR_TREE_DATA.questDialog, NPC_ALTAR_TREE_DATA.normalDialog, 2.0, new THREE.Vector3(0, -0.1, 0), "The Altar Tree");
    NPCController['altar-tree'] = npcAltarTree;
    NPCName.push('altar-tree');
}


function initEventListener() {
    window.addEventListener('resize', onWindowResize, false);
    function onWindowResize() {
        //console.log(window);
        width = window.innerWidth;
        height = window.innerHeight;
        if(width > height) {
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        } else {
            camera.aspect = height / width;
            camera.updateProjectionMatrix();
            renderer.setSize(height, width);
        }
        
    }

    document.addEventListener('contextmenu', event => event.preventDefault());

    $(document).keydown(function (e) {
        playerController.OnKeyDown(e);
    })

    $(document).keyup(function (e) {
        playerController.OnKeyUp(e);
        for (var i = 0; i < NPCName.length; i++) {
            var npc = NPCController[NPCName[i]];
            npc.OnKeyUp(e);
        }
    })

    $(container).mousemove(function (e) {
        playerController.OnMouseMove(e);
    })

    $(container).mousedown(function (e) {
        playerController.OnMouseDown(e);
        billboardController.OnMouseDown(e);
    })

    $(container).mouseup(function (e) {
        playerController.OnMouseUp(e);
        billboardController.OnMouseUp(e);
    })

    $(container).mouseout(function (e) {
        playerController.OnMouseOut(e);
    })

    $('.joystick-controller .jump-btn').on('touchend', function(e) {
        playerController.OnTouchJumpBtn();
    })

    $('.joystick-controller .talk-btn').on('touchend', function(e) {
        for (var i = 0; i < NPCName.length; i++) {
            var npc = NPCController[NPCName[i]];
            npc.OnTouchTalkBtn(e);
        }
    })

    
}

function toggleUltra() {
    if(isMobile == false) {
        if(ultra) {
            ultra = false;
            hemisphereLight.intensity = 0.7;
            shadowLight.intensity = 0.9;
        } else {
            ultra = true;
            hemisphereLight.intensity = 0.55;
            shadowLight.intensity = 0.7;
        }
    } 
}

function initLight() {
    hemisphereLight = new THREE.HemisphereLight(0xfcefcf, 0x11408c, 0.7);
    hemisphereLight.position.set(0, 10, 0);
    scene.add(hemisphereLight);

    pointlightTreeAltar = new THREE.PointLight(0x38a6d9, 2.0, 18);
    pointlightTreeAltar.position.set(9.8, 13, 8.4);
    scene.add(pointlightTreeAltar);

    pointlightFireKhudan = new THREE.PointLight(0xf7a94f, 1.7, 13);
    pointlightFireKhudan.position.set(-8.3, 3.3, 14.4);
    scene.add(pointlightFireKhudan);

    pointlightFireKhucho = new THREE.PointLight(0xf7a94f, 1.7, 13);
    pointlightFireKhucho.position.set(-11, 1.7, -12);
    scene.add(pointlightFireKhucho);

    pointlightFireKhuhop = new THREE.PointLight(0xf7a94f, 1.4, 13);
    pointlightFireKhuhop.position.set(13.1, 4.5, -11.4);
    scene.add(pointlightFireKhuhop);

    pointlightNPCthoisao = new THREE.PointLight(0xf7a94f, 2.3, 4);
    pointlightNPCthoisao.position.set(-22.1, 3.6, 5.4);
    scene.add(pointlightNPCthoisao);

    shadowLight = new THREE.DirectionalLight(0xffffff, 0.9);
    shadowLight.position.set(0, 22, 15);
    if (shadow) {
        shadowLight.castShadow = true;
        shadowLight.shadow.mapSize.width = 1024;
        shadowLight.shadow.mapSize.height = 1024;
        shadowLight.shadow.bias = 0.0001;
        shadowLight.shadow.normalBias = 0.1;
        shadowLight.shadow.camera.far = 100;
        shadowLight.shadow.camera.right = 10;
        shadowLight.shadow.camera.left = -10;
        shadowLight.shadow.camera.top = 10;
        shadowLight.shadow.camera.bottom = -10;
        if (debug) { scene.add(new THREE.CameraHelper(shadowLight.shadow.camera)); }
    }
    scene.add(shadowLight);
}

//post-processing
const renderScene = new THREE.RenderPass(scene, camera);
const composer = new THREE.EffectComposer(renderer);
//composer.setSize(window.innerWidth, window.innerHeight);
const paramsPostProcessing = {
    exposure: 1.0,
    bloomStrength: 0.78,
    bloomThreshold: 0.133,
    bloomRadius: 1.0,
};

//bloom
const bloomPass = new THREE.UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
bloomPass.threshold = paramsPostProcessing.bloomThreshold;
bloomPass.strength = paramsPostProcessing.bloomStrength;
bloomPass.radius = paramsPostProcessing.bloomRadius;


composer.addPass(renderScene);
composer.addPass(bloomPass);

var fps = 60;
var time = 0;


function animate() {
    requestAnimationFrame(animate);

    var delta = clock.getDelta();
    render(delta);

};

// setInterval(function() {
//     console.log(renderer.info.render);
// }, 1000)

function render(delta) {
    if(ultra) {
        composer.render();
    } else {
        renderer.render(scene, camera);
    }
    //

    if (delta > 0.05) {
        delta = 0.015;
    }

    if (physics && timeline == false) {
        physics.update(delta);
        playerController.update(delta);
    }

    if (timeline) {
        controls.update(delta);
        if (timeLineParticle) {
            timeLineParticle.update(delta * 0.5);
        }
    }


    if (itemGenerator) {
        itemGenerator.update(delta);
    }

    if (water) {
        water.material.uniforms['time'].value += delta;
    }

    UpdateNPCController(delta);

    UpdateParticle(delta);

    if (animatorController) {
        animatorController.update(delta * 1.5);
    }

    if (questController) {
        questController.update();
    }

    UpdateMinimap();

    //stats.update();

}

function UpdateParticle(delta) {
    if (engine) {
        engine.update(delta * 0.5);
    }

    if (fire1) {
        fire1.update(delta * 0.5);
    }

    if (fire2) {
        fire2.update(delta * 0.5);
    }

}

function SetTimeLine() {
    timeline = true;
    //remove question mark
    NPCController['altar-tree'].setState(NPCController['altar-tree'].NPCSTATE.DEFAULT, null);

    //setup player position
    var player = playerController.getPlayer();
    player.position.set(8.1, 5.6, 8.1);
    player.rotation.y = Math.PI / 2;
    //
    camera.position.set(9.4, 7.6, 5.7);
    controls.target = player.position.clone().add(new THREE.Vector3(0, 0.3, 0));
    controls.autoRotate = true;
    controls.autoRotateSpeed = 7;
    //
    animatorController.setState('isPray', true);
    audioController.activateSound("pray", false);
    //hide dialog
    $('.NPCDialog').css("visibility", "hidden");
    $('.NPCDialog').css("pointer-events", "none");

    setTimeout(function () {
        timeLineParticle = new ParticleEngine();
        timeLineParticle.setValues(Examples.startunnel);
        timeLineParticle.initialize();
        $('.NPCDialog').css("visibility", "visible");
        $('.NPCDialog').css("pointer-events", "all");
    }, 5000);

}

function RemoveTimeLine() {
    timeline = false;
    timeLineParticle.destroy();
    NPCController['altar-tree'].setState(NPCController['altar-tree'].NPCSTATE.PROGRESS, "exchange-items-progress");
    
}

function UpdateNPCController(delta) {
    var k = -1;

    for (var i = 0; i < NPCName.length; i++) {
        var npc = NPCController[NPCName[i]];
        npc.update(delta);

        if (npc.isAllowInteract() == true) {
            k = i;
        }
    }

    //update instruction announce
    if (k != -1) {
        if (!$('.center-content .announcement').is(":visible")) {

            if($('.joystick-controller').is(":visible")) {
                $('.joystick-controller .talk-btn').fadeIn(300);
            } else {
                $('.center-content .instruction').fadeIn(300);
            }

        } else {
            $('.center-content .instruction').fadeOut(0);
            $('.joystick-controller .talk-btn').fadeOut(0);
        }
    } else {
        $('.center-content .instruction').fadeOut(300);
        $('.joystick-controller .talk-btn').fadeOut(300);
    }
}



animate();
