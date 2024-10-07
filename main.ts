addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  const target = url.searchParams.get('target')
  if (!target) {
    return new Response('Missing target parameter', { status: 400 })
  }
  const modifiedUrl = new URL(target)
  const modifiedRequest = new Request(modifiedUrl, request)
  modifiedRequest.headers.set('Origin', new URL(target).origin)

  try {
    const response = await fetch(modifiedRequest)
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
    const newResponse = new Response(response.body, response)
    Object.keys(corsHeaders).forEach(key => {
      newResponse.headers.set(key, corsHeaders[key])
    })
    return newResponse
  } catch (e) {
    return new Response('Error fetching the requested resource.', { status: 500 })
  }
}
