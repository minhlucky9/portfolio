var NPC_ELDER_DATA = {
    normalDialog: [
        {
            default: "dialog1",
            dialog1: {
                "message": "Young hero, I believe you can save us all.",
                "voice": "voice_giahuongdao",
                "buttons": [
                    {
                        "content": "GOT IT",
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
                "message": "Welcome young chieftain! \n The <span class='text-bold'>Source Tree</span> of this land is withering away, making the ground barren.",
                "voice": "voice_giahuongdao",
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
                "message": "If you want to be the savior of the Forbidden Land, \n find the <span class='text-bold'>Antuk Bard</span>, he may show you the way.",
                "voice": "voice_giahuongdao",
                "buttons": [
                    {
                        "content": "I'M NOT READY..",
                        "style": "orange",
                        "func": null,
                        "callback": false,
                        "goTo": "dialog3"
                    },
                    {
                        "content": "LET'S DO IT!",
                        "style": "green",
                        "func": function() {
                            questController.UpdateQuestProgress("daily-coin-quest");
                        },
                        "callback": false,
                        "goTo": null
                    },
                ]
            },
            dialog3: {
                "message": "How unfortunate! Maybe you are not the destined savior of the Forbidden Land.",
                "voice": "voice_giahuongdao",
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
        "daily-coin-quest-onprogress": {
            default: "dialog1",
            dialog1: {
                "message": "Do not hesitate any longer, young chieftain. \nGo straight this way, to the village and you will see the <span class='text-bold'>Antuk Bard</span>.",
                "voice": "voice_giahuongdao",
                "buttons": [
                    {
                        "content": "GOT IT",
                        "style": "green",
                        "func": null,
                        "callback": false,
                        "goTo": null
                    }
                ]
            },
        }
    }
}