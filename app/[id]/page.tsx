import RevalidateButton from "@/components/revalidate-button";
import Time from "@/components/time";
import { unstable_cache as cache } from "next/cache";
import Image from "next/image";

type Props = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-static";
export const generateStaticParams = () => {
  return [];
};

// Get random cat image url
const getRandomCat = async (revalidationTime: number) => {
  const cacheTags = ["cats", `variant-${revalidationTime.toString()}`];
  console.log("==> Cache tags: ", cacheTags);
  return cache(
    async () => {
      const timestamp = new Date().toUTCString();
      const response = await fetch(
        `https://api.thecatapi.com/v1/images/search?rnd=${revalidationTime}`
      );
      const data = await response.json();
      console.log(
        "==> Revalidation time: ",
        revalidationTime,
        data[0].url,
        timestamp
      );
      return { ...data[0], timestamp } as {
        url: string;
        width: number;
        height: number;
        timestamp: string;
      };
    },
    ["cat-image-" + revalidationTime.toString()],
    {
      revalidate: revalidationTime,
      tags: cacheTags,
    }
  )();
};

const CatImage = async ({ revalidationTime }: { revalidationTime: number }) => {
  const catData = await getRandomCat(revalidationTime);
  const durationInMs = revalidationTime * 1000;
  const startTime = catData.timestamp;
  return (
    <div className="flex flex-col gap-2 h-full w-full">
      <span>{startTime}</span>
      <div className="h-[80%] overflow-hidden p-4">
        <Image
          src={catData.url}
          alt="Cat image"
          width={catData.width}
          height={catData.height}
          className="object-contain max-w-full max-h-full shadow-lg rounded-lg"
        />
      </div>
      {catData.url}
      <div className="h-[20%] flex flex-row justify-center items-center">
        <RevalidateButton
          tag={`variant-${revalidationTime.toString()}`}
          startTime={startTime.toString()}
          durationInMs={durationInMs}
          runningText={`Revalidates in ${revalidationTime}s`}
          completedText="Get the new image"
          type="countdown-button"
        >
          Revalidate {revalidationTime}
        </RevalidateButton>
      </div>
    </div>
  );
};

const CachePage = async ({ params }: Props) => {
  const { id } = await params;
  console.log("==> Cache page: ", id);
  return (
    <div className="grid grid-cols-1 gap-2 overflow-hidden justify-center my-auto h-[70%]">
      <div className="text-2xl font-bold flex flex-row justify-center mt-20">
        Current time: <Time />
      </div>
      <div className="grid grid-cols-2 max-w-[800px] mx-auto *:border-2 flex-1 h-[70%]">
        <div className="flex flex-row justify-center items-center h-[75%]">
          <RevalidateButton tag="cats" type="revalidate-button">
            Revalidate all
          </RevalidateButton>
        </div>
        <div className="h-[75%]">
          <div className="grid grid-rows-2 w-full gap-2 h-full">
            {[10, 20].map((revalidationTime) => (
              <CatImage
                key={revalidationTime}
                revalidationTime={revalidationTime}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CachePage;
