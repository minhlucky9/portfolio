var NPC_FLUTE_DATA = {
    normalDialog: [
        {
            default: "dialog1",
            dialog1: {
                "message": "I only talk to people trusted by The Elder.",
                "voice": "voice_thoisao",
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
        "daily-coin-quest": {
            default: "dialog1",
            dialog1: {
                "message": "To revitalize the Source Tree, \nyou need to sacrifice <span class='text-bold'>Red Diamonds</span> to the Tree.",
                "voice": "voice_thoisao",
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
                "message": "I've been trying so hard to get those diamonds, \nbut those <span class='text-bold'>Blue Crystals</span> are all I can find. Take them, maybe you can do something.",
                "voice": "voice_thoisao",
                "buttons": [
                    {
                        "content": "THANK YOU",
                        "style": "green",
                        "func": null,
                        "callback": false,
                        "goTo": "dialog3"
                    }
                ]
            },
            dialog3: {
                "message": "Go talk to the <span class='text-bold'>Muu Blacksmith</span>,\nI heard he has information about the diamonds.",
                "voice": "voice_thoisao",
                "buttons": [
                    {
                        "content": "ALRIGHT",
                        "style": "green",
                        "func": function() {
                            questController.UpdateQuestProgress("daily-coin-quest", 5);
                            addInventory("small-crystal", 5);
                            showAnnouncement('+ 5 BLUE CRYSTAL');
                            audioController.activateSound("exchange_item", false);
                            //
                            setTimeout(function() {
                                showPopupFinishQuest("crystal", 5, "\"Gift of the Elder\"", "Tips: Talk to Muu Blacksmith to convert Blue Crystals to Red Diamonds", "");
                            }, 200)
                        },
                        "callback": false,
                        "goTo": null
                    }
                ]
            },
            dialog4: {
                "message": "You have receive this reward.",
                "voice": "voice_thoisao",
                "buttons": [
                    {
                        "content": "ALRIGHT",
                        "style": "green",
                        "func": function() {
                            questController.UpdateQuestProgress("daily-coin-quest", 5);
                        },
                        "callback": false,
                        "goTo": null
                    }
                ]
            }
        },
    }
}