import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import { TiLocationArrow } from "react-icons/ti";
import { useEffect, useRef, useState } from "react";
import Button from "./Button";

gsap.registerPlugin(ScrollTrigger);
const Hero = () => {
  const totalVideos = 4;
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [direction, setDirection] = useState("");

  const directions = {
    north: "North",
    south: "South",
    east: "East",
    west: "West",
    eastnorth: "East-North",
    eastsouth: "East-South",
    northwestEast: "North-West-East", // North-West-East combination
    southeastWest: "South-East-West", // South-East-West combination
  };

  const handleMouseMove = (event: any) => {
    const newX = event.clientX;
    const newY = event.clientY;

    // Determine the direction based on previous and new mouse position
    if (newX > mousePosition.x && newY < mousePosition.y) {
      setDirection(directions.eastnorth); // East-North
    } else if (newX < mousePosition.x && newY < mousePosition.y) {
      setDirection(directions.eastsouth); // East-South
    } else if (newX > mousePosition.x && newY > mousePosition.y) {
      setDirection(directions.eastsouth); // East-South
    } else if (newX < mousePosition.x && newY > mousePosition.y) {
      setDirection(directions.southeastWest); // South-East-West
    } else if (newX > mousePosition.x && newY < mousePosition.y) {
      setDirection(directions.northwestEast); // North-West-East
    } else if (newX > mousePosition.x) {
      setDirection(directions.east);
    } else if (newX < mousePosition.x) {
      setDirection(directions.west);
    } else if (newY < mousePosition.y) {
      setDirection(directions.north);
    } else if (newY > mousePosition.y) {
      setDirection(directions.south);
    }

    setMousePosition({ x: newX, y: newY });
  };

  useEffect(() => {
    console.log(direction);
  }, [direction]);
  const nextVdRef = useRef<any>(null);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [hasClicked, setHasClicked] = useState(false);
  const [hasHovered, setHasHovered] = useState(false);
  const [loadedVideos, setLoadedVideos] = useState(0);
  const [showSmallVideo, setShowSmallVideo] = useState(false);
  const [loading, setLoading] = useState(true);
  const handleVideoLoad = () => {
    setLoadedVideos((prev) => prev + 1);
    // setCurrentIndex((prevIndex) => (prevIndex % totalVideos) + 1);
    // handleMiniVideoClick();
  };
  //   const [totalVideos, setTotalVideos] = useState(3);
  const handleMiniVideoClick = () => {
    setHasClicked(true);

    setCurrentIndex((prevIndex) => (prevIndex % totalVideos) + 1);
  };

  useEffect(() => {}, []);
  useEffect(() => {
    console.log(loadedVideos);
    if (loadedVideos === totalVideos - 1) {
      setLoading(false);
    }
  }, [loadedVideos]);

  const getVideoSrc = (index: number) => `videos/hero-${index}.mp4`;

  useGSAP(
    () => {
      if (hasClicked) {
        gsap.set("#next-video", {
          border: "none",
          visibility: "visible",
        });
        gsap.to("#next-video", {
          transformOrigin: "center center",
          scale: 1,
          width: "100%",
          height: "100%",
          duration: 1,
          ease: "power1.inOut",
          onStart: () => nextVdRef.current.play(),
        });
        gsap.from("#current-video", {
          border: "none",
          transformOrigin: "center center",
          scale: 0,
          duration: 1.5,
          ease: "power1.inOut",
        });
      }
    },
    {
      dependencies: [currentIndex],
      revertOnUpdate: true,
    }
  );
  useGSAP(
    () => {
      if (hasHovered) {
        const t1 = gsap.timeline({ repeat: -1, yoyo: true }); // repeat indefinitely and reverse on each iteration
        t1.to("#smallVideoContainer", {
          transformOrigin: "center center",
          scale: 1.2, // scale up
          duration: 0.6, // pulse speed
          border: "1px solid white",
          ease: "power1.inOut",
        });
        t1.to("#smallVideoContainer", {
          transformOrigin: "center center",
          scale: 0.9, // scale down
          border: "1px solid white",
          duration: 0.6, // pulse speed
          ease: "power1.inOut",
        });
        t1.play();
      }
    },
    {
      dependencies: [hasHovered],
      revertOnUpdate: true,
    }
  );

  useGSAP(() => {
    gsap.set("#video-frame", {
      clipPath: "polygon(14% 0, 72% 0, 88% 90%, 0 95%)",
      borderRadius: "0% 0% 40% 10%",
    });
    gsap.from("#video-frame", {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      borderRadius: "0% 0% 0% 0%",
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: "#video-frame",
        start: "center center",
        end: "bottom center",
        scrub: true,
      },
    });
  });

  useEffect(() => {}, [showSmallVideo]);
  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => {
        setShowSmallVideo(true);
      }}
      className="relative h-dvh w-screen overflow-x-hidden bg-violet-50"
    >
      {loading && (
        <div className="flex-center absolute z-[100] h-dvh w-screen overflow-hidden bg-violet-50">
          {/* https://uiverse.io/G4b413l/tidy-walrus-92 */}
          <div className="three-body">
            <div className="three-body__dot"></div>
            <div className="three-body__dot"></div>
            <div className="three-body__dot"></div>
          </div>
        </div>
      )}
      <div
        id="video-frame"
        className="relative z-10 h-dvh w-screen overflow-hidden rounded-lg bg-blue-75"
      >
        <div>
          <div
            onMouseEnter={() => setHasHovered(true)}
            onMouseLeave={() => setHasHovered(false)}
            id="smallVideoContainer"
            className="mask-clip-path absolute-center absolute z-50 size-64 cursor-pointer overflow-hidden rounded-lg"
          >
            {/* <VideoPreview> */}
            <div
              id="smallVideo"
              onClick={handleMiniVideoClick}
              className={`origin-center ${
                showSmallVideo ? "opacity-1" : "opacity-0"
              }  
              `}
              // scale-[25%]  transition-all duration-500 ease-in hover:scale-100
            >
              <video
                ref={nextVdRef}
                src={getVideoSrc((currentIndex % totalVideos) + 1)!}
                loop
                muted
                id="current-video"
                className="size-64 origin-center scale-150 object-cover object-center"
                onLoadedData={handleVideoLoad}
              />
            </div>
            {/* </VideoPreview> */}
          </div>
          <video
            ref={nextVdRef}
            src={getVideoSrc(currentIndex)}
            loop
            muted
            id="next-video"
            className="absolute-center invisible absolute z-20 size-64 object-cover object-center"
            onLoadedData={handleVideoLoad}
          />
          <video
            src={getVideoSrc(
              currentIndex === totalVideos - 1 ? 1 : currentIndex
            )}
            autoPlay
            loop
            muted
            className="absolute left-0 top-0 size-full object-cover object-center"
            onLoadedData={handleVideoLoad}
          />
        </div>
        <h1 className="special-font hero-heading absolute bottom-5 right-5 z-40 text-blue-75">
          G<b>A</b>MING
        </h1>

        <div className="absolute left-0 top-0 z-40 size-full">
          <div className="mt-24 px-5 sm:px-10">
            <h1 className="special-font hero-heading text-blue-100">
              redefi<b>n</b>e
            </h1>

            <p className="mb-5 max-w-64 font-robert-regular text-blue-100">
              Enter the Metagame Layer <br /> Unleash the Play Economy
            </p>

            <Button
              id="watch-trailer"
              title="Watch trailer"
              leftIcon={<TiLocationArrow />}
              containerClass="bg-yellow-300 flex-center gap-1"
            />
          </div>
        </div>
      </div>

      <div className=" absolute left-0 top-0  size-full">
        <div className="mt-24 px-5 sm:px-10">
          <h1 className="special-font hero-heading text-black">
            redefi<b>n</b>e
          </h1>

          <p className="mb-5 max-w-64 font-robert-regular text-black">
            Enter the Metagame Layer <br /> Unleash the Play Economy
          </p>
        </div>
      </div>
      {/* <Button
        id="watch-trailer"
        title="Watch trailer"
        leftIcon={<TiLocationArrow />}
        containerClass="bg-violet-300 text-white  flex-center gap-1"
      /> */}
      <h1 className="special-font hero-heading absolute bottom-5 right-5 text-black">
        G<b>A</b>MING
      </h1>
    </div>
  );
};

export default Hero;
