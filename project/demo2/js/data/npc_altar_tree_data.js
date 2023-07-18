var currentCode = "";
var NPC_ALTAR_TREE_DATA = {
    normalDialog: [
        {
            default: "dialog1",
            dialog1: {
                "message": "This NPC is updating.",
                "voice": null,
                "buttons": [
                    {
                        "content": "Next",
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
        "exchange-items": {
            default: "dialog1",
            dialog1: {
                "message": "Do you want to sacrifice for the Source Tree?",
                "voice": null,
                "buttons": [
                    {
                        "content": "NO",
                        "style": "orange",
                        "func": null,
                        "callback": false,
                        "goTo": "dialog4"
                    },
                    {
                        "content": "YES",
                        "style": "green",
                        "func": function() {
                            // GetTicketEmail(function(data) {
                            //     if(data.code == 200) {
                            //         NPCController['altar-tree'].UpdateConservationCallback("dialog2");
                            //         addInventory("big-crystal", -2);
                            //         SetTimeLine();
                            //         currentCode = data.ticketCode;
                            //     } else {
                            //         NPCController['altar-tree'].UpdateConservationCallback("dialog3");
                            //     }
                                
                            // })
                            NPCController['altar-tree'].UpdateConservationCallback("dialog2");
                            addInventory("big-crystal", -2);
                            SetTimeLine();
                            currentCode = "Ah79K";
                        },
                        "callback": true,
                        "goTo": null
                    },
                ]
            },
            dialog2: {
                "message": "Here your Lucky Ticket. \n Your lucky number had been sent to your email.",
                "voice": null,
                "buttons": [
                    {
                        "content": "THANK YOU",
                        "style": "green",
                        "func": function() {
                            addInventory("ticket", 1);
                            showAnnouncement('+ 1 Lucky Ticket');
                            questController.UpdateQuestProgress("exchange-ticket", 1);
                            questController.UpdateQuestProgress("exchange-ticket-repeat", 1);
                            audioController.activateSound("exchange_item", false);
                            RemoveTimeLine();
                            //
                            setTimeout(function() {
                                showPopupFinishQuest("ticket", 1, "\"Lucky Ticket\"", "Tips: One Hero can receive two Lucky Tickets a week, maximum. They are rare!", currentCode);
                            }, 200)

                        },
                        "callback": false,
                        "goTo": null
                    }
                ]
            },
            dialog3: {
                "message": "You have exchanged a Lucky Ticket today. \nPlease check your email to see your lucky number.",
                "voice": null,
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
                "message": "No worries. I totally understand. \n Please comeback if you change your mind.",
                "voice": null,
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
        "exchange-items-repeat": {
            default: "dialog1",
            dialog1: {
                "message": "Do you want to sacrifice for the Source Tree?",
                "voice": null,
                "buttons": [
                    
                    {
                        "content": "NO",
                        "style": "orange",
                        "func": null,
                        "callback": false,
                        "goTo": "dialog4"
                    },
                    {
                        "content": "YES",
                        "style": "green",
                        "func": function() {
                            GetTicket(modelID, function(data) {
                                if(data.code == 200) {
                                    NPCController['altar-tree'].UpdateConservationCallback("dialog2");
                                    addInventory("big-crystal", -2);
                                    SetTimeLine();
                                    currentCode = data.presentCode;
                                } else {
                                    NPCController['altar-tree'].UpdateConservationCallback("dialog3");
                                }
                                
                            })
                        },
                        "callback": true,
                        "goTo": null
                    },
                ]
            },
            dialog2: {
                "message": "Here your Lucky Ticket.",
                "voice": null,
                "buttons": [
                    {
                        "content": "THANK YOU",
                        "style": "green",
                        "func": function() {
                            addInventory("ticket", 1);
                            showAnnouncement('+ 1 Lucky Ticket');
                            questController.UpdateQuestProgress("exchange-ticket", 1);
                            questController.UpdateQuestProgress("exchange-ticket-repeat", 1);
                            audioController.activateSound("exchange_item", false);
                            RemoveTimeLine();
                            //
                            setTimeout(function() {
                                showPopupFinishQuest("ticket", 1, "\"Lucky Ticket (Repeat)\"", "Tips: One Hero can receive two Lucky Tickets a week, maximum. They are rare!", currentCode);
                            }, 200)

                        },
                        "callback": false,
                        "goTo": null
                    }
                ]
            },
            dialog3: {
                "message": "You don't have enough Red Diamond.",
                "voice": null,
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
                "message": "No worries. I totally understand. \n Please comeback if you change your mind.",
                "voice": null,
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
        "exchange-items-progress": {
            default: "dialog1",
            dialog1: {
                "message": "Please come back when you have 2 Red Diamonds",
                "voice": null,
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
    }
}