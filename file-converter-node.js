const ffmpeg = require("ffmpeg");

try {
  const process = new ffmpeg("./blob");
  process.then((audio) => {
    audio.fnExtractSoundToMP3("./new-sound.mp3", function (err, file) {
      console.log(err);
      if (!err) {
        console.log("file", file);
      }
    });
  });
} catch (e) {
  console.log(e);
}
