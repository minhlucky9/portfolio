var NPC_BLACKSMITH_DATA = {
    normalDialog: [
        {
            default: "dialog1",
            dialog1: {
                "message": "Sorry young one, I'm exhausted. Please come back tomorrow.",
                "voice": "voice_thoren",
                "buttons": [
                    {
                        "content": "ALRIGHT",
                        "style": "green",
                        "func": null,
                        "callback": false,
                        "goTo": null
                    }
                ]
            }
        }
    ],
    questDialog: {
        "daily-crystal-quest-start": {
            default: "dialog1",
            dialog1: {
                "message": "You are looking for the Red Diamonds? \nSuch things do not exist in the nature.",
                "voice": "voice_thoren",
                "buttons": [
                    {
                        "content": "NEXT",
                        "style": "green",
                        "func": null,
                        "callback": false,
                        "goTo": "dialog2"
                    }
                ]
            },
            dialog2: {
                "message": "Don't look so disappointed! If you bring me <span class='text-bold'>5 Blue Crystals</span>, \nI can turn them into <span class='text-bold'>1 Red Diamond</span>.",
                "voice": "voice_thoren",
                "buttons": [
                    {
                        "content": "NEXT",
                        "style": "green",
                        "func": null,
                        "callback": false,
                        "goTo": "dialog3"
                    }
                ]
            },
            dialog3: {
                "message": "Blue Crystals are scattered around here, \ncollect them and come back here.",
                "voice": "voice_thoren",
                "buttons": [
                    {
                        "content": "I'M NOT READY..",
                        "style": "orange",
                        "func": null,
                        "callback": false,
                        "goTo": null
                    },
                    {
                        "content": "LET'S DO IT!",
                        "style": "green",
                        "func": function () {
                            questController.UpdateQuestProgress("daily-crystal-quest", null);
                            questController.UpdateQuestProgress("daily-crystal-quest-repeat", null);
                        },
                        "callback": false,
                        "goTo": null
                    },
                ]
            }
        },

        "daily-crystal-quest-onprogress": {
            default: "dialog1",
            dialog1: {
                "message": "Collect 5 Blue Crystals and come back here.",
                "voice": "voice_thoren",
                "buttons": [
                    {
                        "content": "ALRIGHT",
                        "style": "green",
                        "func": null,
                        "callback": false,
                        "goTo": null
                    }
                ]
            }
        },

        "daily-crystal-quest-complete": {
            default: "dialog1",
            dialog1: {
                "message": "You want to make <span class='text-bold'>5 Blue Crystals</span> into <span class='text-bold'>1 Red Diamond</span>?",
                "voice": "voice_thoren",
                "buttons": [
                    
                    {
                        "content": "NO",
                        "style": "orange",
                        "func": null,
                        "callback": false,
                        "goTo": "dialog3"
                    },
                    {
                        "content": "YES",
                        "style": "green",
                        "func": function() {
                            if(inventory["small-crystal"] >= 5) {
                                NPCController['blacksmith'].UpdateConservationCallback("dialog2");
                                addInventory("small-crystal", -5);
                            } else {
                                NPCController['blacksmith'].UpdateConservationCallback("dialog4");
                            }
                        },
                        "callback": true,
                        "goTo": null
                    },
                ]
            },
            dialog2: {
                "message": "Here you go! <span class='text-bold'>One Red Diamond!</span>",
                "voice": "voice_thoren",
                "buttons": [
                    {
                        "content": "THANK YOU",
                        "style": "green",
                        "func": function() {
                            questController.UpdateQuestProgress("daily-crystal-quest");
                            questController.UpdateQuestProgress("daily-crystal-quest-repeat", null);
                            addInventory("big-crystal", 1);
                            showAnnouncement('+ 1 RED DIAMOND');
                            audioController.activateSound("exchange_item", false);
                            //
                            setTimeout(function() {
                                showPopupFinishQuest("diamond", 1, "\"Blue and Red\"", "Tips: Muu Blacksmith can only convert Red Diamonds twice a day.", "");
                            }, 200)
                        },
                        "callback": false,
                        "goTo": null
                    }
                ]
            },
            dialog3: {
                "message": "No worries. I totally understand. \n Please comeback if you change your mind.",
                "voice": "voice_thoren",
                "buttons": [
                    {
                        "content": "ALRIGHT",
                        "style": "green",
                        "func": null,
                        "callback": false,
                        "goTo": null
                    }
                ]
            },
            dialog4: {
                "message": "You don't have enough Blue Crystals.",
                "voice": "voice_thoren",
                "buttons": [
                    {
                        "content": "ALRIGHT",
                        "style": "green",
                        "func": null,
                        "callback": false,
                        "goTo": null
                    }
                ]
            },
            dialog5: {
                "message": "Sorry young one, I'm exhausted. Please come back tomorrow.",
                "voice": "voice_thoren",
                "buttons": [
                    {
                        "content": "ALRIGHT",
                        "style": "green",
                        "func": null,
                        "callback": false,
                        "goTo": null
                    }
                ]
            },
             
        },
        "daily-crystal-quest-complete-repeat": {
            default: "dialog1",
            dialog1: {
                "message": "You want to make <span class='text-bold'>5 Blue Crystals</span> into <span class='text-bold'>1 Red Diamond</span>?",
                "voice": "voice_thoren",
                "buttons": [
                    {
                        "content": "NO",
                        "style": "orange",
                        "func": null,
                        "callback": false,
                        "goTo": "dialog3"
                    },
                    {
                        "content": "YES",
                        "style": "green",
                        "func": function() {
                            if(inventory["small-crystal"] >= 5) {
                                NPCController['blacksmith'].UpdateConservationCallback("dialog2");
                                addInventory("small-crystal", -5);
                            } else {
                                NPCController['blacksmith'].UpdateConservationCallback("dialog4");
                            }
                        },
                        "callback": true,
                        "goTo": null
                    },
                ]
            },
            dialog2: {
                "message": "Here you go! <span class='text-bold'>One Red Diamond!</span>",
                "voice": "voice_thoren",
                "buttons": [
                    {
                        "content": "THANK YOU",
                        "style": "green",
                        "func": function() {
                            questController.UpdateQuestProgress("daily-crystal-quest");
                            questController.UpdateQuestProgress("daily-crystal-quest-repeat", null);
                            addInventory("big-crystal", 1);
                            showAnnouncement('+ 1 RED DIAMOND');
                            audioController.activateSound("exchange_item", false);
                            //
                            setTimeout(function() {
                                showPopupFinishQuest("diamond", 1, "\"Blue and Red (Repeat)\"", "Tips: Muu Blacksmith can only convert Red Diamonds twice a day.", "");
                            }, 200)
                        },
                        "callback": false,
                        "goTo": null
                    }
                ]
            },
            dialog3: {
                "message": "No worries. I totally understand. \n Please comeback if you change your mind.",
                "voice": "voice_thoren",
                "buttons": [
                    {
                        "content": "ALRIGHT",
                        "style": "green",
                        "func": null,
                        "callback": false,
                        "goTo": null
                    }
                ]
            },
            dialog4: {
                "message": "You don't have enough Blue Crystals.",
                "voice": "voice_thoren",
                "buttons": [
                    {
                        "content": "ALRIGHT",
                        "style": "green",
                        "func": null,
                        "callback": false,
                        "goTo": null
                    }
                ]
            },
            dialog5: {
                "message": "Sorry young one, I'm exhausted. Please come back tomorrow.",
                "voice": "voice_thoren",
                "buttons": [
                    {
                        "content": "ALRIGHT",
                        "style": "green",
                        "func": null,
                        "callback": false,
                        "goTo": null
                    }
                ]
            },
             
        },
    }
}