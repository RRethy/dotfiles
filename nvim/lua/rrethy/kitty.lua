local M = {}

function M.set_colors(name)
    vim.loop.spawn('kitty', {
        args = {
            '@',
            '--to',
            vim.env.KITTY_LISTEN_ON,
            'set-colors',
            '-a',
            '-c',
            string.format('~/.config/kitty/base16-kitty/colors/base16-%s.conf', name)
        }
    }, nil)
end

return M
