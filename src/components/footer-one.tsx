import Link from 'next/link'

const links = [
    { title: 'About', href: '/about' },
    { title: 'This Year', href: '/this-year' },
    { title: 'Partners', href: '/partners' },
    { title: 'FAQ', href: '/faq' },
    { title: 'Privacy Policy', href: '/legal/privacy-policy' },
    { title: 'Terms of Service', href: '/legal/terms-of-service' },
]

export default function FooterSection() {
    return (
        <footer className="bg-muted py-16">
            <div className="mx-auto max-w-5xl px-6">
                <Link
                    href="/"
                    aria-label="go home"
                    className="mx-auto block size-fit"
                >
                    <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
                </Link>

                <div className="my-8 flex flex-wrap justify-center gap-6">
                    {links.map((link, index) => (
                        <Link
                            key={index}
                            href={link.href}
                            className="text-muted-foreground hover:text-primary block duration-150">
                            <span>{link.title}</span>
                        </Link>
                    ))}
                </div>
                <div className="my-8 flex flex-wrap justify-center gap-6 text-sm">
                    <Link
                        href="https://mymun.com/conferences/plismun-2026"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Mymun"
                        className="text-muted-foreground hover:text-primary block">
                        <svg 
                        className="size-6"
                        width="1em"
                        height="1em"
                        viewBox="0 0 708.66 708.66" 
                        xmlns="http://www.w3.org/2000/svg">
                            <g fill="currentColor"><path d="m250.26 336.29c20-29.28 31.91-21.76 34.35-61.48a67.79 67.79 0 0 1 .59-8.78 112.15 112.15 0 0 0 -39 43.91 393.27 393.27 0 0 0 -35.91-50.35c-.78 4.59-1.46 9.76-1.95 14.05v7.36c-2.09 36.26 15.38 34.12 41.92 55.29z"/><path d="m295.54 238.42a67.74 67.74 0 0 1 5.27-7.42c-45.08-3.81-54.06 28.3-54.06 28.3a358 358 0 0 0 -8-67.33 159.82 159.82 0 0 0 -11.52 18.34c-18.34 35.52 5.37 47.14 18.54 78.07 15.71-27.38 36.23-30.74 49.77-49.96z"/><path d="m254.26 232.27c25.57-23.52 47-9.76 65.38-16.79a41.24 41.24 0 0 0 15.81-17.95c-26.34-4.1-42.25-10.93-66.75 13.17a87.08 87.08 0 0 0 12.69-58.55 143.37 143.37 0 0 0 -15.13 10c-24.26 23.77-6.34 29.13-12 70.12z"/><path d="m452.65 352.78c-14.25-17.27-31.71-26.64-41.57-45.37a67.43 67.43 0 0 1 -118.08 0c-9.76 18.73-27.32 28.2-41.57 45.37-15-12.29-31.52-16.29-42.25-29.27 14.15 92.89 119.44 252 142.86 252s128.13-159.11 142.37-251.22c-10.83 12.39-26.93 16.39-41.76 28.49z"/><path d="m495.88 274.42v-.78c0-4.78-1.08-9.76-2-14.05a392.76 392.76 0 0 0 -36.39 50.35 112.15 112.15 0 0 0 -39-43.91 67.79 67.79 0 0 1 .59 8.78c2.44 39.72 14.35 32.6 34.35 61.48 26.57-21.29 44.01-19.03 42.57-55.29a36.17 36.17 0 0 0 -.12-6.58z"/><path d="m477 210.31a159.76 159.76 0 0 0 -11.67-18.31 358.43 358.43 0 0 0 -8.09 67.52s-8.89-32.3-54.36-28.49a66.92 66.92 0 0 1 5.57 7.51c13.17 19.52 33.66 22.64 49.47 50.16 13.27-31.25 37.37-42.87 19.08-78.39z"/><path d="m437.33 162.11a144.5 144.5 0 0 0 -14.94-10.35 87.19 87.19 0 0 0 12.69 58.55c-24.59-17.86-38.35-11.71-64.69-.49a67.33 67.33 0 0 1 10.53 4.1c19.52 9.76 41.47-6.73 68.31 18.15-5.07-40.79 12.98-46.15-11.9-69.96z"/><path d="m334.57 154.69c24.49-6.54 52.31-7 59.92 13.27a70.72 70.72 0 0 0 -42.06 34.45c16.11-4.39 34.35-14.25 61.19-14.25-1.95-9.76-.69-25-9.76-37.37a48.12 48.12 0 0 0 -31.13-17.37c-26.84-2.83-36.01 13.95-38.16 21.27z"/><path d="m307.35 172.45c10.85-9.38 20.7-27.25 15.42-37.67a134 134 0 0 0 -21 6.54c-14.93 8.1-3.52 23.32-9.76 42.16a100.88 100.88 0 0 1 26.54 1.17l4.39 1.17c6.07 1.82 9.27 2.92 18.74 1.76s29.51-20.85 33.95-23.42c-22.13-13.16-60.57 7.02-68.28 8.29z"/></g>
                        </svg>
                    </Link>
                    <Link
                        href="https://www.facebook.com/Plismunofficial/"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Facebook"
                        className="text-muted-foreground hover:text-primary block">
                        <svg
                            className="size-6"
                            xmlns="http://www.w3.org/2000/svg"
                            width="1em"
                            height="1em"
                            viewBox="0 0 24 24">
                            <path
                                fill="currentColor"
                                d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95"></path>
                        </svg>
                    </Link>
                    <Link
                        href="mailto:plismun@parklane-is.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Email"
                        className="text-muted-foreground hover:text-primary block">
                        <svg
                            className="size-6"
                            xmlns="http://www.w3.org/2000/svg"
                            width="1em"
                            height="1em"
                            viewBox="0 0 24 24">
                            <path
                                fill="currentColor"
                                d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2m0 2v.01L12 13L4 6.01V6zm0 12H4V8.25l8 6.99l8-6.99z"/>
                        </svg>
                    </Link>
                    <Link
                        href="https://www.instagram.com/plismun/"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Instagram"
                        className="text-muted-foreground hover:text-primary block">
                        <svg
                            className="size-6"
                            xmlns="http://www.w3.org/2000/svg"
                            width="1em"
                            height="1em"
                            viewBox="0 0 24 24">
                            <path
                                fill="currentColor"
                                d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3"></path>
                        </svg>
                    </Link>
                    <Link
                        href="https://www.linkedin.com/in/plis-mun-3b1a61293/"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="LinkedIn"
                        className="text-muted-foreground hover:text-primary block">
                        <svg
                            className="size-6"
                            xmlns="http://www.w3.org/2000/svg"
                            width="1em"
                            height="1em"
                            viewBox="0 0 24 24">
                            <path
                                fill="currentColor"
                                d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93zM6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37z"></path>
                        </svg>
                    </Link>
                </div>
                <span className="text-muted-foreground block text-center text-sm"> © {new Date().getFullYear()} Park Lane Internation School, All rights reserved <br />Made by Tomáš Stoklásek</span>
            </div>
        </footer>
    )
}
