import {
  FilesetResolver,
  FaceLandmarker,
  FaceLandmarkerResult
} from "@mediapipe/tasks-vision";

let faceLandmarker: FaceLandmarker | null = null;

const initializeFaceLandmarker = async () => {
  try {
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    );
    faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
        delegate: "GPU"
      },
      outputFaceBlendshapes: true,
      runningMode: "VIDEO",
      numFaces: 1
    });
    postMessage({ type: "LOADED" });
  } catch (error) {
    console.error("Failed to initialize FaceLandmarker:", error);
    postMessage({ type: "ERROR", error });
  }
};

initializeFaceLandmarker();

self.onmessage = async (event: MessageEvent) => {
  if (!faceLandmarker) return;

  const { frame, timestamp } = event.data;
  
  try {
    // Detect faces in the frame
    const results = faceLandmarker.detectForVideo(frame, timestamp);
    
    // Post the results back to the main thread
    // We only send back what we need to minimize serialization cost
    postMessage({ type: "RESULT", results });
    
    // Close the bitmap to release memory
    if (frame instanceof ImageBitmap) {
        frame.close();
    }
  } catch (error) {
    console.error("Worker inference error:", error);
  }
};
