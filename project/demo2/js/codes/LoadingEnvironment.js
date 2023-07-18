

function LoadWater() {
    var waterGeometry = new THREE.PlaneGeometry(500, 500);
    water = new THREE.Water(
        waterGeometry,
        {
            textureWidth: 512,
            textureHeight: 512,
            waterNormals: new THREE.TextureLoader().load('textures/water_normal_1.png', function (texture) {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            }),
            sunDirection: new THREE.Vector3(),
            sunColor: 0x445b1a,
            waterColor: 0x2e4215,
            distortionScale: 0.35,
            size: 20,
            fog: scene.fog !== undefined
        }
    );

    water.rotation.x = - Math.PI / 2;
    water.position.y = 0.3;
    scene.add(water);

};


function LoadTree(loadingManager, url) {
    var loader;
    if (loadingManager == null) {
        loader = new THREE.GLTFLoader();
    } else {
        loader = new THREE.GLTFLoader(loadingManager);
    }

    loader.load(url, function (obj) {
        obj.scene.scale.set(0.01, 0.01, 0.01);

        obj.scene.traverse(function (child) {
            if (child.isMesh) {
                if (shadow) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }

                //swing
                treeController.init(child);
            }
        })
        scene.add(obj.scene);
    })
}

function LoadCollider(loadingManager, url, visible) {
    var loader;
    if (loadingManager == null) {
        loader = new THREE.GLTFLoader();
    } else {
        loader = new THREE.GLTFLoader(loadingManager);
    }

    loader.load(url, function (obj) {
        obj.scene.scale.set(0.01, 0.01, 0.01);

        if (!visible) {
            obj.scene.visible = false;
        }

        obj.scene.traverse(function (child) {
            if (child.isMesh) {
                if (shadow) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }

                child.userData.tag = "collider";
                //collider
                var vertices = child.geometry.attributes.position.array;
                var indices = child.geometry.index.array;

                physics.createMeshRigidbody(child, 0, {
                    quaternion: new THREE.Quaternion(0.7071068286895752, 0, 0, 0.7071067094802856),
                    position: child.position,
                    scale: obj.scene.scale,
                    vertices: vertices,
                    indices: indices,
                    isKinematic: true
                });

                if(visible) {
                    raycastObj.push(child);
                    child.userData.material = child.material;
                }
            }
        })
        scene.add(obj.scene);
    })
};

function LoadStaticObj(loadingManager, url, raycast) {
    var loader;
    if (loadingManager == null) {
        loader = new THREE.GLTFLoader();
    } else {
        loader = new THREE.GLTFLoader(loadingManager);
    }

    loader.load(url, function (obj) {
        obj.scene.scale.set(0.01, 0.01, 0.01);

        obj.scene.traverse(function (child) {
            if (child.isMesh) {
                if (shadow) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }

                if (raycast) {
                    raycastObj.push(child);
                    child.userData.material = child.material;
                }

            }
        })
        scene.add(obj.scene);
    })
}

function LoadRayLight(loadingManager, url) {
    var loader;
    if (loadingManager == null) {
        loader = new THREE.GLTFLoader();
    } else {
        loader = new THREE.GLTFLoader(loadingManager);
    }

    loader.load(url, function (obj) {
        obj.scene.scale.set(0.01, 0.01, 0.01);
        scene.add(obj.scene);
        //animation
        raylightAnimator = new THREE.AnimationMixer(obj.scene);
        for(var i = 0; i < obj.animations.length; i ++) {
            raylightAnimator.clipAction(obj.animations[i]).play();
        }

    })
}