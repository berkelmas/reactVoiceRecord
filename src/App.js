import React, { useState, useEffect } from "react";
import { Button, Card } from "antd";
import AudioOutlined from "@ant-design/icons/AudioOutlined";
import AudioMutedOutlined from "@ant-design/icons/AudioMutedOutlined";
import "antd/dist/antd.css";
import "./App.css";
import ReactWaves from "@dschoon/react-waves";

function App() {
  const [recordState, setRecordState] = useState({
    micRecord: false,
    micInstance: {},
  });
  const [currentBlobUrl, setCurrentBlobUrl] = useState(null);

  let mediaRecorder = {};
  const audioChunks = [];

  const micCallback = ({ micInstance, stream }) => {
    if (micInstance) {
      setRecordState((prev) => ({ ...prev, micInstance }));
    } else if (stream) {
      handleStream(stream);
    }
  };

  const handleStream = (stream) => {
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.start();

    mediaRecorder.addEventListener("dataavailable", (event) => {
      audioChunks.push(event.data);
    });
  };

  const handleAudioOutput = () => {
    return new Promise((resolve) => {
      mediaRecorder.addEventListener("stop", () => {
        const audioBlob = new Blob(audioChunks);
        const audioUrl = URL.createObjectURL(audioBlob);
        // const audio = new Audio(audioUrl);
        // const play = () => {
        //   audio.play();
        // };
        // play();

        resolve({ audioBlob, audioUrl });
      });

      if (mediaRecorder && mediaRecorder.state === "recording") {
        mediaRecorder.stop();
      }
    });
  };

  const toggleMic = () => {
    recordState.micRecord ? stopMic() : startMic();
  };

  const startMic = () => {
    // if (recordState.micInstance.active) {
    //   recordState.micInstance.start();
    //   setRecordState((prev) => ({ ...prev, micRecord: true }));
    // }
    recordState.micInstance.start();
    setRecordState((prev) => ({ ...prev, micRecord: true }));
  };

  const stopMic = () => {
    // if (recordState.micInstance.active) {
    //   recordState.micInstance.stop();

    //   console.log("stopping");

    //   handleAudioOutput().then(({ audioBlob, audioUrl }) => {
    //     setRecordState({ micRecord: false, audio: audioUrl });
    //     console.log(audioUrl);
    //   });
    // }
    recordState.micInstance.stop();

    console.log("stopping");

    handleAudioOutput().then(({ audioBlob, audioUrl }) => {
      setRecordState((prev) => ({
        ...prev,
        micRecord: false,
        audio: audioUrl,
      }));
      setCurrentBlobUrl(audioUrl);
      console.log(audioBlob);
    });
  };

  return (
    <div style={{ margin: "40px" }}>
      <Card
        size="small"
        title="Voice Recorder"
        style={{ width: 350 }}
        bodyStyle={{}}
      >
        {/* <Button
          shape="circle"
          icon={<AudioOutlined />}
          onClick={startRecording.bind(this)}
        />
        <Button
          shape="circle"
          icon={<AudioMutedOutlined />}
          onClick={stopRecording.bind(this)}
        /> */}
        <Button onClick={toggleMic}>
          {!recordState.micRecord ? "Record" : "Stop"}
        </Button>
        <div style={{ display: "none" }}>
          <ReactWaves
            className={"react-waves"}
            options={{
              barGap: 2,
              barWidth: 1.8,
              barHeight: 2,
              cursorWidth: 0,
              height: 200,
              hideScrollbar: true,
              progressColor: "#EC407A",
              responsive: true,
              waveColor: "#D1D6DA",
            }}
            playing={recordState.micRecord}
            volume={1}
            zoom={1}
            micCallback={micCallback}
          />
        </div>
        <audio
          controls="controls"
          controlsList="nodownload"
          src={currentBlobUrl}
          type="audio/mp3"
        />
      </Card>
    </div>
  );
}

export default App;
