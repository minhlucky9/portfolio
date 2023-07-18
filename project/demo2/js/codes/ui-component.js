/*slider event*/
function OnSliderValueChange(element) {
    var val = $(element).val();
    $(element).parent().find('.range-val').css("width", val + '%');
}

var inventory = {
    'small-crystal': 0,
    'big-crystal': 0,
    'ticket': 0
};

/* inventory */
function addInventory(item, quantity, update) {
    var inventoryList = $('.inventory .inventory-child');
    for (var i = 0; i < inventoryList.length; i++) {
        if (inventoryList.eq(i).find('#' + item).length > 0) {
            //update inventory data
            inventory[item] += quantity;
            //
            var quantityElement = inventoryList.eq(i).find('.quantity');
            quantityElement.html(inventory[item]);
            
            break;
        }

        if (inventoryList.eq(i).find('.quantity').html() == '') {
            var htmlStr = '';
            switch (item) {
                case "big-crystal":
                    htmlStr = '<img src="images/UI/Crystal.png" alt="error" id=' + item + '></img>'
                    break;
                case "small-crystal":
                    htmlStr = '<img src="images/UI/Crystal2.png" alt="error" id=' + item + '></img>'
                    break;
                case "ticket":
                    htmlStr = '<img src="images/UI/scroll.png" alt="error" id=' + item + '>';
                    break;
            }

            inventoryList.eq(i).find('.items').html(htmlStr);
            inventoryList.eq(i).find('.quantity').html(quantity);
            //update inventory data
            inventory[item] = quantity;
            break;
        }
    }

    //
    if(update != false) {
        questController.UpdateCollectingQuest();
    }

}

function showAnnouncement(message) {
    var announcement = $('.center-content .announcement');

    $('.center-content .announcement span').html(message);

    announcement.fadeIn(300, function () {
        setTimeout(function () {
            announcement.fadeOut(300);
        }, 1000)
    })
}

function showPopupFinishQuest(reward, amount, questname, tips, ticketcode) {
    switch(reward) {
        case "crystal":
            $(".popup-finish-quest .quest-reward img").attr("src", "images/UI/Crystal2.png");
            $(".popup-finish-quest .quest-announce .reward-announce").html("You received "+ amount +" Blue Crystals.")
            break;
        case "diamond":
            $(".popup-finish-quest .quest-reward img").attr("src", "images/UI/Crystal.png");
            $(".popup-finish-quest .quest-announce .reward-announce").html("You received "+ amount +" Red Diamond.")
            break;
        case "ticket":
            $(".popup-finish-quest .quest-reward img").attr("src", "images/UI/scroll.png");
            $(".popup-finish-quest .quest-announce .reward-announce").html("You received "+ amount +" Lucky Ticket. There is a code written on it:")
            break;
    }

    $(".popup-finish-quest .quest-reward span").html("x" + amount);
    $(".popup-finish-quest .popup-tips span").html(tips);
    $(".popup-finish-quest .quest-announce .quest-name").html(questname);

    if(ticketcode != null) {
        $(".popup-finish-quest .quest-announce .ticket-code").html(ticketcode);
    } else {
        $(".popup-finish-quest .quest-announce .ticket-code").html("");
    }

    $(".popup-finish-quest").fadeIn(300);
}

/* quest */

function updateQuest(target, description, questname, status, npc_status, tab) {
    if($('#' + questname).length > 0) {
        var quest = $('#' + questname);
        quest.find('.quest-target').html(target);

        switch(npc_status) {
            case "QUESTCOMPLETE":
                quest.find('.quest-child-icon img').attr("src", "images/UI/quest-complete.png");
                break;
            case "PROGRESS":
                quest.find('.quest-child-icon img').attr("src", "images/UI/quest-onprogress.png");
                break;
            case "HAVEQUEST":
                quest.find('.quest-child-icon img').attr("src", "images/UI/have-quest.png");
                break;    
        }

        if(status == questController.QUESTSTATE.COMPLETED) {
            quest.find('.quest-child-icon img').attr("src", "images/UI/quest-finish.png");
            quest.find('.quest-target').css("color", "#B7A284");
            quest.find('.quest-description').css("color", "#B7A284");
            quest.find('.quest-description').html("Quest completed");
        } else {
            quest.find('.quest-target').css("color", "#F1E9DC");
            quest.find('.quest-description').css("color", "#F1E9DC");
            quest.find('.quest-description').html(description);
        }

    } else {
        var txtColor = "#F1E9DC";
        var questIcon = "images/UI/quest-onprogress.png";
        switch(npc_status) {
            case "QUESTCOMPLETE":
                questIcon = "images/UI/quest-complete.png";
                break;
            case "PROGRESS":
                questIcon = "images/UI/quest-onprogress.png";
                break;
            case "HAVEQUEST":
                questIcon = "images/UI/have-quest.png";
                break;    
        }

        var htmlStr = '<div class="quest-child" id='+ questname +'>'
        + '<div class="quest-child-icon">'
        + '<img src="'+ questIcon +'" alt="error" width="20">'
        + '</div>'
        + '<div class="quest-child-content">'
        + '<div class="quest-target" style="color:'+ txtColor +';">' + target +'</div>'
        + '<div class="quest-description" style="color:'+ txtColor +';">'
        + description 
        + '</div></div></div>'
    
        if(tab != null) {
            $('.quests .quest-content' + " ." + tab).append(htmlStr);
        } else {
            $('.quests .quest-content').append(htmlStr);
        }
        
    }
}


/* message box */
function OpenMessageBox(title, desc, acceptContent, acceptFunc, declineContent, declineFunc) {
    
    var popup = $('.loading-page .popup-message-announcement');

    popup.find('.popup-title').html(title.toUpperCase());
    popup.find('.popup-description').html(desc);
    //accept-btn
    var acceptBtn = popup.find('.accept-btn');
    if(acceptContent == null) {
        acceptBtn.css("display", "none");
    } else {
        acceptBtn.css("display", "inline-block");
        acceptBtn.html(acceptContent);
        acceptBtn.unbind('click');
        acceptBtn.click(function(e) {
            if(acceptFunc != null) {
                acceptFunc();
            }
            popup.fadeOut(300);
        })
    }

    //decline btn
    var declineBtn = popup.find('.decline-btn');
    if(declineContent == null) {
        declineBtn.css("display", "none");
    } else {
        declineBtn.css("display", "inline-block");
        declineBtn.html(declineContent);
        declineBtn.unbind('click');
        declineBtn.click(function(e) {
            if(declineFunc != null) {
                declineFunc();
            }
            popup.fadeOut(300);
        })
    }

    popup.fadeIn(300);
}