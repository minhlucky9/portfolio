THREE.ItemGenerator = function () {
    var allItemPos = [
        
    ];

    var bigCrystal, smallCrystal;
    var items = [];
    var time = 0;
    var speed = 1.2;

    constructor();
    function constructor() {
        new THREE.GLTFLoader().load('models/crystal_big.glb', function (obj) {
            bigCrystal = obj.scene;
            bigCrystal.scale.set(0.01, 0.01, 0.01);
        })

        new THREE.GLTFLoader().load('models/crystal_small.glb', function (obj) {
            smallCrystal = obj.scene;
            smallCrystal.scale.set(0.01, 0.01, 0.01);
        })

        resetPositionPool();
    }

    function resetPositionPool() {
        allItemPos = [
            new THREE.Vector3(-2.5, 1.0, -12.0),
            new THREE.Vector3(-7.9, 1.1, -16.1),
            new THREE.Vector3(-3.6, 1.0, -7.4),
            new THREE.Vector3(-13.4, 1.4, -14.0),
            new THREE.Vector3(-12.3, 1.1, -9.5),
            new THREE.Vector3(-20.9, 2.5, 9.7),
            new THREE.Vector3(-18.6, 2.6, 16.1),
            new THREE.Vector3(-14.1, 2.5, 11.3),
            new THREE.Vector3(-8.8, 2.4, 12.3),
            new THREE.Vector3(-12.6, 2.5, 17.6),
            new THREE.Vector3(13.9, 2.7, -7.2),
            new THREE.Vector3(10.1, 2.2, -4.8),
            new THREE.Vector3(11.6, 2.5, -16.2),
            new THREE.Vector3(15.3, 2.5, -17.5),
            new THREE.Vector3(12.0, 2.2, -11.4),
            new THREE.Vector3(-1.4, 1.1, 0.9),
            new THREE.Vector3(-0.9, 1.4, 9.7),
            new THREE.Vector3(-6.8, 1.1, 3.8),
            new THREE.Vector3(-11.9, 1.0, 2.4),
            new THREE.Vector3(-17.9, 1.5, -1.2),
            new THREE.Vector3(-4.1, 1.3, -3.1),
            new THREE.Vector3(4.5, 1.8, -13.0),
            new THREE.Vector3(-0.8, 1.1, -15.2),
            new THREE.Vector3(-7.6, 2.4, 17.0),
            new THREE.Vector3(9.0, 1.4, -1.1),
        ]
    }

    function generate(type, questname) {

        var item;
        switch (type) {
            case "big-crystal":
                item = bigCrystal.clone();
                break;
            case "small-crystal":
                item = smallCrystal.clone();
                break;
        }

        //random position
        var randomPosition = Math.floor(Math.random() * allItemPos.length);

        //setup
        item.scale.set(0.01, 0.01, 0.01);
        item.position.set(allItemPos[randomPosition].x, allItemPos[randomPosition].y, allItemPos[randomPosition].z);
        item.userData.y = item.position.y;
        item.userData.state = type;
        item.userData.quest = questname;

        //add to scene
        scene.add(item);
        items.push(item);
        allItemPos.splice(randomPosition, 1);
    }

    function update(delta) {
        time += delta;

        for (var i = 0; i < items.length; i++) {
            items[i].rotation.y += speed * delta;
            items[i].position.y = items[i].userData.y + 0.05 * Math.sin(speed * time);

            //check contact
            if (playerController) {
                var distance = playerController.distanceToPlayer(items[i].position);

                if (distance != null && Math.abs(distance) < 0.6) {
                    scene.remove(items[i]);

                    switch (items[i].userData.state) {
                        case "big-crystal":
                            showAnnouncement('+ 1 RED DIAMOND');
                            addInventory('big-crystal', 1);
                            break;
                        case "small-crystal":
                            showAnnouncement('+ 1 BLUE CRYSTAL');
                            addInventory('small-crystal', 1);
                            audioController.stopSound("pick_up");
                            audioController.activateSound("pick_up", false);
                            break;
                    }

                    items.splice(i, 1);
                }
            }

        }
    }

    function clearItems() {
        var id = 0;
        items.forEach((element) => {
            scene.remove(element);
            id ++;
        });
        
        var clearArr = setInterval(() => {
            if(id == items.length || items.length == 0) {
                clearInterval(clearArr);
                items = [];
            }
        }, 200);
        
    }

    function getCurrentItemPositions() {
        var arr = []
        for(var i = 0; i < items.length; i ++) {
            arr.push(items[i].position.clone());
        }
        return arr;
    }


    return {
        generate: generate,
        update: update,
        clearItems: clearItems,
        resetPositionPool: resetPositionPool,
        getCurrentItemPositions: getCurrentItemPositions
    }
}