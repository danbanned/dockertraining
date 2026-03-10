// app/components/Layout.js
import React from 'react';
import Head from 'next/head';

export default function Layout({ children, title = 'My App' }) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Production-ready Docker application" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header style={{ 
        backgroundColor: '#333', 
        color: 'white', 
        padding: '1rem 2rem' 
      }}>
        <h1 style={{ margin: 0 }}>My App</h1>
      </header>
      <main>{children}</main>
      <footer style={{ 
        backgroundColor: '#f5f5f5', 
        padding: '1rem 2rem', 
        textAlign: 'center',
        marginTop: '2rem'
      }}>
        <p>© {new Date().getFullYear()} My App. All rights reserved.</p>
      </footer>
    </>
  );
}