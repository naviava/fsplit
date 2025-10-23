import { nanoid } from '@fsplit/utils'
import { Link } from '@tanstack/react-router'
import { FooterLink } from './footer-link'
import { Logo } from '../logo'

const COLUMNS = [
  {
    id: nanoid(),
    title: 'Support',
    links: [
      { id: nanoid(), text: 'Account', href: '/account' },
      { id: nanoid(), text: 'Contact us', href: '/contact' },
      { id: nanoid(), text: 'Reset Password', href: '/forgot-password' },
      { id: nanoid(), text: 'Email Verification', href: '/verification' },
    ],
  },
  {
    id: nanoid(),
    title: 'Legal',
    links: [
      { id: nanoid(), text: 'Privacy Policy', href: '/privacy-policy' },
      { id: nanoid(), text: 'Terms of Service', href: '/terms' },
    ],
  },
  {
    id: nanoid(),
    title: 'Social',
    links: [
      { id: nanoid(), text: 'GitHub', href: 'https://github.com/naviava' },
      {
        id: nanoid(),
        text: 'LinkedIn',
        href: 'https://www.linkedin.com/in/navin-avadhani-aa288785/',
      },
      { id: nanoid(), text: 'X (Twitter)', href: 'https://x.com/oldmannav' },
    ],
  },
]

export function Footer() {
  return (
    <div className="bg-slate-700 pb-10 pt-10 text-neutral-300 font-archivo">
      <div className="mx-auto grid w-[20rem] max-w-screen-lg grid-cols-1 gap-x-6 gap-y-14 px-10 md:w-auto md:grid-cols-4">
        <Link to="/" className="mx-auto h-fit w-fit md:mx-0">
          <Logo dark variant="tall" />
        </Link>
        {COLUMNS.map((column) => (
          <FooterColumn key={column.title} {...column} />
        ))}
      </div>
      <p className="mt-16 text-center text-xs text-neutral-300 lg:text-sm">
        © 2025 Fondingo. All rights reserved.
      </p>
    </div>
  )
}

function FooterColumn({
  title,
  links,
}: {
  title: string
  links: { id: string; text: string; href: string }[]
}) {
  return (
    <div>
      <h3 className="mb-4 text-center font-bold text-neutral-400 md:mb-8 md:text-left lg:text-lg">
        {title}
      </h3>
      <ul className="space-y-2">
        {links.map((link) => (
          <FooterLink key={link.id} title={title} {...link} />
        ))}
      </ul>
    </div>
  )
}
