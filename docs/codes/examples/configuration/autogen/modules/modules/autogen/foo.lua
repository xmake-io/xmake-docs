function generate(sourcefile, sourcefile_cx)
    local file = io.open(sourcefile_cx, "w")
    if file then
        file:write('#include <stdio.h>\n')
        file:write('void generated_func() {\n')
        file:write('    printf("hello xmake!\\n");\n')
        file:write('}\n')
        file:close()
    end
end
