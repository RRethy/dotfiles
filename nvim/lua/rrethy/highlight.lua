local strfmt, sub, gsub = string.format, string.sub, string.gsub
local bor, band, lshift, rshift = bit.bor, bit.band, bit.lshift, bit.rshift

local M = {}

function M.encode(rgb)
    return bor(lshift(rgb.r, 16), lshift(rgb.g, 8), rgb.b)
end

function M.decode(rgb)
    return {
        r = band(rshift(rgb, 16), 255),
        g = band(rshift(rgb, 8), 255),
        b = band(rgb, 255),
    }
end

function M.from_colours(hl)
    local hlgroup = 'hlgroup'
    local args = ''

    if hl.fg then
        hlgroup = hlgroup .. strfmt('_fg_%s', sub(hl.fg, 2))
        args = args .. strfmt(' guifg=%s ', hl.fg)
    end

    if hl.bg then
        hlgroup = hlgroup .. strfmt('_bg_%s', sub(hl.bg, 2))
        args = args .. strfmt(' guibg=%s ', hl.bg)
    end

    if hl.gui then
        hlgroup = hlgroup .. strfmt('_gui_', gsub(hl.gui, ',', ''))
        args = args .. strfmt(' gui=%s ', hl.gui)
    end

    local hicmd = strfmt('hi %s %s', hlgroup, args)
    vim.cmd(hicmd)

    return hlgroup
end

--- Create a new hlgroup by swapping guifg and guibg from @hlgroup.
--
-- @param ns number: namespace id
-- @param hlgroup string: name of old hlgroup
-- @return string: name of new hlgroup
function M.inverse(ns, hlgroup)
    local hl = vim.api.nvim_get_hl_by_name(hlgroup, true)
    hl.foreground, hl.background = hl.background, hl.foreground
    local newhlgroup = hlgroup..'_rrethy_inversed'
    vim.api.nvim_set_hl(ns, newhlgroup, hl)
    return newhlgroup
end

return M
