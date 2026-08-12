const defaultOrigins = [
  'https://www.yenlac-dragoncity.com.vn',
  'https://yenlac-dragoncity.com.vn',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
];

export const corsHeaders = (request: Request) => {
  const origin = request.headers.get('origin') || '';
  const configuredOrigins = (Deno.env.get('ALLOWED_ORIGINS') || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
  const allowed = [...defaultOrigins, ...configuredOrigins];
  const responseOrigin = allowed.includes(origin) ? origin : allowed[0];
  return {
    'Access-Control-Allow-Origin': responseOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Vary': 'Origin',
  };
};

export const json = (request: Request, body: Record<string, unknown>, status = 200) => new Response(
  JSON.stringify(body),
  { status, headers: { ...corsHeaders(request), 'Content-Type': 'application/json; charset=utf-8' } },
);

export const escapeHtml = (value: string) => value.replace(/[&<>'"]/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
}[character] || character));

