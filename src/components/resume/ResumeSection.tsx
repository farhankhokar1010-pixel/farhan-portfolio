import { Resume } from "./Resume";

/** #resume — interactive resume + PDF download. */
export function ResumeSection() {
  return (
    <section id="resume" className="mx-auto max-w-[1500px] px-6 pb-14 pt-20 sm:px-12 lg:px-16">
      <Resume />
    </section>
  );
}
