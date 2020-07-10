function mtime(file)
    return os.date("%Y-%m-%dT%H:%M:%S+08:00", os.mtime(file))
end

-- generate mirror files and sitemap.xml
-- we need install https://github.com/cwjohan/markdown-to-html first
-- npm install markdown-to-html -g
--
function main()
    local siteroot = "https://xmake.io"
    local mirrordir = "mirror"
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
    os.rm(mirrordir)
    for _, markdown in ipairs(os.files("**.md")) do
        local basename = path.basename(markdown)
        if not basename:startswith("_") then

            -- get the raw url
            if basename == "README" then
                basename = ""
            end
            local url = siteroot .. '/mirror'
            local rawurl = siteroot .. '/#'
            local dir = path.directory(markdown)
            if dir ~= '.' then
                rawurl = rawurl .. '/' .. dir
                url = url .. '/' .. dir
            end
            rawurl = rawurl .. '/' .. basename
            url = url .. '/' .. (basename == "" and "index.html" or (basename .. ".html"))

            -- generate html file
            local htmlfile = path.join(mirrordir, dir, basename == "" and "index.html" or (basename .. ".html"))
            local htmldata = os.iorunv("markdown", {markdown})
            io.writefile(htmlfile, htmldata)
            print("build %s => %s, %s", markdown, htmlfile, mtime(htmlfile))
            print("url %s -> %s", url, rawurl)

            -- generate sitemap
            sitemap:print([[
<url>
  <loc>%s</loc>
  <lastmod>%s</lastmod>
</url>
]], url, mtime(htmlfile))
        end
    end
    sitemap:print("</urlset>")
    sitemap:close()
end


