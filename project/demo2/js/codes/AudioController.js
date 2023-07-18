THREE.AudioController = function() {
    var audio_bg = new Audio("audio/Ookenga Concept v2.mp3");
    var soundFX = {
        'run': new Audio("audio/sound_run.mp3"),
        'pray': new Audio("audio/sound_pray.mp3"),
        'exchange_item': new Audio("audio/sound_getScroll.mp3"),
        'pick_up': new Audio("audio/sound_pick_smallcrystal.mp3"),
        'voice_giahuongdao': new Audio("audio/voice_giahuongdao.mp3"),
        'voice_thoisao': new Audio("audio/voice_thoisao.mp3"),
        'voice_thoren': new Audio("audio/voice_thoren.mp3")
    }
    var voice;
    var soundVolume = 0;
    var onStart = false;
    function start() {
        if(onStart == false) {
            onStart = true;
            //play
            audio_bg.loop = true;
            audio_bg.play();
            //
            setupSetting();

            //init sound
            if(window.localStorage.getItem("music_volume") == null) {
                initMusicVolume(0.5);
            } else {
                initMusicVolume(parseFloat(window.localStorage.getItem("music_volume")));
            }

            if(window.localStorage.getItem("sound_volume") == null) {
                initSoundVolume(1);
            } else {
                initSoundVolume(parseFloat(window.localStorage.getItem("sound_volume")));
            }
                 
        }
    }

    function activateVoice(soundname) {
        stopCurrentVoice();

        if(soundname != null) {
            voice = soundFX[soundname];
            if(voice.paused == true) {
                voice.volume = soundVolume;
                voice.play();
            }
        }
    }

    function stopCurrentVoice() {
        if(voice) {
            voice.pause();
            voice.currentTime = 0.0;
            voice = null;
        }
    }

    function activateSound(soundname, loop) {
        //
        if(soundFX[soundname].paused == true) {
            soundFX[soundname].loop = loop;
            soundFX[soundname].volume = soundVolume;
            soundFX[soundname].play();
        }
    }

    function stopSound(soundname) {
        if(soundFX[soundname].paused == false) {
            soundFX[soundname].pause();
            soundFX[soundname].currentTime = 0.0;
        }
    }

    function setupSetting() {
        $('#sound-slider input').on("input", function() {
            var volumeSound = $('#sound-slider input').val();
            //set volume
            setSoundVolume(volumeSound / 100);
        })

        $('#sound-slider input').on("change", function() {
            var volumeSound = $('#sound-slider input').val();
            //set cookie
            window.localStorage.setItem("sound_volume", (volumeSound / 100).toString())
        })
        
        $('#music-slider input').on("input", function() {
            var volumeMusic = $('#music-slider input').val();
            //set volume
            setMusicVolume(volumeMusic / 100);
        })

        $('#music-slider input').on("change", function() {
            var volumeMusic = $('#music-slider input').val();
            //set cookie
            window.localStorage.setItem("music_volume", (volumeMusic / 100).toString())
        })
    }

    function initMusicVolume(value) {
        $('#music-slider input').val(value * 100);
        //set volume
        setMusicVolume(value);
    }

    function initSoundVolume(value) {
        $('#sound-slider input').val(value * 100);
        //set volume
        setSoundVolume(value);
    }

    function setMusicVolume(value) {
        $('#music-slider .range-val').css("width", (value * 100) + '%');
        //set volume
        audio_bg.volume = value;
    }

    function setSoundVolume(value) {
        $('#sound-slider .range-val').css("width", (value * 100) + '%');
        //set volume
        soundVolume = value;
    }

    return {
        start: start,
        activateSound: activateSound,
        stopSound: stopSound,
        activateVoice: activateVoice,
        stopCurrentVoice: stopCurrentVoice
    }
}