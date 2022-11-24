import { serve } from 'https://deno.land/std@0.140.0/http/server.ts';

const contentTypes = {
  js: 'application/javascript',
  css: 'text/css',
  html: 'text/html; charset=utf-8',
};

const getHeaders = (ext) => ({
  headers: {
    'content-type': contentTypes[ext],
  },
});

async function handleRequest(request) {
  const { pathname } = new URL(request.url);

  if (pathname === '/') {
    const file = await Deno.readFile('./index.html');
    return new Response(file, getHeaders('html'));
  }

  const pathnameParts = pathname.split('.');
  const ext = pathnameParts[pathnameParts.length - 1];
  const file = await Deno.readFile('.' + pathname); // ./main.js, etc
  return new Response(file, getHeaders(ext));
}

serve(handleRequest);
