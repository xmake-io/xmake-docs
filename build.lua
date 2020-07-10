-- generate sitemap.xml
function mtime(file)
    return os.date("%Y-%m-%dT%H:%M:%S+08:00", os.mtime(file))
end
function main()
    local siteroot = "https://xmake.io"
    local sitemap = io.open("sitemap.xml", 'w')
    sitemap:print([[
<?xml version="1.0" encoding="UTF-8"?>
<urlset
      xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
    ]])
    sitemap:print([[
<url>
  <loc>%s</loc>
  <lastmod>%s</lastmod>
</url>
]], siteroot, mtime("index.html"))
    for _, markdown in ipairs(os.files("**.md")) do
        local basename = path.basename(markdown)
        if not basename:startswith("_") then
            if basename == "README" then
                basename = ""
            end
            local url = path.join(siteroot, '#')
            local dir = path.directory(markdown)
            if dir ~= '.' then
                url = path.join(url, dir)
            end
            url = url .. '/' .. basename
            print("build %s => %s, %s", markdown, url, mtime(markdown))
            sitemap:print([[
<url>
  <loc>%s</loc>
  <lastmod>2020-07-10T01:37:22+00:00</lastmod>
</url>
]], url)
        end
    end
    sitemap:print("</urlset>")
    sitemap:close()
end


