export const metadata = {
  title: 'BrightPath Tutoring',
  description: 'Student tutoring platform for personalized learning support.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
