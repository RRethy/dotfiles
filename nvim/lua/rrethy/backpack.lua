-- TODO add a log file to diagnose errors

local echoerr = vim.api.nvim_err_writeln

local M = {}

local opt = vim.fn.stdpath('data')..'/site/pack/backpack/opt/'
local manifest = vim.fn.stdpath('config')..'/packmanifest.lua'

local function to_git_url(author, plugin)
    if author == 'RRethy' then
        return string.format('git@github.com:%s/%s.git', author, plugin)
    else
        return string.format('https://github.com:%s/%s.git', author, plugin)
    end
end

local function parse_url(url)
    local username, plugin = string.match(url, '^https://github.com/([^/]+)/([^/]+)$')
    if not username or not plugin then
        return
    end

    local git_url
    if username == 'RRethy' then
        git_url = string.format('git@github.com:%s/%s.git', username, plugin)
    else
        git_url = string.format('https://github.com/%s/%s.git', username, plugin)
    end

    return git_url, username, plugin
end

local function git_pull(name, on_success)
    local dir = opt..name
    local branch = vim.fn.system("git -C "..dir.." branch --show-current | tr -d '\n'")
    vim.loop.spawn('git', {
        args = { 'pull', 'origin', branch, '--update-shallow', '--ff-only', '--progress', '--rebase=false' },
        cwd = dir,
    }, vim.schedule_wrap(function(code)
            if code == 0 then
                on_success(name)
            else
                echoerr(name..' pulled unsuccessfully')
            end
        end))
end

local function git_clone(name, git_url, on_success)
    vim.loop.spawn('git', {
        args = { 'clone', '--depth=1', git_url },
        cwd = opt,
    }, vim.schedule_wrap(function(code)
            if code == 0 then
                on_success(name)
            else
                echoerr(name..' cloned unsuccessfully')
            end
        end))
end

function M.setup()
    vim.fn.mkdir(opt, 'p')

    M.plugins = {}
    _G.use = function(opts)
        local _, _, author, plugin = string.find(opts[1], '^([^ /]+)/([^ /]+)$')
        table.insert(M.plugins, {
            plugin = plugin,
            author = author,
            post_update = opts.post_update,
        })
        if vim.fn.isdirectory(opt..'/'..plugin) ~= 0 then
            vim.cmd('packadd! '..plugin)
        else
            git_clone(plugin, to_git_url(author, plugin), function()
                vim.cmd('packadd! '..plugin)
            end)
        end
    end
    if vim.fn.filereadable(manifest) ~= 0 then
        dofile(manifest)
    end
    _G.use = nil

    vim.cmd [[ command! -nargs=1 PackAdd lua require('rrethy.backpack').pack_add(<f-args>) ]]
    vim.cmd [[ command! PackUpdate lua require('rrethy.backpack').pack_update() ]]
    vim.cmd [[ command! PackEdit lua require('rrethy.backpack').pack_edit() ]]
end

function M.pack_add(url)
    local git_url, author, plugin = parse_url(url)
    if not git_url then
        return
    end

    table.insert(M.plugins, {
        plugin = plugin,
        author = author,
    })
    local on_success = function()
        vim.cmd('packadd '..plugin)
        vim.cmd('helptags ALL')
    end
    if vim.fn.isdirectory(opt..plugin) ~= 0 then
        git_pull(plugin, on_success)
    else
        git_clone(plugin, git_url, on_success)
    end

    vim.fn.system(string.format('echo "use { \'%s/%s\' }" >> %s', author, plugin, manifest))
end

function M.pack_update()
    for _, data in ipairs(M.plugins) do
        local on_success = function(plugin)
            vim.cmd('packadd '..plugin)
            if data.post_update then
                local dir = opt..'/'..plugin
                if type(data.post_update) == 'function' then
                    data.post_update(dir)
                elseif type(data.post_update) == 'table' then
                    vim.loop.spawn(data.post_update[1], { args = data.post_update.args, cwd = dir },
                        vim.schedule_wrap(function(code)
                            if code ~= 0 then
                                vim.api.nvim_err_writeln(string.format('Failed to run %s', vim.inspect(data.post_update)))
                            end
                        end))
                end
            end
        end
        if vim.fn.isdirectory(opt..data.plugin) ~= 0 then
            git_pull(data.plugin, on_success)
        else
            git_clone(data.plugin, git_clone, on_success)
        end
    end
end

function M.pack_edit()
    vim.cmd('tabnew')
    vim.cmd('edit '..manifest)
end

return M
