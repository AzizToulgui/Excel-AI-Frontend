import Link from "next/link";
import { useState } from "react";
import FileUpload from "./ui/file-upload";
import Typewriter from "./ui/typewriter";

export function Hero() {
  const [uploadKey, setUploadKey] = useState(0);

  return (
    <section className="relative min-h-screen pb-8">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="/serene-nature-sharp.jpg"
          alt="Serene natural landscape"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/30 to-background" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center lg:px-8">
        <h1
          className="font-serif text-5xl leading-[1.05] tracking-tight text-white lg:text-6xl xl:text-5xl"
          style={{ textShadow: "0 4px 20px rgba(0,0,0,0.5)" }}
        >
          <span className="text-balance">
            <span>{"Drop your sheet & "}</span>
            <Typewriter
              text={["Chat.", "Analyze.", "Ask.", "Explore.", "Understand."]}
              speed={60}
              className="text-accent font-semibold "
              waitTime={2500}
              deleteSpeed={35}
              cursorChar={"|"}
            />
          </span>
        </h1>
        <FileUpload
          key={uploadKey}
          onSuccess={() => setUploadKey((prev) => prev + 1)}
        />
      </div>
    </section>
  );
}
