import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

function Home() {
  return (
    <>
      <div className="min-h-screen bg-slate-400 gap-3 flex flex-col lg:flex-row justify-between p-10">
        <div className="h-20 bg-slate-300 gap-2 flex flex-row justify-center items-center p-32 rounded">
          <Button className="text-black hover:text-white bg-red-500">
            Hi1
          </Button>
          <Button className="text-black bg-red-500">Hi2</Button>
          <Button className="text-black bg-red-500">Hi3</Button>
          <Button className="text-black bg-red-500">Hi4</Button>
        </div>

        <div className="bg-yellow-500 h-20 p-32 rounded">
          <Carousel>
            <CarouselContent>
              <CarouselItem>
                <p className="text-center">Slide 1</p>
              </CarouselItem>
              <CarouselItem>
                <p className="text-center">Slide 2</p>
              </CarouselItem>
              <CarouselItem>
                <p className="text-center">Slide 3</p>
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext className="bg-red-500 text-white border-black" />
          </Carousel>
        </div>
      </div>
    </>
  );
}

export default Home;
