$(function () {
    videojs("timelapse_player").ready(function () {
        var player = this;

        // Events of note
        var pipeOut = 2 * 60 + 27;
        var malnutrition = 2 * 60 + 45;

        $("#leakage").on("click", function () {
            player.currentTime(pipeOut);
            player.play();
        });

        $("#malnutrition").on("click", function () {
            player.currentTime(malnutrition);
            player.play();
        });


    });
});