var sliding = false;
var bgAudioPlayed = false;
var loginData;
var serverTime;
const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]
const bodypart_color = {
    "common": "#F1E9DC",
    "epic": "#C261F0",
    "rare": "#62B1F9",
    "legendary": "#FFC350"
}
$(document).ready(function(e) {
    Opening();

    if(window.localStorage.getItem("isIntro") == null) {
        $(".popup-introduction").css("display", "block");
        window.localStorage.setItem("isIntro", true);
    }

    $('input').on('input', function() {
        playerController.toggleMoving(false);
    })

    $('input').on('blur', function() {
        playerController.toggleMoving(true);
    })

    $(document).click(function(e) {
        audioController.start();
        billboardController.start();
    })
    
    $(".quests .quest-content").on("click", ".quest-child" , function () { 
        questController.ShowQuestTip($(this).attr("id"));
    })

    $('.minigameUI .popup-complete .close-btn').click(function (e) { 
        $('.minigameUI .popup-complete').fadeOut(300);
    })

    $('.minigameUI .popup-complete .back-to-game-btn').click(function (e) { 
        $('.minigameUI .popup-complete').fadeOut(300);
    })

    /*Login code input*/
    $('.login-code-input input').on('input', function() {
        if($('.login-code-input input').val() != "") {
            $('.login-code-input .login-code-btn').removeClass("inactive-btn");
        } else {
            $('.login-code-input .login-code-btn').addClass("inactive-btn");
        }
    })

    $('.login-code-input .login-code-btn').click(function(e) {
        var logincode = $('.login-code-input input').val();
        CheckFreeUser(logincode.toUpperCase(), function(data) {
            if(data.code == 200) {
                
                
                
            } else if(data.code == 500) {
                OpenMessageBox("EVENT CLOSE", "This event is temporary closed.\n Please try again", "ALRIGHT", null, null, null);
            } else {
                OpenMessageBox("INVALID WHITELIST CODE", "This is not a correct Whitelist code.\n Please try again", "ALRIGHT", null, null, null);
            }
        })
    })

    //

    $("#isReadNotice").on("input", function() {
        if($("#isReadNotice").is(":checked")) {
            $(".popup-importance-notice .button-container .accept-btn").addClass("active-btn");
            $(".popup-description label").css("color", "#ffffff");
 
        } else {
            $(".popup-importance-notice .button-container .accept-btn").removeClass("active-btn");
            $(".popup-description label").css("color", "#ababab");
        }
    })

    $(".popup-importance-notice .button-container .accept-btn").click(function(e) {
        $(".minigameUI .popup-importance-notice").fadeOut(300);
        window.localStorage.setItem("isReadNotice", true);
        playerController.toggleMoving(true);
    })

    $(".minigameUI .popup-finish-quest").click(function(e) {
        $('.minigameUI .popup-finish-quest').fadeOut(300, function() {
            questController.ShowAnnounceCompleteDaily();
        });
    })

    $(".quests .hide-quest-btn").click(function(e) {
        $(".quests").css("transform-origin", "top right");
        $(".quests").css("animation-duration", "0.3s");
        $(".quests").addClass("minimize-animation");

        setTimeout(function(e) {
            $(".btn-quest-minimize").css("animation-duration", "0.2s");
            $(".btn-quest-minimize").addClass("maximize-animation");
            $(".btn-quest-minimize").css("pointer-events", "none");
        }, 100)

        setTimeout(function(e) {
            $(".quests").removeClass("minimize-animation");
            $(".quests").css("transform", "scale(0)");
            //
            $(".btn-quest-minimize").removeClass("maximize-animation");
            $(".btn-quest-minimize").css("transform", "scale(1)");
            $(".btn-quest-minimize").css("pointer-events", "all");
        }, 300)
    })

    $(".btn-quest-minimize").click(function(e) {
        $(".btn-quest-minimize").css("animation-duration", "0.1s");
        $(".btn-quest-minimize").addClass("minimize-animation");
        $(".btn-quest-minimize").css("pointer-events", "none");

        setTimeout(function(e) {
            $(".quests").css("transform-origin", "top right");
            $(".quests").css("animation-duration", "0.3s");
            $(".quests").addClass("maximize-animation");
        })

        setTimeout(function(e) {
            $(".quests").removeClass("maximize-animation");
            $(".quests").css("transform", "scale(1)");
            //
            $(".btn-quest-minimize").removeClass("minimize-animation");
            $(".btn-quest-minimize").css("transform", "scale(0)");
        }, 300)
    })

    $(".minigameUI .info-btn").click(function(e) {
        $(".popup-introduction").fadeIn(300);
        $(".GUI .minigameUI .popup-introduction .popup-content .introduction-container .container-slide").css("left", "0px");
    })

    $(".minigameUI .popup-introduction .close-btn").click(function(e) {
        $(".popup-introduction").fadeOut(300, function() {
            setTimeout(function() {
                if(window.localStorage.getItem("isReadNotice") == null) {
                    $(".popup-importance-notice").fadeIn(300, function() {
                        playerController.toggleMoving(false);
                    });
                }
            }, 100)
        });
    })

    $(".minigameUI .avatar-group").click(function(e) {
        $("#popup-account-info").fadeIn(300);
    })

    $(".minigameUI #popup-account-info .close-btn").click(function(e) {
        $("#popup-account-info").fadeOut(300);
    })
    
    $(".minigameUI .setting-btn").click(function(e) {
        $(".popup-settings").fadeIn(300);
    })

    $('.minigameUI .popup-settings .radio-button-option input').on('change', function() {
        toggleUltra();
    })

    $(".minigameUI .popup-settings .close-btn").click(function(e) {
        $(".popup-settings").fadeOut(300);
    })

    $(".minigameUI .events").click(function(e) {
        $(".popup-events").fadeIn(300);
    })

    $(".minigameUI .popup-events .close-btn").click(function(e) {
        $(".popup-events").fadeOut(300);
    })

    $(".minigameUI .popup-introduction .prev-btn").click(function(e) {
        var slider = $(".GUI .minigameUI .popup-introduction .popup-content .introduction-container .container-slide");
        var leftVal = slider.css("left").replace("px", "");
        if(sliding == false && parseInt(leftVal) < 0) {
            sliding = true;
            //
            slider.animate({left: (parseInt(leftVal) + 690) + "px"}, 400, function(e) {
                sliding = false;
            });
            //
            $('.GUI .minigameUI .popup-introduction .slide-navigation .navigation-child').removeClass("selected");
            var index = parseInt(leftVal) / -690;
            $('.GUI .minigameUI .popup-introduction .slide-navigation .navigation-child').eq(index - 1).addClass("selected");
        }
        
    });

    $(".minigameUI .popup-introduction .next-btn").click(function(e) {
        var slider = $(".GUI .minigameUI .popup-introduction .popup-content .introduction-container .container-slide");
        var leftVal = slider.css("left").replace("px", "");
        if(sliding == false && parseInt(leftVal) > - 690 * 5) {
            sliding = true;
            //
            slider.animate({left: (parseInt(leftVal) - 690) + "px"}, 400, function(e) {
                sliding = false;
            });

            //
            $('.GUI .minigameUI .popup-introduction .slide-navigation .navigation-child').removeClass("selected");
            var index = parseInt(leftVal) / -690;
            $('.GUI .minigameUI .popup-introduction .slide-navigation .navigation-child').eq(index + 1).addClass("selected");
            
        }
    });

    $(".minigameUI .inventory .inventory-child").click(function(e) {
        $('.tool-box').css("display", "none");
        var id = $(this).find('.items img').attr('id');
        
        switch (id) {
            case "big-crystal":
                $(this).find('.tool-box .tool-box-name').html('Red Diamond');
                $(this).find('.tool-box .tool-box-description').html('Collect 7 Red Diamond to exchange a Lucky Ticket');
                $(this).find('.tool-box').css("display", "block");
                break;
            case "small-crystal":
                $(this).find('.tool-box .tool-box-name').html('Blue Crystal');
                $(this).find('.tool-box .tool-box-description').html('Collect 5  Blue Crystals to exchange a Red Diamond');
                $(this).find('.tool-box').css("display", "block");
                break;
            case "ticket":
                $(this).find('.tool-box .tool-box-name').html('Lucky Ticket');
                var toolBoxDesc = $(this).find('.tool-box .tool-box-description');
                var toolBox = $(this).find('.tool-box');

                if(ticket_code != "") {
                    toolBoxDesc.html(ticket_code + '\n' + ' Use this number to enter the Lottery Draw');
                } else {
                    toolBoxDesc.html('Collect to enter the Lottery Draw');
                }
                
                toolBox.css("display", "block");

                break;
        }
    });

    $(document).click(function(event) {
        if (!$(event.target).closest(".inventory-child").length) {
            $(".tool-box").css("display", "none");
        }
    });

    $('.loading-page .popup-message-announcement .close-btn').click(function(e) {
        $('.loading-page .popup-message-announcement').fadeOut(300);
    })
});

