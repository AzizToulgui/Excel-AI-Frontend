import { Upload, Database, MessageSquareText } from "lucide-react";

import FlexiFilterTable from "./ui/flexi-filter-table";

export function ProductSection() {
  return (
    <section className="relative py-10">
      <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
        <div className="inline-block">
          <div className="font-serif text-5xl leading-tight tracking-tight text-foreground lg:text-6xl">
            <span className="items-center justify-center gap-2 align-middle lg:inline-flex lg:gap-4">
              Turn Excel sheets into AI-ready data
            </span>
          </div>

          <svg
            className="mx-auto mt-2 w-48"
            viewBox="0 0 200 10"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 5 Q 10 0, 20 5 T 40 5 T 60 5 T 80 5 T 100 5 T 120 5 T 140 5 T 160 5 T 180 5 T 200 5"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              className="text-accent"
            />
          </svg>
        </div>

        <p className="mt-8 text-lg leading-relaxed text-muted-foreground lg:text-xl">
          Upload your Excel or CSV files, automatically extract and store user
          data, explore it through a seamless table interface, and interact with
          your data using our AI-powered chatbot.
        </p>
        <div className="mt-16 relative left-1/2 -translate-x-1/2 w-[90vw]">
          <FlexiFilterTable />
        </div>
        {/* Feature grid */}
        {/* <div className="mt-16 grid gap-5 text-left md:grid-cols-3">
          <div className="group relative rounded-2xl border border-accent/20 bg-linear-to-b from-accent/5 to-transparent p-5 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-xl">
            <Upload className="mb-4 h-8 w-8 text-accent transition-transform duration-300 group-hover:scale-110" />

            <h3 className="font-serif text-xl text-foreground">
              Instant File Import
            </h3>

            <p className="mt-4 leading-relaxed text-muted-foreground">
              Drop in Excel or CSV files and automatically extract structured
              user data in seconds with zero manual setup.
            </p>
          </div>

          <div className="group relative rounded-2xl border border-accent/20 bg-linear-to-b from-accent/5 to-transparent p-5 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-xl">
            <Database className="mb-4 h-8 w-8 text-accent transition-transform duration-300 group-hover:scale-110" />

            <h3 className="font-serif text-xl text-foreground">
              Smart Data Tables
            </h3>

            <p className="mt-4 leading-relaxed text-muted-foreground">
              Store your imported data in the database and visualize it through
              fast, clean, and searchable tables built for large datasets.
            </p>
          </div>

          <div className="group relative rounded-2xl border border-accent/20 bg-linear-to-b from-accent/5 to-transparent p-5 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-xl">
            <MessageSquareText className="mb-4 h-8 w-8 text-accent transition-transform duration-300 group-hover:scale-110" />

            <h3 className="font-serif text-xl text-foreground">
              AI Data Assistant
            </h3>

            <p className="mt-4 leading-relaxed text-muted-foreground">
              Ask questions about your uploaded data using our AI chatbot and
              get instant insights, summaries, and answers in natural language.
            </p>
          </div>
        </div> */}
      </div>
    </section>
  );
}
