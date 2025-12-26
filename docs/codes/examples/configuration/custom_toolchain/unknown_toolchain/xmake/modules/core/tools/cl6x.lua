import("core.base.option")
import("core.base.global")
import("core.project.policy")
import("core.language.language")
import("utils.progress")

function init(self)
end

function nf_symbol(self, level)
    local kind = self:kind()
    if language.sourcekinds()[kind] then
        local maps = _g.symbol_maps
        if not maps then
            maps =
            {
                debug  = "-g"
            }
            _g.symbol_maps = maps
        end
        return maps[level .. '_' .. kind] or maps[level]
    end
end

function nf_optimize(self, level)
    local maps =
    {
        none       = "-O0"
    ,   fast       = "-O1"
    ,   faster     = "-O2"
    ,   fastest    = "-O3"
    ,   smallest   = "-m3"
    ,   aggressive = "-O3"
    }
    return maps[level]
end

function nf_define(self, macro)
    return "-D" .. macro
end

function nf_undefine(self, macro)
    return "-U" .. macro
end

function nf_includedir(self, dir)
    return {"-I" .. dir}
end

function nf_sysincludedir(self, dir)
    return nf_includedir(self, dir)
end

function nf_link(self, lib)
    if not lib:endswith(".a") and not lib:endswith(".so") then
         lib = "lib" .. lib .. ".a"
    end
    return "-l" .. lib
end

function nf_syslink(self, lib)
    return nf_link(self, lib)
end

function nf_linkdir(self, dir)
    return {"-i" .. path.translate(dir)}
end