var progressInterval;

function setupOff() {
    //hide popup
    $('.loading-page .popup-login-code').fadeOut(300,function() {
        //init time
        serverTime = new Date();
        var timeStr = months[(serverTime.getUTCMonth() + 1)] + " " + ('0' + serverTime.getUTCDate()).slice(-2)
        + ", " + ('0' + serverTime.getUTCHours()).slice(-2) + ":" +  ('0' + serverTime.getUTCMinutes()).slice(-2)
        + " UTC"
        $(".left-content .server-time .time-stamp").html(timeStr);

        setInterval(function () { 
        serverTime = new Date(serverTime.getTime() + 10 * 1000);
            var timeStr = months[(serverTime.getUTCMonth() + 1)] + " " + ('0' + serverTime.getUTCDate()).slice(-2)
                + ", " + ('0' + serverTime.getUTCHours()).slice(-2) + ":" +  ('0' + serverTime.getUTCMinutes()).slice(-2)
                + " UTC"
            $(".left-content .server-time .time-stamp").html(timeStr);
        }, 10 * 1000)

        //loading model
        Init();
        LoadingProgress();
        //
        $('#popup-account-info #account-name').html(loginData.model_name + " (" + loginData.rarityName + ")");
        $('#popup-account-info #account-race').html(loginData.clanName);
        $('#popup-account-info #account-class').html(loginData.className);
        $('#popup-account-info #account-collected-coin').html(0);
        $('#popup-account-info #account-collected-ticket').html(0);
        $('#popup-account-info #account-last-login').html(new Date().toUTCString());
        $('#popup-account-info .character-img').attr("src", loginData.imageUrl); 
        $('#avatar-img').attr("src", loginData.imageUrl); 
        //

        if(loginData.part_info[1].image) {
            $('#popup-account-info .character-bodypart .part-variation').eq(0).find('.part-img').attr("src", loginData.part_info[1].image);
            $('#popup-account-info .character-bodypart .part-variation').eq(0).find('.part-rare').html(loginData.part_info[1].rarity);
            $('#popup-account-info .character-bodypart .part-variation').eq(0).find('.part-rare').css("color", bodypart_color[loginData.part_info[1].rarity.toLowerCase()]);

            $('#popup-account-info .character-bodypart .part-variation').eq(1).find('.part-img').attr("src", loginData.part_info[2].image);
            $('#popup-account-info .character-bodypart .part-variation').eq(1).find('.part-rare').html(loginData.part_info[2].rarity);
            $('#popup-account-info .character-bodypart .part-variation').eq(1).find('.part-rare').css("color", bodypart_color[loginData.part_info[2].rarity.toLowerCase()]);

            $('#popup-account-info .character-bodypart .part-variation').eq(2).find('.part-img').attr("src", loginData.part_info[3].image);
            $('#popup-account-info .character-bodypart .part-variation').eq(2).find('.part-rare').html(loginData.part_info[3].rarity);
            $('#popup-account-info .character-bodypart .part-variation').eq(2).find('.part-rare').css("color", bodypart_color[loginData.part_info[3].rarity.toLowerCase()]);

            $('#popup-account-info .character-bodypart .part-variation').eq(3).find('.part-img').attr("src", loginData.part_info[4].image);
            $('#popup-account-info .character-bodypart .part-variation').eq(3).find('.part-rare').html(loginData.part_info[4].rarity);
            $('#popup-account-info .character-bodypart .part-variation').eq(3).find('.part-rare').css("color", bodypart_color[loginData.part_info[4].rarity.toLowerCase()]);

            $('#popup-account-info .character-bodypart .part-variation').eq(4).find('.part-img').attr("src", loginData.part_info[5].image);
            $('#popup-account-info .character-bodypart .part-variation').eq(4).find('.part-rare').html(loginData.part_info[5].rarity);
            $('#popup-account-info .character-bodypart .part-variation').eq(4).find('.part-rare').css("color", bodypart_color[loginData.part_info[5].rarity.toLowerCase()]);
        } 
    });
}

