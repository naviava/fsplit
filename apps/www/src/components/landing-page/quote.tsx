import { TextGenerateEffect } from './text-generate-effect'

export function Quote() {
  return (
    <div className="my-28 md:my-40">
      <div className="flex items-center justify-center px-4">
        <div className="max-w-[40rem]">
          <blockquote className="text-[2rem] font-semibold text-neutral-700 md:text-[2.5rem] lg:text-[3rem] font-quote">
            <div className="text-center">
              <TextGenerateEffect
                words={`Coming together is a beginning; keeping together is progress;
              working together is success.`}
              />
            </div>
          </blockquote>
          <p className="mt-8 text-right text-neutral-500 md:text-lg lg:text-xl font-archivo">
            - Henry Ford
          </p>
        </div>
      </div>
    </div>
  )
}
