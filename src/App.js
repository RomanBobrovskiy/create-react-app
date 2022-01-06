import "./App.css";
import React, { useRef } from "react";

export default function App() {
  const video = useRef(null);
  const canvas = useRef(null);

  const capturePhoto = () => {
    if (video.current && canvas.current) {
      const { videoHeight, videoWidth } = video.current;
      const context = canvas.current.getContext("2d");
      canvas.current.width = videoWidth;
      canvas.current.height = videoHeight;
      context?.drawImage(video.current, 0, 0);
      const imageUrl = canvas.current.toDataURL("image/png")
      console.log("imageurl", imageUrl);
    }
  };

  const triggerStartVideo = async () => {
    video?.current?.setAttribute("autoplay", "");
    video?.current?.setAttribute("muted", "");
    video?.current?.setAttribute("playsinline", "");
    console.log(await navigator.mediaDevices.enumerateDevices());
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (video.current) {
          if ("srcObject" in video.current) {
            video.current.srcObject = stream;
          } else {
            // Avoid using this in new browsers, as it is going away.
            // @ts-ignore
            video.current.src = window.URL.createObjectURL(stream);
          }
          video.current.onloadedmetadata = function (e) {
            // @ts-ignore
            video.current.play();
          };
        }
      })
      .catch((err) => console.log(err));
  };

  React.useEffect(() => {
    triggerStartVideo();
  }, []);

  return (
    <div>
      <video
        style={{
          width: "85%",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)"
        }}
        ref={video}
      >
        <track default kind="captions" />
      </video>
      <button onClick={capturePhoto} type="button" />
      <canvas ref={canvas} />
    </div>
  );
}
