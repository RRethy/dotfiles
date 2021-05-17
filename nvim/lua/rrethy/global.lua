local uv = vim.loop

local M = {}

function M.listen(callback)
    if M.server then M.server:close() end

    M.server = uv.new_tcp()
    M.server:bind('0.0.0.0', 12222)
    M.server:listen(128, function(listen_err)
        if listen_err then return end

        local client = uv.new_tcp()
        M.server:accept(client)
        local chunks = {}
        client:read_start(function(read_err, chunk)
            if read_err then
                client:close()
                return
            end

            if chunk then
                table.insert(chunks, chunk)
            else
                vim.schedule_wrap(function()
                    callback(table.concat(chunks))
                end)()
                client:close()
            end
        end)
    end)
end

function M.send(msg)
    local client = uv.new_tcp()
    client:connect('0.0.0.0', 12222, function(err)
        if err then
            client:close()
            return
        end

        client:write(msg)
        client:close()
    end)
end

return M
