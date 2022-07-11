import { verify } from "jsonwebtoken";

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  if (request.method !== "GET")
    return res({ success: false, message: "Method not allowed." }, 405);

  if (!request.headers.has("Authorization"))
    return res({ success: false, message: "No authorization headers." }, 400);

  try {
    const data = verify(request.headers.get("Authorization"), JWT_SECRET);

    return res({ success: true, message: data.id }, 200);
  } catch (e) {
    console.log(e);
    return res(
      { success: false, message: "Invalid authorization headers." },
      400
    );
  }
}

function res(body, status) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": ORIGINS,
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Credentials": "true",
    },
  });
}
