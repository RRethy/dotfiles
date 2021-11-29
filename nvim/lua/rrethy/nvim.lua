local M = vim

local map_callbacks = {}

local function make_map_function(mode, noremap)
    vim.validate {
        mode = { mode, 's', false },
        noremap = { noremap, 'b', false },
    }
    return function(lhs, rhs, args)
        local opts = { noremap = noremap }
        local buffer = false
        if args then
            for _, arg in pairs(args) do
                if arg == 'buffer' then
                    buffer = true
                else
                    opts[arg] = true
                end
            end
        end
        if type(rhs) == 'function' then
            table.insert(map_callbacks, rhs)
            rhs = string.format('<cmd>lua require"rrethy.nvim".do_map_callback(%d)<cr>', #map_callbacks)
        end
        if buffer then
            vim.api.nvim_buf_set_keymap(0, mode, lhs, rhs, opts)
        else
            vim.api.nvim_set_keymap(mode, lhs, rhs, opts)
        end
    end
end

function M.do_map_callback(id)
    return map_callbacks[id]()
end

M.map = make_map_function('', false)
M.nmap = make_map_function('n', false)
M.vmap = make_map_function('v', false)
M.xmap = make_map_function('x', false)
M.smap = make_map_function('s', false)
M.omap = make_map_function('o', false)
M.MAP = make_map_function('!', false)
M.imap = make_map_function('i', false)
M.lmap = make_map_function('l', false)
M.cmap = make_map_function('c', false)
M.tmap = make_map_function('t', false)
M.noremap = make_map_function('', true)
M.nnoremap = make_map_function('n', true)
M.vnoremap = make_map_function('v', true)
M.xnoremap = make_map_function('x', true)
M.snoremap = make_map_function('s', true)
M.onoremap = make_map_function('o', true)
M.NOREMAP = make_map_function('!', true)
M.inoremap = make_map_function('i', true)
M.lnoremap = make_map_function('l', true)
M.cnoremap = make_map_function('c', true)
M.tnoremap = make_map_function('t', true)

function M.set(opt)
    vim.cmd('set '..opt)
end

return M
