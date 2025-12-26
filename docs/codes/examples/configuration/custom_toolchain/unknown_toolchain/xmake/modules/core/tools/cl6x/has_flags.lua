import("core.cache.detectcache")
import("core.language.language")

function _islinker(flags, opt)
    local toolkind = opt.toolkind or ""
    return toolkind == "ld" or toolkind == "sh" or toolkind:endswith("ld") or toolkind:endswith("sh")
end

function _try_running(program, argv, opt)
    local errors = nil
    return try { function () os.runv(program, argv, opt); return true end, catch { function (errs) errors = (errs or ""):trim() end }}, errors
end

function _check_from_knownargs(flags, opt, islinker)
    local flag = flags[1]
    if not islinker then
        if flag:startswith("-D") or
           flag:startswith("-U") or
           flag:startswith("-I") then
            return true
        end
    end
end

function _check_from_arglist(flags, opt, islinker)
    local key = "core.tools.cl6x." .. (islinker and "has_ldflags" or "has_cflags")
    local flagskey = opt.program .. "_" .. (opt.programver or "")
    local allflags = detectcache:get2(key, flagskey)
    if not allflags then
        allflags = {}
        local arglist = try {function () return os.iorunv(opt.program, {"--help"}, {envs = opt.envs}) end}
        if arglist then
            for arg in arglist:gmatch("%s+(%-[%-%a%d]+)%s+") do
                allflags[arg] = true
            end
        end
        detectcache:set2(key, flagskey, allflags)
    end
    local flag = flags[1]
    return allflags[flag]
end

function _get_extension(opt)
    return (opt.program:endswith("++") or opt.flagkind == "cxxflags") and ".cpp" or (table.wrap(language.sourcekinds()[opt.toolkind or "cc"])[1] or ".c")
end

function _check_try_running(flags, opt, islinker)

    local snippet = opt.snippet or "int main(int argc, char** argv)\n{return 0;}\n"
    local sourcefile = os.tmpfile("cl6x_has_flags:" .. snippet) .. _get_extension(opt)
    if not os.isfile(sourcefile) then
        io.writefile(sourcefile, snippet)
    end

    local tmpfile = os.tmpfile()
    if islinker then
        return _try_running(opt.program, table.join(flags, "-z", "--output_file=" .. tmpfile, sourcefile), opt)
    end

    return _try_running(opt.program, table.join(flags, "-c", "--output_file=" .. tmpfile, sourcefile), opt)
end

function main(flags, opt)
    opt = opt or {}
    local islinker = _islinker(flags, opt)
    if _check_from_knownargs(flags, opt, islinker) then
        return true
    end
    if _check_from_arglist(flags, opt, islinker) then
        return true
    end
    return _check_try_running(flags, opt, islinker)
end
