import { memo } from "react";

const logos = Array.from({ length: 6 });

const CustomerLogos = () => {
  return (
    <section className="bg-zinc-900 min-h-[30vh]">
      <div className="py-8 lg:py-16 mx-auto max-w-screen-xl px-4">
        <div className="grid grid-cols-2 gap-8 sm:gap-12 md:grid-cols-6">
          {logos.map((_, i) => (
            <a key={i} href="#" className="flex justify-center items-center">
              <div className="h-9 w-24 bg-gray-600 rounded"></div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default memo(CustomerLogos);