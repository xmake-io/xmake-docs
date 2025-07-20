export default async (request, context) => {
  if (request.url.pathname === "/") {
    const lang = request.headers.get("accept-language") || "";
    if (lang.startsWith("zh")) {
      return Response.redirect("/zh/", 302);
    }
  }
  return context.next();
};
