THREE.NPCController = function () {
    var npc;
    var animationController;
    var NPCSTATE = { DEFAULT: 0 , QUESTCOMPLETE: 1 , PROGRESS: 2, HAVEQUEST: 3 }
    var currentState = NPCSTATE.DEFAULT;
    var currentQuest;
    var spriteState;
    var interacable = true;
    var allowInteract = false;
    var currentDialog = null;
    var currentMessage = null;
    var normalDialog = null;
    var questDialog = null;
    var radius;
    var spriteOffset;

    function init(obj, _questDialog, _normalDialog, _radius, _spriteOffset, _npcname) {
        npc = obj;
        questDialog = _questDialog;
        normalDialog = _normalDialog;
        radius = _radius;
        spriteOffset = _spriteOffset;
        //
        animationController = new THREE.AnimationMixer(obj);
        if(obj.animations.length > 0) {
            animationController.clipAction(obj.animations[0]).play();
        }
        //
        setNPCName(_npcname);
        setState(NPCSTATE.DEFAULT, "");
    }

    function update(delta) {
        if (npc) {
            if (playerController) {
                var distance = playerController.distanceToPlayer(npc.position.clone().add(new THREE.Vector3(0, 0.4, 0)));
                if (distance != null && Math.abs(distance) < radius) {
                    allowInteract = true;

                } else {
                    
                    allowInteract = false;
                }
            }

            //
            animationController.update(delta);
        }
    }

    function setNPCName(npcname) {
        
        var fontface = "Arial";
        var fontsize = 22;
        var borderThickness =  6;
        var borderColor =  { r:0, g:0, b:0, a:1.0 };
        var backgroundColor =  { r:255, g:255, b:255, a:1.0 };
        var textColor = { r:255, g:255, b:255, a:1.0 };
   
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        context.font = "Bold " + fontsize + "px " + fontface;
        context.fillStyle   = "rgba(" + backgroundColor.r + "," + backgroundColor.g + "," + backgroundColor.b + "," + backgroundColor.a + ")";
        context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + "," + borderColor.b + "," + borderColor.a + ")";
        context.lineWidth = borderThickness;
        context.fillStyle = "rgba("+textColor.r+", "+textColor.g+", "+textColor.b+", 1.0)";
        context.textAlign = "center";
        context.fillText( npcname, canvas.width / 2, canvas.height / 2);

        var texture = new THREE.Texture(canvas) 
        texture.needsUpdate = true;

        var material = new THREE.SpriteMaterial({ map: texture });
        var spriteName = new THREE.Sprite(material);
        //
        spriteName.position.set(npc.position.x + spriteOffset.x , npc.position.y + spriteOffset.y + 1, npc.position.z + spriteOffset.z);
        spriteName.scale.set(0.05 * fontsize, 0.025 * fontsize, 0.075 * fontsize);
        scene.add(spriteName);

    }

    function setState(state, questname) {
        if (spriteState) {
            scene.remove(spriteState);
        }

        //
        var map;
        switch (state) {
            case NPCSTATE.QUESTCOMPLETE:
                map = new THREE.TextureLoader().load('images/ingame/Symbols-01.png');
                currentState = NPCSTATE.QUESTCOMPLETE;
                currentQuest = questname;
                break;
            case NPCSTATE.DEFAULT:
                map = new THREE.TextureLoader().load('images/ingame/bubble_dialogue.png');
                currentState = NPCSTATE.DEFAULT;
                break;
            case NPCSTATE.HAVEQUEST:
                map = new THREE.TextureLoader().load('images/ingame/Symbols-03.png');
                currentState = NPCSTATE.HAVEQUEST;
                currentQuest = questname;
                break;
            case NPCSTATE.PROGRESS:
                map = new THREE.TextureLoader().load('images/ingame/Symbols-02.png');
                currentState = NPCSTATE.PROGRESS;
                currentQuest = questname;
                break;
            default:
                map = new THREE.TextureLoader().load('images/ingame/bubble_dialogue.png');
                currentState = NPCSTATE.DEFAULT;
                return;
        }

        var material = new THREE.SpriteMaterial({ map: map });
        spriteState = new THREE.Sprite(material);
        //
        spriteState.position.set(npc.position.x + spriteOffset.x, npc.position.y + 1.3 + spriteOffset.y, npc.position.z + spriteOffset.z);
        spriteState.scale.set(0.4, 0.4, 0.4);
        scene.add(spriteState);
    }

    function OnKeyUp(e) {
        switch (e.key) {
            case "e" || "E":
                if (interacable && allowInteract) {
                    interacable = false;
                    if (playerController) {
                        playerController.toggleMoving(false);
                    }
                    StartConservation();
                    //
                    playerController.UnlockMouse();
                }
                break;
        }

    }

    function OnTouchTalkBtn() {
        if (interacable && allowInteract) {
            interacable = false;
            if (playerController) {
                playerController.toggleMoving(false);
            }
            StartConservation();
        }
    }

    function StartConservation() {
        $('.minigameUI').fadeOut(300, function () {
            switch (currentState) {
                case NPCSTATE.DEFAULT:
                    var rand = Math.round(Math.random() * (normalDialog.length - 1));
                    
                    currentDialog = normalDialog[rand];
                    currentMessage = currentDialog[currentDialog.default];

                    UpdateConservation();
                    break;

                case NPCSTATE.PROGRESS:
                    
                    currentDialog = questDialog[currentQuest];
                    
                    currentMessage = currentDialog[currentDialog.default];
                    UpdateConservation();
                    break;
                    
                case NPCSTATE.QUESTCOMPLETE:
                    
                    currentDialog = questDialog[currentQuest];
                        
                    currentMessage = currentDialog[currentDialog.default];
                    UpdateConservation();
                    break;
                
                case NPCSTATE.HAVEQUEST:
                    
                    currentDialog = questDialog[currentQuest];
                            
                    currentMessage = currentDialog[currentDialog.default];
                    UpdateConservation();
                    break;
            }
        })
    }

    function UpdateConservation() {

        if (currentMessage != null) {
            $(".NPCDialog .dialog-content p").html(currentMessage.message);

            var listBtnHtml = "";
            for (var i = 0; i < currentMessage.buttons.length; i++) {
                listBtnHtml += '<div class="dialog-btn '+ (currentMessage.buttons[i].style == "green"?"green-bg":"orange-bg") +'">' 
                    + currentMessage.buttons[i].content + '</div>';
            }

            $(".NPCDialog .dialog-button-list").html(listBtnHtml);

            $('.NPCDialog').fadeIn(300, function () {
                //activate voice
                audioController.activateVoice(currentMessage.voice);
                //
                for (var i = 0; i < currentMessage.buttons.length; i++) {
                    let index = i;

                    $('.NPCDialog .dialog-button-list .dialog-btn').eq(index).on("click", function (e) {
                        $('.NPCDialog').fadeOut(300, function () {
                            audioController.stopCurrentVoice();
                            //
                            if(currentMessage.buttons[index].callback == false) {
                                
                                if (currentMessage.buttons[index].func != null) {
                                    currentMessage.buttons[index].func();
                                }

                                if (currentMessage.buttons[index].goTo != null) {
                                    currentMessage = currentDialog[currentMessage.buttons[index].goTo];
                                    UpdateConservation();
                                } else {
                                    currentDialog = null;
                                    EndConservation();
                                }

                            } else {

                                if (currentMessage.buttons[index].func != null) {
                                    currentMessage.buttons[index].func();
                                }
                            }
                        })
                    })
                }
            });
        }
    }

    function UpdateConservationCallback(goTo) {
        if (goTo != null) {
            currentMessage = currentDialog[goTo];
            UpdateConservation();
        } else {
            currentDialog = null;
            EndConservation();
            
        }
    }

    function EndConservation() {
        $('.minigameUI').fadeIn(300, function () {
            interacable = true;
            if (playerController) {
                playerController.toggleMoving(true);
            }
        })
    }

    function isAllowInteract() {
        return allowInteract;
    }

    function getPosition() {
        return new THREE.Vector3(npc.position.x, npc.position.y, npc.position.z);
    }

    return {
        init: init,
        update: update,
        setState: setState,
        UpdateConservationCallback:UpdateConservationCallback,
        NPCSTATE: NPCSTATE,
        isAllowInteract: isAllowInteract,
        OnKeyUp: OnKeyUp,
        OnTouchTalkBtn: OnTouchTalkBtn,
        getPosition: getPosition
    }
}