function Opening() {

    $("#loading1").animate({opacity: 1}, 1000, function() {
        setTimeout(function() {
            $("#loading1").animate({opacity: 0}, 1000, function() {
                $("#loading2").animate({opacity: 1}, 1000, function() {
                    setTimeout(function() {
                        $("#loading2").animate({opacity: 0}, 1000, function() {
                            $("#loading3").css("display", "block");
                            
                            if(isMobile) {
                                $('.label-progress').html("");
                                $('.loading-page .popup-not-support-mobile').fadeIn(300);
                            } else {
                    //             CheckEvent(function(data) {
                    //                 if(data.state_event == 1) {
                    //             	InitGameAPIContent();
					// $(".loading-page .popup-login-code").css("display", "block");
                    //                 } else {
                    //                     $('.label-progress').html("");
                    //                     $('.loading-page .popup-event-close-announce').fadeIn(300);
                    //                 }
                    //             })
                                //hide popup
                                setupOff();
                            }
 
                        });
                    }, 1000)
                });
            });
        }, 1000)
    });
      
}

function InitGameAPIContent() {
    
    // GetLogin(modelID, function(data) {
    //     if(data.code == 200) {
    //         loginData = data;
    //         //init time
    //         serverTime = new Date(loginData.time_now);
    //         var timeStr = serverTime.getUTCDate() + "/" + (serverTime.getUTCMonth() + 1) 
    //             + " " + serverTime.getUTCHours() + ":" +  serverTime.getUTCMinutes()
    //             + " GMT+0"
    //         $(".left-content .server-time .time-stamp").html(timeStr);

    //         setInterval(function () { 
    //             serverTime = new Date(serverTime.getTime() + 10 * 1000);
    //             var timeStr = serverTime.getUTCDate() + "/" + (serverTime.getUTCMonth() + 1)
    //                 + " " + serverTime.getUTCHours() + ":" +  serverTime.getUTCMinutes()
    //                 + " GMT+0"
    //             $(".left-content .server-time .time-stamp").html(timeStr);
    //         }, 10 * 1000)

    //         //loading model
    //         Init();
    //         LoadingProgress();
    //         //
    //         $('#popup-account-info #account-id').html(modelID);
    //         $('#popup-account-info #account-name').html(loginData.model_name + " (" + loginData.rarityName + ")");
    //         $('#popup-account-info #account-race').html(loginData.clanName);
    //         $('#popup-account-info #account-class').html(loginData.className);
    //         $('#popup-account-info #account-collected-coin').html(loginData.total_coin);
    //         $('#popup-account-info #account-collected-ticket').html(loginData.total_ticket);
    //         $('#popup-account-info #account-last-login').html(new Date().toUTCString());
    //         $('#popup-account-info .character-img').attr("src", loginData.imageUrl); 
    //         $('#avatar-img').attr("src", loginData.imageUrl); 

    //         //init recent hero
    //         var recentHero = $('.recent-hero-content .list-hero-container');
    //         var listId = JSON.parse(window.localStorage.getItem("list_login"));
    //         var htmlStr = "";
    //         for(var i = 0; i < listId.length; i ++) {
    //             var account = JSON.parse(window.localStorage.getItem(listId[i]));
    //             htmlStr += '<div class="recent-hero-child">'
    //             + '<div class="avatar">'
    //             + '<img class="hero-img" src="'+ account.imageUrl +'" alt="error">'
    //             + '<img class="hero-border" src="images/UI/Stone_Border_Square 1.png" alt="error">'
    //             + '</div><div class="hero-info">'
    //             + '<div class="hero-class">'+ account.model_name + " (" + account.rarityName + ")" +'</div>'
    //             + '<div class="hero-id">ID: '+ account.tokenID +'</div>'
    //             + '<div class="hero-collected"><div class="item-name">Red Diamonds: </div>'
    //             + '<div class="item-quantity">'+ account.total_coin +'</div>'
    //             + '<div class="item-name">Lucky Tickets: </div>'
    //             + '<div class="item-quantity">'+ account.total_ticket +'</div></div>'
    //             + '</div><div class="change-hero-btn" onclick=window.location.replace("?id='+ account.tokenID +'")>CHANGE HERO</div></div>'
    //         }
    //         recentHero.html(htmlStr);
    //     } else {
    //         $('.label-progress').html("Invalid ID. This ID is not existed !!!")
    //     }
    // })
}

