import Link from 'next/link'
import { Github, Twitter, Linkedin } from 'lucide-react'
import { Logo } from './logo'

export function MarketingFooter() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="container py-14">
        <div className="grid gap-10 md:grid-cols-5">
          <div className="md:col-span-2 space-y-3">
            <Logo />
            <p className="max-w-xs text-sm text-muted-foreground">
              The practice gym for system design. Drag, design, ship — and walk into
              every architecture conversation fluent.
            </p>
            <div className="flex gap-3 pt-2 text-muted-foreground">
              <Link href="#" aria-label="Twitter" className="hover:text-foreground">
                <Twitter className="h-4 w-4" />
              </Link>
              <Link href="#" aria-label="GitHub" className="hover:text-foreground">
                <Github className="h-4 w-4" />
              </Link>
              <Link href="#" aria-label="LinkedIn" className="hover:text-foreground">
                <Linkedin className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <FooterColumn
            title="Product"
            links={[
              { href: '/problems', label: 'Problems' },
              { href: '/lessons', label: 'Fundamentals' },
              { href: '/pricing', label: 'Pricing' },
              { href: '/changelog', label: 'Changelog' },
            ]}
          />
          <FooterColumn
            title="Resources"
            links={[
              { href: '/blog', label: 'Blog' },
              { href: '/about', label: 'About' },
              { href: '/faq', label: 'FAQ' },
              { href: '/contact', label: 'Contact' },
            ]}
          />
          <FooterColumn
            title="Legal"
            links={[
              { href: '/privacy', label: 'Privacy' },
              { href: '/terms', label: 'Terms' },
              { href: '/security', label: 'Security' },
            ]}
          />
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border/60 pt-8 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} SysDesign Gym. Built for engineers, not lectures.</p>
          <p>
            Made with rigor in <span className="text-foreground">CA + IN</span>
          </p>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({
  title,
  links,
}: {
  title: string
  links: { href: string; label: string }[]
}) {
  return (
    <div>
      <h4 className="mb-3 text-xs font-display font-bold uppercase tracking-widest text-foreground/80">
        {title}
      </h4>
      <ul className="space-y-2 text-sm">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
