export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="ru">
        <body className="bg-black text-white">
              <main className="flex-1 p-4">{children}</main>
        </body>
        </html>
    )
}

