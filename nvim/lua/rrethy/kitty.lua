local M = {}

function M.set_colors(name)
    vim.loop.spawn('kitty', {
        args = {
            '@',
            '--to',
            vim.env.KITTY_LISTEN_ON,
            'set-colors',
            -- '-a', -- update for all windows
            '-c', -- update for new windows
            string.format('~/.config/kitty/base16-kitty/colors/%s.conf', name)
        }
    }, nil)
end

return M
