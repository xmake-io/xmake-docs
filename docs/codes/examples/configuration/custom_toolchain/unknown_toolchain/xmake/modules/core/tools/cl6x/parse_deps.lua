import("core.project.config")
import("core.project.project")
import("core.base.hashset")

function _normailize_dep(dep, projectdir)
    if not is_host("windows") then
        dep = dep:gsub("\\(.)", "%1")
    end
    if path.is_absolute(dep) then
        dep = path.translate(dep)
    else
        dep = path.absolute(dep, projectdir)
    end
    if dep:startswith(projectdir) then
        return path.relative(dep, projectdir)
    else
        return dep
    end
end

function main(depsdata, opt)
    local results = hashset.new()
    local projectdir = os.projectdir()
    local line = depsdata:rtrim()
    local plain = {plain = true}
    for _, includefile in ipairs(line:split('\n', plain)) do
        includefile = includefile:split(": ", plain)[2]
        if includefile and #includefile > 0 then
            includefile = _normailize_dep(includefile, projectdir)
            if includefile then
                results:insert(includefile)
            end
        end
    end
    return results:to_array()
end
