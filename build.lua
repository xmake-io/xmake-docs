function mtime(file)
    return os.date("%Y-%m-%dT%H:%M:%S+08:00", os.mtime(file))
end

function header(url)
    return format([[
<h2>Note: this is the mirror page, if you want to see the original page, please goto: </h2>
<a href="%s">%s</a>
</br>]], url, url)
end

function ads()
    return [[
<script async type="text/javascript" src="//cdn.carbonads.com/carbon.js?serve=CE7I52QU&placement=xmakeio" id="_carbonads_js"></script>
<style>
#carbonads {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu,
  Cantarell, "Helvetica Neue", Helvetica, Arial, sans-serif;
}

#carbonads {
  display: flex;
  max-width: 330px;
  background-color: hsl(0, 0%, 98%);
  box-shadow: 0 1px 4px 1px hsla(0, 0%, 0%, .1);
}

#carbonads a {
  color: inherit;
  text-decoration: none;
}

#carbonads a:hover {
  color: inherit;
}

#carbonads span {
  position: relative;
  display: block;
  overflow: hidden;
}

#carbonads .carbon-wrap {
  display: flex;
}

.carbon-img {
  display: block;
  margin: 0;
  line-height: 1;
}

.carbon-img img {
  display: block;
}

.carbon-text {
  font-size: 13px;
  padding: 10px;
  line-height: 1.5;
  text-align: left;
}

.carbon-poweredby {
  display: block;
  padding: 8px 10px;
  background: repeating-linear-gradient(-45deg, transparent, transparent 5px, hsla(0, 0%, 0%, .025) 5px, hsla(0, 0%, 0%, .025) 10px) hsla(203, 11%, 95%, .4);
  text-align: center;
  text-transform: uppercase;
  letter-spacing: .5px;
  font-weight: 600;
  font-size: 9px;
  line-height: 1;
}
</style>
    ]]
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
            local f = io.open(htmlfile, 'w')
            if f then
                f:write(header(rawurl))
                f:write(ads())
                f:write(htmldata)
                f:close()
            end
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


