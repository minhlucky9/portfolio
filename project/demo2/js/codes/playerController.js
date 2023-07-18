
THREE.PlayerControls = function () {
    var player;
    let cbContactResult;
    var forward = 0,
        back = 0,
        left = 0,
        right = 0;

    var allowMove = false;    
    var targetRotation = 0;
    var transparentMaterial = new THREE.MeshStandardMaterial({ transparent: true, opacity: 0.5, color: 0xefefef });
    var OnAir = false;
    var maxGroundAngle = 60;
    var maxSlopeAngle = 60;
    var maxSpeed = 4.5;
    var maxAcceleration = 40;
    var maxAirAcceleration = 0.05;
    var velocity = new THREE.Vector3();
    var desiredVelocity;
    var maxAirJumps = 0;
    var jumpHeight = 1.5;
    var desiredJump = 0;
    var jumpPhase = 0;
    var minGroundDotProduct = Math.cos(maxGroundAngle * (Math.PI / 180.0));
    var minSlopeDotProduct = Math.cos(maxSlopeAngle * (Math.PI / 180.0));
    var gravity = new THREE.Vector3(0, -13, 0);
    var contactNormal = new THREE.Vector3();
    var upAxis = new THREE.Vector3(0, 1, 0);
    var rightAxis, forwardAxis;
    var groundContactCount = 0;
    var connectedBody;
    var stepsSinceLastGrounded = 0, stepsSinceLastJump = 0;
    //climb
    var maxClimbAngle = 140;
    var minClimbDotProduct = Math.cos(maxClimbAngle * (Math.PI / 180.0));
    var climbNormal = new THREE.Vector3();
    var climbContactCount = 0;
    var maxClimbAcceleration = 20;
    var maxClimbSpeed = 0.6;

    //camera follow
    var maxDistanceFromPlayer = 2.5;
    var cameraDirection = new THREE.Vector3(0, 0, -1).normalize();
    var playerDirection = new THREE.Object3D();
    var verticalDirection = new THREE.Object3D();
    var focusRadius = 0.5;
    var focusPoint = new THREE.Vector3();
    var focusCentering = 0.7;

    //joystick
    var joystick = new THREE.JoystickController();
    var isEnableJoystick = false;

    function OnGround() {
        if (groundContactCount > 0) {
            return 1;
        } else {
            return 0;
        }
    }

    function OnClimb() {
        if (climbContactCount > 0 && stepsSinceLastJump > 2) {
            return 1;
        } else {
            return 0;
        }
    }

    function init(_player) {
        player = _player;
        //create rigidbody
        player.userData.colliderOffset = 0.2;
        player.userData.tag = "Player";
        physics.createRigidbody(player, "Sphere", 10, {
            radius: 0.2,
            height: 1.2,
            quaternion: player.quaternion,
            position: player.position,
        });
        setupContactResultCallback();
        //disable player gravity
        player.userData.physicsBody.setGravity(new Ammo.btVector3(0, 0, 0));
        //
        focusPoint = player.position.clone();
        previousLookAt = player.position.clone();
        ready = true;
        //
        setKinematic(true);
        shadowLight.target = player;
        
        //setup pos
        targetRotation = player.rotation.y - Math.PI / 5;
        playerDirection.rotation.y = - Math.PI / 5;
        playerDirection.updateWorldMatrix();
        verticalDirection.rotation.x = Math.PI / 10;
        verticalDirection.updateWorldMatrix();
        
    }

    function distanceToPlayer(pos) {
        if (player) {
            return pos.distanceTo(player.position);
        } else {
            return null;
        }

    }

    function toggleMoving(state) {
        allowMove = state;

        if(state == false) {
            $(".joystick-controller").css("visibility", "hidden");
        } else {
            $(".joystick-controller").css("visibility", "visible");
        }

    }

    function setKinematic(toggle) {
        if (toggle) {
            physics.setType(player, "Kinematic");
        } else {
            physics.setType(player, "Dynamic");
        }
    }

    function update(delta) {
        if ($('.joystick-controller').is(":visible")) {
            isEnableJoystick = true;
        } else {
            isEnableJoystick = false;
        }

        if (!document.hasFocus()) {
            reset();
        }

        if(allowMove == false) {
            forward = 0;
            back = 0;
            left = 0;
            right = 0;
            desiredJump = 0;
            //
        }

        if (player) {
            //check contact
            physics.checkContact(player.userData.physicsBody, cbContactResult);
            //
            updateState();
            //
            let playerInput = new THREE.Vector2();
            playerInput.x = - right + left;
            playerInput.y = forward - back;
            playerInput.normalize();

            if (isEnableJoystick) {
                var valueJoy = joystick.getJoystickValues();
                playerInput.x = -valueJoy.joysticks[0].x;
                playerInput.y = -valueJoy.joysticks[0].y;
                updateJoystickRotation();
            }

            updatePlayerRotation(playerInput);


            rightAxis = ProjectDirectionOnPlane(new THREE.Vector3(1, 0, 0).normalize().transformDirection(playerDirection.matrixWorld).normalize(), upAxis);
            forwardAxis = ProjectDirectionOnPlane(new THREE.Vector3(0, 0, 1).normalize().transformDirection(playerDirection.matrixWorld).normalize(), upAxis);

            //calculate desire velosity
            desiredVelocity = new THREE.Vector3(playerInput.x, 0, playerInput.y);

            adjustVelocity(delta);

            if (desiredJump == 1) {
                desiredJump = 0;
                jump(delta);
            }

            if (OnClimb() == 1) {
                velocity = velocity.sub(contactNormal.clone().multiplyScalar(maxClimbAcceleration * 0.9 * delta));
            } else {
                velocity = velocity.add(contactNormal.clone().multiplyScalar(delta * - gravity.length()));
            }

            //update velocity
            player.userData.physicsBody.setLinearVelocity(new Ammo.btVector3(velocity.x, velocity.y, velocity.z));
            updateFollowCamera(delta);

            //
            UpdateAnimator();
            clearState();
            //
            //console.log(player);
        }
    }

    function updatePlayerRotation(playerInput) {
        if (playerInput.x > 0.2) {

            if (playerInput.y > 0.2) {
                targetRotation = playerDirection.rotation.y + Math.PI / 4;
            } else if (playerInput.y < -0.2) {
                targetRotation = playerDirection.rotation.y + 3 * Math.PI / 4;
            } else {
                targetRotation = playerDirection.rotation.y + Math.PI / 2;
            }
        }


        if (playerInput.x < -0.2) {

            if (playerInput.y > 0.2) {
                targetRotation = playerDirection.rotation.y - Math.PI / 4;
            } else if (playerInput.y < -0.2) {
                targetRotation = playerDirection.rotation.y - 3 * Math.PI / 4;
            } else {
                targetRotation = playerDirection.rotation.y - Math.PI / 2;
            }
       
        }

        if (playerInput.x > -0.2 && playerInput.x < 0.2) {
            if (playerInput.y > 0.2) {
                targetRotation = playerDirection.rotation.y;
            }

            if (playerInput.y < -0.2) {
                targetRotation = playerDirection.rotation.y - Math.PI;
            }
        }

        //lerp rotation
        player.rotation.y = lerpRotation(player.rotation.y, targetRotation, 0.2);
    }

    function updateState() {
        stepsSinceLastGrounded += 1;
        stepsSinceLastJump += 1;

        let rbVelocity = player.userData.physicsBody.getLinearVelocity();
        velocity = new THREE.Vector3(rbVelocity.x(), rbVelocity.y(), rbVelocity.z());
        if (CheckClimbing() || groundContactCount > 0) {
            stepsSinceLastGrounded = 0;
            if (stepsSinceLastJump > 3) {
                jumpPhase = 0;
            }

            if (groundContactCount > 1) {
                contactNormal.normalize();
            }
        }
        else {
            contactNormal = upAxis;
        }

        //


    }

    function UpdateAnimator() {
        //run
        if (desiredVelocity.length() != 0) {
            animatorController.setState("isRunning", true);
        } else {
            animatorController.setState("isRunning", false);
        }

        //jump
        if (jumpPhase != 0) {
            animatorController.setState("isJumping", true);
        } else {
            animatorController.setState("isJumping", false);
        }

    }

    function CheckClimbing() {
        if (OnClimb() == 1) {
            groundContactCount = climbContactCount;
            contactNormal = climbNormal.clone();
            return true;
        }
        return false;
    }

    function clearState() {
        groundContactCount = 0;
        contactNormal = new THREE.Vector3();
        climbContactCount = 0;
        climbNormal = new THREE.Vector3();
        connectedBody = null;
    }

    function reset() {
        clearState();
        forward = 0;
        back = 0;
        left = 0;
        right = 0;
    }

    function adjustVelocity(delta) {
        var acceleration, speed;
        var xAxis, zAxis;
        if (OnClimb() == 1) {
            acceleration = maxClimbAcceleration;
            speed = maxClimbSpeed;
            xAxis = new THREE.Vector3().crossVectors(contactNormal, upAxis);
            zAxis = upAxis.clone();

            // if(contactNormal.z >= 0) {
            //     player.rotation.y = - Math.PI + contactNormal.normalize().x * Math.PI/2;
            // } 

            // if(contactNormal.z < 0) {
            //     player.rotation.y = - contactNormal.normalize().x * Math.PI/2;
            // } 

        }
        else {
            acceleration = OnGround() == 1 ? maxAcceleration : maxAirAcceleration;
            speed = maxSpeed;
            xAxis = rightAxis;
            zAxis = forwardAxis;
        }

        xAxis = ProjectDirectionOnPlane(xAxis, contactNormal);
        zAxis = ProjectDirectionOnPlane(zAxis, contactNormal);


        var currentX = velocity.dot(xAxis);
        var currentZ = velocity.dot(zAxis);


        let maxSpeedChange = acceleration * delta;

        var newX = lerp(currentX, desiredVelocity.x * speed, maxSpeedChange) - currentX;
        var newZ = lerp(currentZ, desiredVelocity.z * speed, maxSpeedChange) - currentZ;

        velocity = velocity.add(new THREE.Vector3().addVectors(xAxis.multiplyScalar(newX), zAxis.multiplyScalar(newZ)))
    }

    function ProjectDirectionOnPlane(direction, normal) {
        var dot = direction.clone().dot(normal);
        return direction.clone().add(normal.clone().multiplyScalar(-dot)).normalize();
    }

    function jump(delta) {
        //calc jump

        var jumpDirection = new THREE.Vector3();

        if (OnGround() == 1) {
            //jumpDirection = new THREE.Vector3(contactNormal.x, contactNormal.y, contactNormal.z);
            jumpDirection = new THREE.Vector3(0 ,1 ,0);
        } else if (maxAirJumps > 0 && jumpPhase <= maxAirJumps) {
            if (jumpPhase == 0) {
                jumpPhase = 1;
            }
            //jumpDirection = new THREE.Vector3(contactNormal.x, contactNormal.y, contactNormal.z);
            jumpDirection = new THREE.Vector3(0 ,1 ,0);
        } else {
            return;
        }
        jumpPhase += 1;
        var jumpSpeed = Math.sqrt(2 * gravity.length() * jumpHeight);

        jumpDirection.add(upAxis).normalize();

        var alignSpeed = velocity.clone().dot(jumpDirection);
        if (alignSpeed >= 0) {
            jumpSpeed = Math.max(jumpSpeed - alignSpeed, 0);
        }

        if (OnClimb() == 1) {
            velocity = velocity.add(jumpDirection.multiplyScalar(3));
        } else {
            velocity = velocity.add(jumpDirection.multiplyScalar(jumpSpeed));
        }

        stepsSinceLastJump = 0;
    }

    function updateJoystickRotation() {
        var valueJoy = joystick.getJoystickValues();
        var mouseX = valueJoy.joysticks[1].x * 0.024;
        var mouseY = valueJoy.joysticks[1].y * 0.024;
        //update horizontal cam
        //targetRotation -= mouseX;
        playerDirection.rotation.y -= mouseX;
        playerDirection.updateWorldMatrix();
        //update vertical cam 
        verticalDirection.rotation.x += mouseY;
        verticalDirection.rotation.x = clamp(verticalDirection.rotation.x, -Math.PI / 12, Math.PI / 6);
        verticalDirection.updateWorldMatrix();
        //
    }

    function updateFollowCamera(delta) {
        UpdateFocusPoint(delta);
        //calculate new camera position
        var target = focusPoint.clone().add(new THREE.Vector3(0, 1, 0));
        var lookDirection = cameraDirection.clone().transformDirection(verticalDirection.matrixWorld).transformDirection(playerDirection.matrixWorld);
        var newCamPos = target.clone().add(lookDirection.clone().multiplyScalar(maxDistanceFromPlayer));

        //raycast
        var raycast = new THREE.Raycaster(target.clone(), lookDirection.clone(), 0.1, maxDistanceFromPlayer);
        var intersects = raycast.intersectObjects(raycastObj);
        //
        
        // for (let i = 0; i < raycastObj.length; i++) {
        //     raycastObj[i].material = raycastObj[i].userData.material;
        // }

        // for (let i = 0; i < intersects.length; i++) {
        //     intersects[i].object.material = transparentMaterial;
        // }

        camera.position.set(newCamPos.x, newCamPos.y, newCamPos.z);
        camera.lookAt(target);

        //
        if (shadow) {
            let shadowLightNewPos = new THREE.Vector3().addVectors(player.position, new THREE.Vector3(33, 33, 15));
            shadowLight.position.set(shadowLightNewPos.x, shadowLightNewPos.y, shadowLightNewPos.z);
        }
    }

    function UpdateFocusPoint(delta) {
        var targetPoint = player.position.clone();
        if (focusRadius > 0) {
            var distance = targetPoint.distanceTo(focusPoint);
            var t = 1;
            if (distance > 0.01 && focusCentering > 0) {
                t = Math.pow(1 - focusCentering, delta);
            }
            if (distance > focusRadius) {
                t = Math.min(t, focusRadius / distance);
            }
            focusPoint = targetPoint.lerp(focusPoint, t);

        }
        else {
            focusPoint = targetPoint;
        }
    }

    function setupContactResultCallback() {

        cbContactResult = new Ammo.ConcreteContactResultCallback();
        cbContactResult.addSingleResult = function (cp, colObj0Wrap, partId0, index0, colObj1Wrap, partId1, index1) {

            let contactPoint = Ammo.wrapPointer(cp, Ammo.btManifoldPoint);

            const distance = contactPoint.getDistance();
            if (distance > 0.01) {
                return;
            }


            //get rigidbody
            let colWrapper0 = Ammo.wrapPointer(colObj0Wrap, Ammo.btCollisionObjectWrapper);
            let rb0 = Ammo.castObject(colWrapper0.getCollisionObject(), Ammo.btRigidBody);

            let colWrapper1 = Ammo.wrapPointer(colObj1Wrap, Ammo.btCollisionObjectWrapper);
            let rb1 = Ammo.castObject(colWrapper1.getCollisionObject(), Ammo.btRigidBody);

            var cbNormal = contactPoint.get_m_normalWorldOnB();
            var normal = new THREE.Vector3(cbNormal.x(), cbNormal.y(), cbNormal.z());

            if (rb0.threeObject.userData.tag != "Player") {
                connectedBody = rb0;
            } else {
                connectedBody = rb1;
            }

            if (normal.y >= minGroundDotProduct) {
                groundContactCount += 1;
                contactNormal.add(normal);
                OnAir = false;

            } else {

                // if(normal.y >= minSlopeDotProduct) {
                //     groundContactCount += 1;
                //     contactNormal.add(normal);
                // }

                // if (OnAir == true && normal.y >= minClimbDotProduct)
                // {

                //     climbContactCount += 1;
                //     climbNormal.add(normal);

                // }
            }


        }

    }

    function OnKeyDown(e) {
        switch (e.key) {
            case "w":
                forward = 1;
                break;
            case "ArrowUp":
                forward = 1;
                break;
            case "a":
                left = 1;
                break;
            case "ArrowLeft":
                left = 1;
                break;
            case "s":
                back = 1;
                break;
            case "ArrowDown":
                back = 1;
                break;
            case "d":
                right = 1;
                break;
            case "ArrowRight":
                right = 1;
                break;
            case " ":
                desiredJump |= 1;
                break;
        }
    }

    function OnKeyUp(e) {
        switch (e.key) {
            case "w":
                forward = 0;
                break;
            case "ArrowUp":
                forward = 0;
                break;
            case "a":
                left = 0;
                break;
            case "ArrowLeft":
                left = 0;
                break;
            case "s":
                back = 0;
                break;
            case "ArrowDown":
                back = 0;
                break;
            case "d":
                right = 0;
                break;
            case "ArrowRight":
                right = 0;
                break;
        }

    }

    function OnTouchJumpBtn() {
        desiredJump |= 1;
    }

    var startRotateCam = false;
    var previousMouseX = null;
    var previousMouseY = null;

    var lock = false;
    function OnMouseDown(e) {
        startRotateCam = true;
        previousMouseX = (e.clientX / window.innerWidth) * 2 - 1;
        previousMouseY = (e.clientY / window.innerHeight) * 2 - 1;

        if(lock == false) {
            document.getElementsByTagName("canvas")[0].requestPointerLock();
            lock = true;
        } else {
            UnlockMouse();
        }
        
    }

    function UnlockMouse() {
        lock = false;
        document.exitPointerLock();
    }


    function OnMouseMove(e) {

        if (lock == true && player != null && allowMove) {
            // var mouseX = previousMouseX - ((e.clientX / window.innerWidth) * 2 - 1);
            // var mouseY = previousMouseY - ((e.clientY / window.innerHeight) * 2 - 1);
            var mouseX = -e.originalEvent.movementX * 0.001;
            var mouseY = -e.originalEvent.movementY * 0.001;
            //update horizontal cam
            //targetRotation += mouseX;
            playerDirection.rotation.y += mouseX;
            playerDirection.updateWorldMatrix();
            //update vertical cam 
            verticalDirection.rotation.x -= mouseY;
            verticalDirection.rotation.x = clamp(verticalDirection.rotation.x, -Math.PI / 12, Math.PI / 6);
            verticalDirection.updateWorldMatrix();
            //
            previousMouseX = (e.clientX / window.innerWidth) * 2 - 1;
            previousMouseY = (e.clientY / window.innerHeight) * 2 - 1;
        }


    }

    function OnMouseUp(e) {
        startRotateCam = false;
    }

    function OnMouseOut(e) {
        startRotateCam = false;
    }

    function getPlayer() {
        return player;
    }

    function getPosition() {
        return new THREE.Vector3(player.position.x, player.position.y, player.position.z)
    }

    function getRotation() {
        return new THREE.Vector3(player.rotation.x, player.rotation.y, player.rotation.z)
    }

    function clamp(val, min, max) {
        return Math.min(Math.max(val, min), max);
    }

    function lerpRotation(start, end, amt) {

        var start = start % (2 * Math.PI);
        var end = end % (2 * Math.PI);

        if (Math.abs(start - end) > Math.abs(start - end - 2 * Math.PI)) {
            end = end + 2 * Math.PI;
        }

        if (Math.abs(start - end) > Math.abs(start - end + 2 * Math.PI)) {
            end = end - 2 * Math.PI;
        }

        if (end > start) {
            if (end - start > 0.1) {
                return start + amt * (end - start);
            } else {
                return end;
            }
        } else {
            if (start - end > 0.1) {
                return start + amt * (end - start);
            } else {
                return end;
            }
        }
    }

    function lerp(start, end, amt) {

        if (end > start) {
            if (end - start > 0.1) {
                return start + amt * (end - start);
            } else {
                return end;
            }
        } else {
            if (start - end > 0.1) {
                return start + amt * (end - start);
            } else {
                return end;
            }
        }


    }

    return {
        init: init,
        update: update,
        toggleKinematic: setKinematic,
        toggleMoving: toggleMoving,
        getPosition: getPosition,
        getRotation: getRotation,
        getPlayer: getPlayer,
        distanceToPlayer: distanceToPlayer,
        OnKeyDown: OnKeyDown,
        OnKeyUp: OnKeyUp,
        OnMouseMove: OnMouseMove,
        OnMouseDown: OnMouseDown,
        OnMouseUp: OnMouseUp,
        OnMouseOut: OnMouseOut,
        OnTouchJumpBtn: OnTouchJumpBtn,
        UnlockMouse: UnlockMouse
    }
}

