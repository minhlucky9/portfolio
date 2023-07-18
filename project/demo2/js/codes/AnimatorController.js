THREE.AnimatorController = function() {
    var anims = {};
    var animatorMixer;
    var currentBlock, nextBlock;
    var animatorBlock = {
        isRunning: false,
        isJumping: false,
        isPray: false
    };

    animatorBlock.idle = {
        anim: "idle",
        fadeTo: [
            {
                block: "run",
                conditions: [
                    {
                        type: "equal",
                        variable: "isRunning",
                        desireValue: true
                    }
                ]
            },
            {
                block: "jump",
                conditions: [
                    {
                        type: "equal",
                        variable: "isJumping",
                        desireValue: true
                    }
                ]
            },
            {
                block: "pray",
                conditions: [
                    {
                        type: "trigger",
                        variable: "isPray",
                        desireValue: true
                    }
                ]
            }
        ]
    }

    animatorBlock.run = {
        anim: "run",
        fadeTo: [
            {
                block: "idle",
                conditions: [
                    {
                        type: "equal",
                        variable: "isRunning",
                        desireValue: false
                    }
                ]
            },
            {
                block: "jump",
                conditions: [
                    {
                        type: "equal",
                        variable: "isJumping",
                        desireValue: true
                    }
                ]
            }
        ]
    }

    animatorBlock.jump = {
        anim: "jump",
        fadeTo: [
            {
                block: "idle",
                conditions: [
                    {
                        type: "equal",
                        variable: "isJumping",
                        desireValue: false
                    }
                ]
            }
        ]
    }

    animatorBlock.pray = {
        anim: "pray",
        fadeTo: [
            {
                block: "idle",
                conditions: [
                    {
                        type: "timeout",
                        variable: "isPray",
                        desireValue: true
                    }
                ]
            }
        ]
    }

    currentBlock = animatorBlock.idle;

    function setState(key, value) {
        animatorBlock[key] = value;
    }

    function init(obj) {
        animatorMixer = new THREE.AnimationMixer(obj);
        anims.idle = animatorMixer.clipAction(obj.animations[0]);
        anims.idle.play();

        //load other anim
        new THREE.FBXLoader().load('models/Character/'+ loginData.clanName.toLowerCase() +'/'+ loginData.clanName.toLowerCase() +'_run.fbx', function (run) {
            anims.run = animatorMixer.clipAction(run.animations[0]);
            setWeight(anims.run, 0);
            anims.run.play();
        })

        new THREE.FBXLoader().load('models/Character/'+ loginData.clanName.toLowerCase() +'/'+ loginData.clanName.toLowerCase() +'_jump.fbx', function (jump) {
            anims.jump = animatorMixer.clipAction(jump.animations[0]);
            setWeight(anims.jump, 0);
            anims.jump.play();
        })

        new THREE.FBXLoader().load('models/Character/'+ loginData.clanName.toLowerCase() +'/'+ loginData.clanName.toLowerCase() +'_pray.fbx', function (pray) {
            anims.pray = animatorMixer.clipAction(pray.animations[0]);
            setWeight(anims.pray, 0); 
            anims.pray.play();
        })
    }

    function update(delta) {
        if (currentBlock) {

            if(currentBlock.anim == "run") {
                audioController.activateSound("run", true);
            } else {
                audioController.stopSound("run");
            }

            var cur = currentBlock;
            for (var i = 0; i < cur.fadeTo.length; i++) {
                var fadeCondition = cur.fadeTo[i].conditions[0];
                switch (fadeCondition.type) {
                    case "equal":
                        if (animatorBlock[fadeCondition.variable] == fadeCondition.desireValue) {
                            currentBlock = animatorBlock[cur.fadeTo[i].block];
                            executeCrossFade(anims[cur.anim], anims[currentBlock.anim], 0.2);
                        }
                        break;
    
                    case "trigger":
                        if (animatorBlock[fadeCondition.variable] == fadeCondition.desireValue) {
                            currentBlock = animatorBlock[cur.fadeTo[i].block];
                            executeCrossFade(anims[cur.anim], anims[currentBlock.anim], 0.2);
                        }
                        break;
    
                    case "timeout":
                        if (animatorBlock[fadeCondition.variable] == fadeCondition.desireValue) {
                            animatorBlock[fadeCondition.variable] = !fadeCondition.desireValue;
                            ///asidjhaksjdbakjsd
                            nextBlock = animatorBlock[cur.fadeTo[i].block];
                            synchronizeCrossFade(anims[cur.anim], anims[nextBlock.anim], 0.2, function () {
                                currentBlock = nextBlock;
                            });
    
                        }
                        break;
                }
            }
        }

        if (animatorMixer) {
            animatorMixer.update(delta);
        }
    }

    function synchronizeCrossFade(startAction, endAction, duration, callback) {

        animatorMixer.addEventListener('loop', onLoopFinished);
    
        function onLoopFinished(event) {
    
            if (event.action === startAction) {
    
                animatorMixer.removeEventListener('loop', onLoopFinished);
    
                executeCrossFade(startAction, endAction, duration);
                callback();
            }
    
        }
    
    }
    
    function executeCrossFade(startAction, endAction, duration) {
    
        // Not only the start action, but also the end action must get a weight of 1 before fading
        // (concerning the start action this is already guaranteed in this place)
    
        setWeight(endAction, 1);
        endAction.time = 0;
        // Crossfade with warping - you can also try without warping by setting the third parameter to false
    
        startAction.crossFadeTo(endAction, duration, true);
    }

    function setWeight(action, weight) {
    
        action.enabled = true;
        action.setEffectiveTimeScale(1);
        action.setEffectiveWeight(weight);
    }

    return {
        update: update,
        init: init,
        setState: setState
    }
}