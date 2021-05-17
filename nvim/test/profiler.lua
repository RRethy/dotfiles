-- local profiler = require('rrethy.profiler')

-- local function foo(x)
--     if x == 1 then
--         return 1
--     end
--     return foo(x - 1)
-- end

-- profiler.start()
-- foo(2)
-- vim.fn.bufnr()
-- vim.uri_from_fname('.')
-- profiler.stop()

local profile = require('jit.p')

-- profile.start('f', function(thread, samples, vmstate)
--     print(vim.insert(thread), vim.insert(samples), vim.insert(vmstate))
-- end)

profile.start('f', 'foobar.txt')

local function foo(x)
    if x == 1 then
        return 1
    end
    return foo(x - 1)
end

foo(2)
vim.fn.bufnr()
vim.uri_from_fname('.')

os.execute('sleep 2')

print('stop: ', profile.stop())
