BillboardController = function () {
    var billboardData = [
        {
            "video_url": "https://media.ookeenga.io/generals/videos/minigame_720_low.mp4",
            "target_url": "https://ookeenga.io/",
        }
    ];
    var current = 0;
    var video = document.createElement("video");
    video.crossOrigin = "anonymous";	
    var planeBillBoard;
    var isStart = false;
    var raycaster = new THREE.Raycaster();
    var pointer = new THREE.Vector2();
    var downPointer = new THREE.Vector2();

    function LoadBillBoard() {
        //
        planeBillBoard = new THREE.Mesh(new THREE.PlaneGeometry(16, 9), new THREE.MeshBasicMaterial({ map: new THREE.VideoTexture(video) }));
        planeBillBoard.position.set(-36.8, 9.2, -5.9);
        planeBillBoard.rotation.y = (65) * Math.PI / 180;

        //
        scene.add(planeBillBoard);

    }

    function PlayBillboard() {
        if (planeBillBoard && isStart == false) {
            var data = billboardData[current];
            video.setAttribute("src", data.video_url);
            video.play();
            
            //
            planeBillBoard.userData.targetUrl = data.target_url;
            //
            isStart = true;
        }
    }

    function OnMouseDown(event) {
        downPointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        downPointer.y = - (event.clientY / window.innerHeight) * 2 + 1;
    }

    function OnMouseUp(event) {
        /* pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;

        if (downPointer.distanceTo(pointer) == 0) {
            //
            raycaster.setFromCamera(pointer, camera);
            // calculate objects intersecting the picking ray
            var intersects = raycaster.intersectObject(planeBillBoard);
           
            if (intersects.length > 0) {
                var obj = intersects[0].object;
                if (obj.userData.targetUrl != null) {
                    window.open(obj.userData.targetUrl, '_blank').focus();
                    playerController.UnlockMouse();
                }
            }
        } */
    }

    video.onended = function (e) {
        /*Do things here!*/
        current += 1;
        current = current % billboardData.length;
        //
        var data = billboardData[current];
        video.setAttribute("src", data.video_url);
        video.play();
        //
        planeBillBoard.userData.targetUrl = data.target_url;
    };

    return {
        start: PlayBillboard,
        init: LoadBillBoard,
        OnMouseUp: OnMouseUp,
        OnMouseDown: OnMouseDown
    }
}
