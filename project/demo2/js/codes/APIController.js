var host = "http://1.55.212.49:5555/";
var user_email = "";
var ticket_code = "";
var loginData = {
    "model_name": "Caloolis",
    "rarityName": "Overseer",
    "rarityPoint": 2,
    "className": "Melee",
    "clanName": "Krakee",
    "imageUrl": "https://media.ookeenga.io/herosources/images/42753008.jpg",
    "videoUrl": "https://media.ookeenga.io/herosources/videos/42753008.mp4",
    "part_info": [
        {
            "_id": "6255303a82ec09a635621327",
            "partHero_id": 1,
            "partHero_clanName": "",
            "partHero_name": "Body_Krakee",
            "partHero_type": "B",
            "partHero_location": "",
            "partHero_content": "",
            "partHero_codeID": "B1"
        },
        {
            "partHero_name": "Heads_Krakee_3",
            "rarity": "Epic",
            "image": "https://media.ookeenga.io/character-models/parts/antuk-vigorious-mind.png",
            "name": "Antuk Vigorious"
        },
        {
            "partHero_name": "Tops_Montak_2",
            "rarity": "Rare",
            "image": "https://media.ookeenga.io/character-models/parts/montak-flamy-antennas.png",
            "name": "Montak Flamy"
        },
        {
            "partHero_name": "Eyes_Montak_2",
            "rarity": "Rare",
            "image": "https://media.ookeenga.io/character-models/parts/montak-hollow-eyes.png",
            "name": "Montak Hollow"
        },
        {
            "partHero_name": "Legs_Montak_1",
            "rarity": "Common",
            "image": "https://media.ookeenga.io/character-models/parts/montak-spiking-limbs.png",
            "name": "Montak Spiking"
        },
        {
            "partHero_name": "Wings_Krakee_1",
            "rarity": "Common",
            "image": "https://media.ookeenga.io/character-models/parts/krakee-enchanted-wings.png",
            "name": "Krakee Enchanted"
        }
    ]
};

function CheckEvent(func) {
    $.get(host + "api/checkEvent", 
        function (data) {
            func(data);
        }
    );
}

function CheckFreeUser(login_code, func) { 
    $.post(host + "api/checkFreeUser", 
        {
            "login_code": login_code
        },
        function (data) {
            if(data.code == 200) [
                user_email = data.email
            ]
            
            func(data);
        }
    );
}

function GetTicketEmail(func) { 
    $.post(host + "api/getTicketEmail", 
        {
            "email": user_email
        },
        function (data) {
            if(data.code == 200) {
                ticket_code = data.ticketCode;
            }
            
            func(data);
        }
    );
} 

