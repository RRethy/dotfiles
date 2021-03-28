local strfmt = string.format

local M = {}

M.callbacks = {}

-- local function highlight(hl)
--     if not hl then return '' end
--     if type(hl) == 'string' then return strfmt('%%#%s#', hl) end
--     if type(hl) == 'table' then
--         local hlgroup = 'hlgroup'
--         local hicmd = ''
--         if hl.fg then
--             hlgroup = hlgroup .. strfmt('_fg_%s', sub(hl.fg, 2))
--             hicmd = hicmd .. strfmt(' guifg=%s ', hl.fg)
--         end
--         if hl.bg then
--             hlgroup = hlgroup .. strfmt('_bg_%s', sub(hl.bg, 2))
--             hicmd = hicmd .. strfmt(' guibg=%s ', hl.bg)
--         end
--         if hl.gui then
--             hlgroup = hlgroup .. strfmt('_gui_', gsub(hl.gui, ',', ''))
--             hicmd = hicmd .. strfmt(' gui=%s ', hl.gui)
--         end
--         hicmd = strfmt('hi %s %s', hlgroup, hicmd)
--         vim.cmd(hicmd)
--         return highlight(hlgroup)
--     end
--     return ''
-- end

local function format(line, segment)
    local spec_type = type(segment)
    if spec_type == 'table' then
        for _, subseg in ipairs(segment) do
            format(line, subseg)
        end
    elseif spec_type == 'function' then
        table.insert(M.callbacks, segment)
        table.insert(line, strfmt([[%%{luaeval("require('rrethy.hotline').callback(%d)")}]], #M.callbacks))
    else
        table.insert(line, tostring(segment))
    end
    return line
end

function M.callback(id)
    return M.callbacks[id]()
end

function M.format(segment)
    return table.concat(format({}, segment))
end

function M.statusline(line)
    M._statusline = line
    vim.o.statusline = [[%!luaeval("require('rrethy.hotline').format(require('rrethy.hotline')._statusline)")]]
end

function M.tabline(line)
    M._tabline = line
    vim.o.tabline = [[%!luaeval("require('rrethy.hotline').format(require('rrethy.hotline')._tabline)")]]
end

return M
