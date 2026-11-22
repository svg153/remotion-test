import "./index.css";
import { Composition } from "remotion";
import { MyComposition } from "./Composition";
import { BlogLoop, ContentFactory, FactoryVideo } from "./ContentFactory";
import { storyDurationFrames, storyShots } from "./content-factory/story";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Existing tutorial remains unchanged and available. */}
      <Composition
        id="MyComp"
        component={MyComposition}
        durationInFrames={840}
        fps={30}
        width={1280}
        height={720}
      />
      {/* Data-driven horizontal and vertical story previews. */}
      <Composition
        id="ContentFactoryLandscape"
        component={ContentFactory}
        durationInFrames={storyDurationFrames}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="ContentFactoryPortrait"
        component={ContentFactory}
        durationInFrames={storyDurationFrames}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="FactoryVideo"
        component={FactoryVideo}
        durationInFrames={storyDurationFrames}
        fps={30}
        width={1280}
        height={720}
        defaultProps={{ shots: [...storyShots], width: 1280, height: 720, fps: 30 }}
        calculateMetadata={({ props }) => ({
          durationInFrames: props.shots.reduce((n, shot) => n + shot.durationFrames, 0),
          width: props.width,
          height: props.height,
          fps: props.fps,
        })}
      />
      {/* Short standalone seamless loop for blog and social GIF/WebM. */}
      <Composition
        id="BlogLoop"
        component={BlogLoop}
        durationInFrames={120}
        fps={30}
        width={1080}
        height={1080}
      />
    </>
  );
};
