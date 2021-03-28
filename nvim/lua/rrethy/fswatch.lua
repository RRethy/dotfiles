local nvim = require('rrethy.nvim')

local M = {}

function M.watch(path, cb, flags)
    local fullpath = nvim.fn.expand(path)
    local fs_event = nvim.loop.new_fs_event()
    fs_event:start(fullpath, flags or {}, nvim.schedule_wrap(cb))
    return fs_event
end

return M
