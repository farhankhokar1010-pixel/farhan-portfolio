import { profile } from "@/data/profile";
import { SectionHeading } from "@/components/common/SectionHeading";
import { Reveal } from "@/components/common/Reveal";
import { ComposeForm } from "./ComposeForm";
import { CopyEmail } from "./CopyEmail";
import { GitHubIcon, LinkedInIcon, MailIcon, PhoneIcon, WhatsAppIcon } from "./icons";

const tile =
  "group flex items-center gap-4 rounded-2xl border border-line bg-elevated p-4 transition-[border-color,transform,background-color] duration-300 ease-cinematic hover:-translate-y-0.5 hover:border-accent";
const iconWrap = "grid h-11 w-11 shrink-0 place-items-center rounded-full transition-colors duration-300";
const neutral = `${iconWrap} bg-surface text-ink group-hover:bg-accent group-hover:text-on-accent`;

function Tile({ href, label, value, icon, brand, external = true }: { href: string; label: string; value: string; icon: React.ReactNode; brand?: string; external?: boolean }) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      data-cursor="link"
      data-cursor-label="OPEN"
      className={tile}
    >
      <span className={brand ? `${iconWrap} ${brand}` : neutral}>{icon}</span>
      <span className="min-w-0">
        <span className="label block">{label}</span>
        <span className="block break-words text-[0.95rem] font-medium leading-snug">{value}</span>
      </span>
      <span aria-hidden className="ml-auto text-muted transition-colors group-hover:text-accent-text">↗</span>
    </a>
  );
}

export function Contact() {
  const linkedin = profile.socials.find((s) => s.label === "LinkedIn");
  const github = profile.socials.find((s) => s.label === "GitHub");

  return (
    <section id="contact" className="mx-auto flex max-w-[1500px] flex-col px-6 pb-10 pt-20 sm:px-12 lg:min-h-dvh lg:px-16 lg:pt-28">
      {/* Both columns are centred against each other, and the block is centred in the laptop viewport. */}
      <div className="grid flex-1 content-center items-center gap-10 py-6 lg:grid-cols-[5fr_6fr] lg:gap-16">
        <div className="flex flex-col gap-8">
          <SectionHeading
            index="07"
            title="Let's build something"
            intro="Have a project, an internship or a question? Write to me — I read every message."
          />

          <Reveal>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className={`${tile} flex-wrap sm:col-span-2`}>
                <a href={`mailto:${profile.email}`} data-cursor="link" className="flex min-w-[15rem] flex-1 items-center gap-4">
                  <span className={neutral}><MailIcon /></span>
                  <span className="min-w-0">
                    <span className="label block">Email</span>
                    <span className="block break-all text-[0.95rem] font-medium leading-snug">{profile.email}</span>
                  </span>
                </a>
                <CopyEmail email={profile.email} />
              </div>

              {profile.whatsappUrl && (
                <Tile href={profile.whatsappUrl} label="WhatsApp" value="Chat with me" icon={<WhatsAppIcon />} brand="bg-[#25D366] text-white" />
              )}
              {profile.phone && (
                <Tile href={`tel:${profile.phone.tel}`} label="Call" value={profile.phone.display} icon={<PhoneIcon />} external={false} />
              )}
              {linkedin && <Tile href={linkedin.href} label="LinkedIn" value="Connect with me" icon={<LinkedInIcon />} />}
              {github && <Tile href={github.href} label="GitHub" value="See my code" icon={<GitHubIcon />} />}
            </div>

            <p className="mt-5 flex flex-wrap items-center gap-3 text-sm text-muted">
              <span>Based in {profile.location}</span>
              {profile.availability && <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-on-accent">{profile.availability}</span>}
            </p>
          </Reveal>
        </div>

        <Reveal>
          <ComposeForm />
        </Reveal>
      </div>

      <footer className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6 text-sm text-muted sm:pr-44">
        <p>© {new Date().getFullYear()} {profile.name}</p>
        <p>Built with Next.js, React Three Fiber &amp; GSAP</p>
      </footer>
    </section>
  );
}
