import { ArrowUpRight, Mail } from "lucide-react";

type ContactLinksProps = {
  contacts: {
    id: string;
    label: string;
    type?: string;
    value: string;
    href: string;
  }[];
};

function ContactIcon({
  contact,
}: {
  contact: ContactLinksProps["contacts"][number];
}) {
  const key =
    `${contact.type ?? ""} ${contact.label} ${contact.href}`.toLowerCase();

  if (key.includes("linkedin")) {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path
          fill="currentColor"
          d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5ZM.5 8h4V23h-4V8Zm7.5 0h3.83v2.05h.05c.53-1 1.84-2.05 3.79-2.05 4.05 0 4.8 2.67 4.8 6.14V23h-4v-7.85c0-1.87-.03-4.28-2.61-4.28-2.61 0-3.01 2.04-3.01 4.15V23h-4V8Z"
        />
      </svg>
    );
  }

  if (key.includes("github")) {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path
          fill="currentColor"
          d="M12 .5C5.65.5.5 5.65.5 12c0 5.09 3.29 9.4 7.86 10.93.58.1.79-.25.79-.56v-2.15c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.25.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.16 1.18A10.97 10.97 0 0 1 12 6.07c.98 0 1.95.13 2.87.38 2.19-1.49 3.15-1.18 3.15-1.18.63 1.58.24 2.75.12 3.04.74.8 1.18 1.83 1.18 3.08 0 4.42-2.69 5.39-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z"
        />
      </svg>
    );
  }

  if (key.includes("email") || key.includes("mailto:")) {
    return <Mail className="h-5 w-5" />;
  }

  return <ArrowUpRight className="h-5 w-5" />;
}

export function ContactLinks({ contacts }: ContactLinksProps) {
  const orderedContacts = [...contacts].sort((a, b) => {
    const order = ["linkedin", "github", "email"];
    const aKey = `${a.type ?? ""} ${a.label}`.toLowerCase();
    const bKey = `${b.type ?? ""} ${b.label}`.toLowerCase();
    const aIndex = order.findIndex((item) => aKey.includes(item));
    const bIndex = order.findIndex((item) => bKey.includes(item));

    return (aIndex === -1 ? 99 : aIndex) - (bIndex === -1 ? 99 : bIndex);
  });

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {orderedContacts.map((contact) => (
        <a
          key={contact.id}
          href={contact.href}
          className="group flex min-h-28 items-center justify-between rounded-lg border bg-card p-5 transition-colors hover:bg-secondary/60"
          target={contact.href.startsWith("http") ? "_blank" : undefined}
          rel={contact.href.startsWith("http") ? "noreferrer" : undefined}
        >
          <span className="flex items-center gap-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <ContactIcon contact={contact} />
            </span>
            <span>
              <span className="block text-lg font-semibold">
                {contact.label}
              </span>
            </span>
          </span>
          <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
        </a>
      ))}
    </div>
  );
}