function LoadingProgress() {

    progressInterval = setInterval(function(e) {
        //
        var percent = parseInt(loadedElement * 100 / elementCount);

        $('#progress-percent').html(percent + "%" + " (" + currentAsset + '/' + totalAsset + ")");
        $('.progress-bar').css("width", percent  + "%");
    }, 200)
}

function FinishLoading() {
    clearInterval(progressInterval);

    $(".loading-page").animate({opacity: 0}, 1000, function() {
        $(".joystick-controller").css("visibility", "visible");
        $(".loading-page").css("display", "none");
        $(".minigameUI").css("display", "block");

        //
        ShowPlaceName();
        

        //setup quest
        questController.ActivateQuest("daily-coin-quest");
        questController.ActivateQuest("daily-crystal-quest");
        questController.ActivateQuest("exchange-ticket");

        //init inventory
        addInventory('small-crystal', 0 );
        addInventory('big-crystal', 0 );
        addInventory('ticket', 0);

        //
        //questController.UpdateQuestProgress("exchange-huge-crystal", loginData.coin_daily);
        //questController.UpdateQuestProgress("exchange-ticket", loginData.total_ticket);
    });
}

function ShowPlaceName() {
    setTimeout(function() {
        var placename = $('.center-content .place-name');
        placename.fadeIn(500, function() {
            setTimeout(function() {
                placename.fadeOut(500);
            }, 3000)
        })
    }, 1000);
}