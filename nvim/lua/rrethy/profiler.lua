local M = {}

M.calls = {}

-- tail recursion and C calls not triggering return events are tough to deal with

local function hook(event)
    local info = debug.getinfo(2, 'nS')
    info.event = event
    table.insert(M.calls, info)

    -- C functions trigger a hook event type, but don't trigger return event types
    if info.what == 'C' then
        return
    end

    if event == 'call' then
        if debug.getinfo(M.stack_size + 2, 'nS') then
            -- only increment if it's not a tail recursive call which reuses the previous stack frame
            M.stack_size = M.stack_size + 1
        end
    elseif event == 'return' then
        M.stack_size = M.stack_size - 1
    end
end

function M.start()
    M.calls = {}
    local stack_size = 0
    while debug.getinfo(stack_size + 2, 'nS') do
        stack_size = stack_size + 1
    end
    M.stack_size = stack_size
    debug.sethook(hook, 'cr', 0)
end

function M.stop()
    debug.sethook()
    print(vim.inspect(M.calls))
end

return M
