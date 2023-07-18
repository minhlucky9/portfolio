THREE.QuestController = function() {
    var QUESTTYPE = { COLLECTING: 0, TALKING: 1, COLLECTINGFROMNPC: 2 };
    var QUESTSTATE = { NOTSTART: 0, ONPROGRESS: 1, COMPLETED: 2 }
    var listCurrentQuest = [];
    var listQuest = {
        "daily-coin-quest" : {
            "currentStep": "step1",
            "type": "daily-quest",
            "process": {
                "step1": {
                    "name": "Gift of the Elder",
                    "desscription": "Talk to the Antuk Elder",
                    "type": QUESTTYPE.TALKING,
                    "npc": "elder",
                    "npc_status": "HAVEQUEST",
                    "conservation": "daily-coin-quest",
                    "onCompleteStep": function() {
                        NPCController["elder"].setState(NPCController["elder"].NPCSTATE.PROGRESS, "daily-coin-quest-onprogress");
                    },
                    "nextStep": "step2" 
                }, 
                "step2": {
                    "name": "Gift of the Elder",
                    "desscription": "Talk to the Antuk Bard",
                    "type": QUESTTYPE.TALKING,
                    "npc": "flute",
                    "npc_status": "QUESTCOMPLETE",
                    "conservation": "daily-coin-quest",
                    "items": "small-crystal",
                    "onCompleteStep": null,
                    "nextStep": null 
                }
            },
            "status": QUESTSTATE.NOTSTART,
            "onfinish": function() {
                NPCController["elder"].setState(NPCController["elder"].NPCSTATE.DEFAULT, "");
            }
        },
        "daily-crystal-quest" : {
            "currentStep": "step1",
            "type": "daily-quest",
            "process": {
                "step1": {
                    "name": "Blue and Red",
                    "desscription": "Talk to the Muu Blacksmith",
                    "conservation": "daily-crystal-quest-start",
                    "type": QUESTTYPE.TALKING,
                    "npc": "blacksmith",
                    "npc_status": "HAVEQUEST",
                    "onCompleteStep": null,
                    "nextStep": "step2" 
                },
                "step2": {
                    "name": "Blue and Red",
                    "desscription": "Gather Blue Crystals on map (%c/%t)",
                    "conservation": "daily-crystal-quest-onprogress",
                    "type": QUESTTYPE.COLLECTING,
                    "items": "small-crystal",
                    "npc": "blacksmith",
                    "npc_status": "PROGRESS",
                    "target": 5,
                    "current": 0,
                    "onCompleteStep": null,
                    "nextStep": "step3" 
                },
                "step3": {
                    "name": "Blue and Red",
                    "desscription": "Gather Blue Crystals on map (%c/%t)\nTalk to the Muu Blacksmith",
                    "conservation": "daily-crystal-quest-complete",
                    "type": QUESTTYPE.TALKING,
                    "items": "small-crystal",
                    "npc": "blacksmith",
                    "npc_status": "QUESTCOMPLETE",
                    "target": 5,
                    "current": 0,
                    "onCompleteStep": null,
                    "nextStep": "step4" 
                },
                "step4": {
                    "name": "Blue and Red (Repeat)",
                    "desscription": "Talk to the Muu Blacksmith",
                    "conservation": "daily-crystal-quest-start",
                    "type": QUESTTYPE.TALKING,
                    "npc": "blacksmith",
                    "npc_status": "HAVEQUEST",
                    "onCompleteStep": null,
                    "nextStep": "step5" 
                },
                "step5": {
                    "name": "Blue and Red (Repeat)",
                    "desscription": "Gather Blue Crystals on map (%c/%t)",
                    "conservation": "daily-crystal-quest-onprogress",
                    "type": QUESTTYPE.COLLECTING,
                    "items": "small-crystal",
                    "npc": "blacksmith",
                    "npc_status": "PROGRESS",
                    "target": 5,
                    "current": 0,
                    "onCompleteStep": null,
                    "nextStep": "step6" 
                },
                "step6": {
                    "name": "Blue and Red (Repeat)",
                    "desscription": "Gather Blue Crystals on map (%c/%t)\nTalk to the Muu Blacksmith",
                    "conservation": "daily-crystal-quest-complete-repeat",
                    "type": QUESTTYPE.TALKING,
                    "items": "small-crystal",
                    "npc": "blacksmith",
                    "npc_status": "QUESTCOMPLETE",
                    "target": 5,
                    "current": 0,
                    "onCompleteStep": null,
                    "nextStep": null 
                }
            },
            "status": QUESTSTATE.NOTSTART,
            "onfinish": function() {
                
            }
        },
        "exchange-ticket" : {
            "currentStep": "step1",
            "type": "daily-quest",
            "process": {
                "step1": {
                    "name": "Lucky Ticket",
                    "desscription": "Collect red diamonds (%c/%t)",
                    "conservation": "exchange-items-progress",
                    "type": QUESTTYPE.COLLECTINGFROMNPC,
                    "items": "big-crystal",
                    "npc": "altar-tree",
                    "npc_status": "PROGRESS",
                    "target": 2,
                    "current": 0,
                    "onCompleteStep": null,
                    "nextStep": "step2"  
                },
                "step2": {
                    "name": "Lucky Ticket",
                    "desscription": "Collect red diamonds (%c/%t) \nGo to Altar Tree to complete quest",
                    "conservation": "exchange-items",
                    "type": QUESTTYPE.TALKING,
                    "items": "big-crystal",
                    "npc": "altar-tree",
                    "npc_status": "QUESTCOMPLETE",
                    "target": 2,
                    "current": 0,
                    "onCompleteStep": null,
                    "nextStep": null  
                }
            },
            "status": QUESTSTATE.NOTSTART,
            "onfinish": function() {
                
            }
        }
    };

    function ShowQuestTip(name) { 
        var quest = listQuest[name];
        var currentStep = quest.process[quest.currentStep];

        if(quest.status != QUESTSTATE.COMPLETED) {
            if(currentStep.type == QUESTTYPE.COLLECTING) {
                drawFlash(itemGenerator.getCurrentItemPositions());
            }
            
            if(currentStep.type == QUESTTYPE.TALKING) {
                var flashPosArray = [
                    NPCController[currentStep.npc].getPosition()
                ];
                drawFlash(flashPosArray);
            }
        }
        
    }    

    function ActivateQuest(name) {
        listQuest[name].states = QUESTSTATE.ONPROGRESS;
        listCurrentQuest.push(name);
        //
        var quest = listQuest[name];
        var currentStep = quest.process[quest.currentStep];
        //
        switch(currentStep.type) {
            case QUESTTYPE.TALKING:
                NPCController[currentStep.npc].setState(NPCController[currentStep.npc].NPCSTATE[currentStep.npc_status], currentStep.conservation);
                break;
            case QUESTTYPE.COLLECTINGFROMNPC:
                NPCController[currentStep.npc].setState(NPCController[currentStep.npc].NPCSTATE[currentStep.npc_status], currentStep.conservation);
                break;
            case QUESTTYPE.COLLECTING:
                NPCController[currentStep.npc].setState(NPCController[currentStep.npc].NPCSTATE[currentStep.npc_status], currentStep.conservation);
                //generate crystal
                for(var i = 0; i < currentStep.target; i ++) {
                    itemGenerator.generate(currentStep.items, name);
                }
                
                break;
        }

        //
        updateQuestUI();
    }

    function UpdateCollectingQuest() {
        for(var i = 0; i < listCurrentQuest.length; i++) {
            var quest = listQuest[listCurrentQuest[i]];
            var name = listCurrentQuest[i];
            //check current step of quest
            var currentStep = quest.process[quest.currentStep];
      
            if(currentStep.type == QUESTTYPE.COLLECTING || currentStep.type == QUESTTYPE.COLLECTINGFROMNPC) {
                currentStep.current = inventory[currentStep.items];
                if(currentStep.current >= currentStep.target) {
                    ActivateNextStep(name);
                }
            }

        }
        
        updateQuestUI();
    }

    function FinishQuest(name) { 
        var quest = listQuest[name];
        var currentStep = quest.process[quest.currentStep];
        NPCController[currentStep.npc].setState(NPCController[currentStep.npc].NPCSTATE.DEFAULT, "");
        if(currentStep.type == QUESTTYPE.COLLECTING) {
            setTimeout(function() {
                itemGenerator.clearItems();
            }, 200);
        }
        //
        quest.status = QUESTSTATE.COMPLETED;
        quest.onfinish();

        updateQuestUI();
    }

    function IsDailyQuestComplete() { 
        var quest_count = 0;
        for(var i = 0; i < listCurrentQuest.length; i++) {
            var quest = listQuest[listCurrentQuest[i]];
            if(quest.type == "daily-quest") {
                quest_count ++;
                if(quest.status != QUESTSTATE.COMPLETED) {
                    return false;
                }
            }
        }
        
        if(quest_count > 0) {
            return true;
        } else {
            return false;
        }

    }

    function IsWeeklyQuestComplete() { 
        var quest_count = 0;
        for(var i = 0; i < listCurrentQuest.length; i++) {
            var quest = listQuest[listCurrentQuest[i]];
            if(quest.type == "weekly-quest") {
                quest_count ++;
                if(quest.status != QUESTSTATE.COMPLETED) {
                    return false;
                }
            }
        }
        
        if(quest_count > 0) {
            return true;
        } else {
            return false;
        }
    }

    function UpdateQuestProgress(name, amount) {
        if(listCurrentQuest.includes(name)) {
            var quest = listQuest[name];
            var currentStep = quest.process[quest.currentStep];
    
            switch(currentStep.type) {
                case QUESTTYPE.TALKING:
                    ActivateNextStep(name);
                    break;
                case QUESTTYPE.COLLECTINGFROMNPC:
                    if(inventory[currentStep.items] >= currentStep.target) {
                        ActivateNextStep(name);
                    }
                    break;
                case QUESTTYPE.COLLECTING:
                    if(inventory[currentStep.items] >= currentStep.target) {
                        ActivateNextStep(name);
                    }
                    break;
            }
            
            updateQuestUI();
        }
    }

    function ActivateNextStep(name) {
        var quest = listQuest[name];
        var currentStep = quest.process[quest.currentStep];
        NPCController[currentStep.npc].setState(NPCController[currentStep.npc].NPCSTATE.DEFAULT, "");
        if(currentStep.type == QUESTTYPE.COLLECTING) {
            setTimeout(function() {
                itemGenerator.clearItems();
            }, 200);
        }
        //
        if(currentStep.onCompleteStep != null) {
            currentStep.onCompleteStep();
        }
        
        if(currentStep.nextStep != null) {
            quest.currentStep = currentStep.nextStep;
            var nextStep = quest.process[currentStep.nextStep];
            //
            switch(nextStep.type) {
                case QUESTTYPE.TALKING:
                    NPCController[nextStep.npc].setState(NPCController[nextStep.npc].NPCSTATE[nextStep.npc_status], nextStep.conservation);
                    break;
                case QUESTTYPE.COLLECTINGFROMNPC:
                    NPCController[nextStep.npc].setState(NPCController[nextStep.npc].NPCSTATE[nextStep.npc_status], nextStep.conservation);
                    break;
                case QUESTTYPE.COLLECTING:
                    NPCController[nextStep.npc].setState(NPCController[nextStep.npc].NPCSTATE[nextStep.npc_status], nextStep.conservation);
                    nextStep.current = 0;

                    //update from inventory
                    UpdateQuestProgress(name, inventory[nextStep.items]);

                    if(inventory[nextStep.items] < nextStep.target) {
                        itemGenerator.resetPositionPool();
                        //generate crystal
                        for(var i = inventory[nextStep.items]; i < nextStep.target; i ++) {
                            itemGenerator.generate(nextStep.items, name);
                        }
                    }
                
                    break;
            }
        } else {
            quest.status = QUESTSTATE.COMPLETED;
            quest.onfinish();
        }

        updateQuestUI();
    }

    function update() {
        
    }

    function updateQuestUI() {
        for(var i = 0; i < listCurrentQuest.length; i++) {
            var quest = listQuest[listCurrentQuest[i]];
            //check current step of quest
            var currentStep = quest.process[quest.currentStep];
            //update quest status
            if(currentStep.target == null) {
                updateQuest(currentStep.name, currentStep.desscription, listCurrentQuest[i], quest.status, currentStep.npc_status, quest.type);
  
            } else {
                var status = "PROGRESS";
                if(currentStep.target <= inventory[currentStep.items]) {
                    var status = "QUESTCOMPLETE";
                } 

                var description = currentStep.desscription.replace('%c', inventory[currentStep.items]);
                description = description.replace('%t', currentStep.target);

                updateQuest(currentStep.name, description, listCurrentQuest[i], quest.status, status, quest.type);
            }
        }
    }

    function ShowAnnounceCompleteDaily() { 
        if(IsDailyQuestComplete() == true) {
            $('.minigameUI .popup-complete .popup-complete-label').html("GOOD JOB!");
            $('.minigameUI .popup-complete .popup-title').html("ALL DAILY QUESTS COMPLETED!");
            $('.minigameUI .popup-complete .announce-description').html("New quests will be available tomorrow.")
            $('.minigameUI .popup-complete').fadeIn(300);
        }

     }

     function ShowAnnounceCompleteWeekly() { 
        if(IsWeeklyQuestComplete() == true) {
            $('.minigameUI .popup-complete .popup-complete-label').html("FANTASTIC!");
            $('.minigameUI .popup-complete .popup-title').html("ALL WEEKLY QUESTS COMPLETED!");
            $('.minigameUI .popup-complete .announce-description').html("Your Hero have collected all Lottery Tickets in this season")
            $('.minigameUI .popup-complete').fadeIn(300);
        }
     }

    return {
        update: update,
        ActivateQuest: ActivateQuest,
        ActivateNextStep: ActivateNextStep,
        UpdateQuestProgress: UpdateQuestProgress,
        UpdateCollectingQuest: UpdateCollectingQuest,
        FinishQuest: FinishQuest,
        ShowAnnounceCompleteDaily: ShowAnnounceCompleteDaily,
        ShowAnnounceCompleteWeekly: ShowAnnounceCompleteWeekly,
        QUESTSTATE: QUESTSTATE,
        ShowQuestTip: ShowQuestTip
    }
}