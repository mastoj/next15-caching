import RevalidateButton from "@/components/revalidate-button";
import Time from "@/components/time";
import { unstable_cache as cache } from "next/cache";
import Image from "next/image";

type Props = {
  params: Promise<{ id: string }>;
};

export const revalidate = 60;
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
      <div className="overflow-hidden p-4 h-52">
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
    <div className="grid grid-cols-2 auto-rows-auto gap-2 overflow-hidden justify-center h-full max-w-[1200px] mx-auto py-20">
      <div className="text-2xl font-bold flex flex-row justify-center col-span-2">
        Current time: <Time />
      </div>
      <div className="col-span-2 grid grid-cols-2 *:border-2 w-full h-full">
        <div className="flex flex-row justify-center items-center h-full">
          <RevalidateButton
            tag="cats"
            type="countdown-button"
            startTime={new Date().toUTCString()}
            durationInMs={revalidate * 1000}
            runningText={`Revalidates in ${revalidate}s`}
          >
            Revalidate all
          </RevalidateButton>
        </div>
        <div className="h-full">
          <div className="grid grid-rows-2 w-full gap-2 h-full divide-y">
            {[25, 45].map((revalidationTime) => (
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
