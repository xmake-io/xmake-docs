import("lib.detect.find_program")
import("lib.detect.find_programver")

function main(opt)
    opt = opt or {}
    opt.check = "--help"
    opt.command = "--help"
    local program = find_program(opt.program or "cl6x", opt)
    local version = nil
    if program and opt.version then
        version = find_programver(program, opt)
    end
    return program, version
end
