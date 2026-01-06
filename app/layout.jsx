import './global.css'

export const metadata = {
    title: 'Simple Currency',
    description: 'Currency exchange rates and converter',
}

export default function RootLayout({
    children,
}) {
    
    return (
        <html lang="en" data-arp="">
            <body>
                {children}
            </body>
        </html>
    )
    
}
