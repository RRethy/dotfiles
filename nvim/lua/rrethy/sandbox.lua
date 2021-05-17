local profiler = require('rrethy.profiler')

local function foo(x)
    if x == 1 then
        return 1
    end
    return foo(x - 1)
end

profiler.start()
local x = foo(2)
profiler.stop()
