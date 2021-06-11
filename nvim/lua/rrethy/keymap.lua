local nvim = require('rrethy.nvim')

local M = {}

function M.setup(opts)
    for t, maps in opts do
        for key, map in maps do
            if type(map) == 'string' or type(map) == 'function' then
                nvim[t](key, map)
            end
        end
    end
end

return M
